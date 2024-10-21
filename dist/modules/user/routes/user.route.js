"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user = (0, express_1.Router)();
user.route('/me').get(user_controller_1.getCurrentUser);
exports.default = user;
