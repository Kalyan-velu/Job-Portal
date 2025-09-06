# Multi-stage Dockerfile for Job-Portal (client + server)
# Builder stage: build client and compile server TypeScript
FROM node:20-alpine AS builder

# Set working directory for the monorepo
WORKDIR /workspace

# Enable pnpm via corepack (version aligned with repo)
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

# Copy repository content
# Note: for best caching, ideally copy only package.json/lockfiles first.
COPY . .

# Build client
WORKDIR /workspace/client
RUN pnpm install
RUN pnpm run build

# Build server (TypeScript -> dist)
WORKDIR /workspace/server
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm run build:server


# Runtime stage
FROM node:20-alpine AS runtime
ENV NODE_ENV=production

# Ensure pnpm is available for installing production deps
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

WORKDIR /app

# Copy server package manifest and install only production dependencies
COPY --from=builder /workspace/server/package.json ./package.json
# Copy lockfile if present (the wildcard won't fail if it doesn't exist)
COPY --from=builder /workspace/server/pnpm-lock.yaml* ./
RUN pnpm install --prod

# Copy compiled server and static client build
COPY --from=builder /workspace/server/dist ./dist
# The server serves client from ../client/dist when NODE_ENV=production
# Preserve that relative path structure inside the image
RUN mkdir -p ../client/dist
COPY --from=builder /workspace/client/dist ../client/dist

# Default environment values (can be overridden at runtime)
ENV PORT=3000
# You should provide your own DB connection string and other secrets via -e or docker compose
# ENV MONGODB_URI=...

# Expose the default port (informational)
EXPOSE 3000

# Start the server
CMD ["node", "./dist/bin/www.js"]

