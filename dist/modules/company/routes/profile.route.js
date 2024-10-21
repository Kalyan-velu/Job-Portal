"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profile_controller_1 = require("@/modules/company/controllers/profile.controller");
const express_1 = require("express");
const companyProfileRouter = (0, express_1.Router)();
companyProfileRouter.post('/create', profile_controller_1.Create);
exports.default = companyProfileRouter;
