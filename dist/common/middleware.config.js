"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const response_1 = require("./response");
class MiddlewareConfig {
    app;
    configureMiddleware(app) {
        this.app = app;
        console.debug('ℹ️ ~ Configuring middleware...');
        this.app.use((0, cors_1.default)());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, morgan_1.default)('combined'));
        this.app.use(express_1.default.json());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.errorHandlingMiddleware();
        this.staticFileServerMiddleware();
    }
    staticFileServerMiddleware() {
        this.app.use(express_1.default.static('public')); // Serve static files from 'public' directory
    }
    errorHandlingMiddleware() {
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send({ error: 'Something broke!' });
        });
    }
    /**
     * Middleware to authenticate based on specified method.
     * @param {AuthConfig} config - Configuration for authentication method.
     * @returns {Function} - Express middleware function.
     */
    authMiddleware = (config) => {
        return (req, res, next) => {
            switch (config.method) {
                case 'jwt':
                    return (0, auth_middleware_1.jwtAuth)(req, res, next);
                case 'session':
                    return (0, auth_middleware_1.sessionAuth)(req, res, next);
                case 'oauth':
                    return (0, auth_middleware_1.oauthAuth)(req, res, next);
                default:
                    (0, response_1.sendErrorResponse)(res, 'Invalid authentication method', 400);
            }
        };
    };
    attach({ name, property }) {
        this.app.use((req, res, next) => {
            req[name] = property; // Attach the property to the request object
            next(); // Call the next middleware in the stack
        });
    }
    log() {
        console.log('s');
    }
}
exports.middleware = new MiddlewareConfig();
exports.default = MiddlewareConfig;
