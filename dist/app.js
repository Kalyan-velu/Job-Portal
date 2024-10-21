"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const database_config_1 = __importDefault(require("./common/database.config"));
const middleware_config_1 = require("./common/middleware.config");
const routes_config_1 = __importDefault(require("./common/routes.config"));
const applicants_1 = __importDefault(require("./modules/applicants"));
const company_1 = __importDefault(require("./modules/company"));
const job_1 = __importDefault(require("./modules/job"));
const user_1 = __importDefault(require("./modules/user"));
const app = (0, express_1.default)();
const configApi = new routes_config_1.default(app);
const mongoose = database_config_1.default.connectDB();
middleware_config_1.middleware.configureMiddleware(app);
middleware_config_1.middleware.attach({ name: 'mongoose', property: mongoose });
const modules = [
    applicants_1.default,
    user_1.default.Auth,
    user_1.default.User,
    job_1.default,
    company_1.default,
];
for (let module of modules) {
    configApi.configureRoute(module);
}
exports.default = app;
