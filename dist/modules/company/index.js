"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profile_route_1 = __importDefault(require("@/modules/company/routes/profile.route"));
const CompanyModule = {
    prefix: 'company',
    routes: [profile_route_1.default],
};
exports.default = CompanyModule;
