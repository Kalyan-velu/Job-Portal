import express, { Express, Router } from 'express';
import { middleware as middlewareConfig } from './middleware.config';
/**
 * Configuration for a group of routes.
 * @interface RouteConfig
 * @property {string} prefix - The common prefix for all routes in the group.
 * @property {Router[]} routes - An array of Express Routers.
 * @property {Array<express.RequestHandler>}
 */
export interface RouteConfig {
  prefix: string;
  routes: Router[];
  middleware?: Array<express.RequestHandler>; // Optional middleware
  isPublic?: boolean;
}

/**
 * Configuration for displaying routes.
 * @interface ShowRoutes
 * @property {string} prefix - The common prefix for all routes in the group.
 * @property {express.Router} route - The Express Router.
 */
export interface ShowRoutes {
  prefix: string;
  route: express.Router;
}

/**
 * Class for configuring and managing routes.
 * @class RouterConfigure
 */
class RouterConfigure {
  private app: Express;
  private totalRoutes: number = 0;

  /**
   * Creates an instance of RouterConfigure.
   * @param {Express} app - The Express application instance.
   */
  constructor(app: Express) {
    this.app = app;
  }

  /**
   * Configures a group of routes and adds them to the Express application.
   * @param {RouteConfig} config - The configuration for the group of routes.
   */
  configureRoute(config: RouteConfig) {
    let { prefix, routes, middleware = [], isPublic } = config;
    if (!isPublic) {
      console.info('\nApplying authentication middleware to :', prefix);
      this.app.use(`/${prefix}`, [
        ...(middleware ?? []),
        middlewareConfig.authMiddleware({ method: 'jwt' }),
      ]);
    } else if (isPublic && middleware.length > 0) {
      console.info('Public :', prefix);
      this.app.use(`/${prefix}`, middleware);
    }
    routes.forEach((route, index) => {
      this.app.use(`/${prefix}`, route);
      console.log(
        `\n${this.totalRoutes + 1}. ${config.prefix?.toUpperCase()} routes :\n`,
      );
      this.totalRoutes = +1;
      this.showRoutes({ prefix, route }, index);
    });
  }

  /**
   * Displays information about the configured routes.
   * @param {ShowRoutes} config - The configuration for displaying routes.
   */
  showRoutes(config: ShowRoutes, index?: number) {
    const routes =
      config.route?.stack
        .filter((layer) => layer.route)
        .map((layer) => {
          return {
            path: layer.route.path,
            //@ts-ignore
            methods: layer.route.methods,
          };
        }) ?? [];

    routes?.forEach((route) => {
      console.log(
        `${Object.keys(route.methods)
          .map((method) => method.toUpperCase())
          .join(', ')}  /${config.prefix}${route.path}`,
      );
    });
  }
}

export default RouterConfigure;
