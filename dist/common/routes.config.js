"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_config_1 = require("./middleware.config");
/**
 * Class for configuring and managing routes.
 * @class RouterConfigure
 */
class RouterConfigure {
    app;
    totalRoutes = 0;
    /**
     * Creates an instance of RouterConfigure.
     * @param {Express} app - The Express application instance.
     */
    constructor(app) {
        this.app = app;
    }
    /**
     * Configures a group of routes and adds them to the Express application.
     * @param {RouteConfig} config - The configuration for the group of routes.
     */
    configureRoute(config) {
        let { prefix, routes, middleware = [], isPublic } = config;
        if (!isPublic) {
            console.info('\nApplying authentication middleware to :', prefix);
            this.app.use(`/${prefix}`, [
                ...(middleware ?? []),
                middleware_config_1.middleware.authMiddleware({ method: 'jwt' }),
            ]);
        }
        else if (isPublic && middleware.length > 0) {
            console.info('Public :', prefix);
            this.app.use(`/${prefix}`, middleware);
        }
        routes.forEach((route, index) => {
            this.app.use(`/${prefix}`, route);
            console.log(`\n${this.totalRoutes + 1}. ${config.prefix?.toUpperCase()} routes :\n`);
            this.totalRoutes = +1;
            this.showRoutes({ prefix, route }, index);
        });
    }
    /**
     * Displays information about the configured routes.
     * @param {ShowRoutes} config - The configuration for displaying routes.
     */
    showRoutes(config, index) {
        const routes = config.route?.stack
            .filter((layer) => layer.route)
            .map((layer) => {
            return {
                path: layer.route.path,
                //@ts-ignore
                methods: layer.route.methods,
            };
        }) ?? [];
        routes?.forEach((route) => {
            console.log(`${Object.keys(route.methods)
                .map((method) => method.toUpperCase())
                .join(', ')}  /${config.prefix}${route.path}`);
        });
    }
}
exports.default = RouterConfigure;
