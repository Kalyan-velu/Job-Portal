"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const Auth = {
    prefix: 'auth',
    routes: [auth_route_1.default],
    isPublic: true,
};
const User = {
    prefix: 'user',
    routes: [user_route_1.default],
};
const modules = { Auth, User };
exports.default = modules;
