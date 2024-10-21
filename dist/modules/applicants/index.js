"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_route_1 = __importDefault(require("./routes/general.route"));
const Applicant = {
    prefix: 'applicant',
    routes: [general_route_1.default],
};
exports.default = Applicant;
