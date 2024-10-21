"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.getCurrentUser = void 0;
const response_1 = require("../../../common/response");
const getCurrentUser = (req, res) => {
    try {
        (0, response_1.sendSuccessResponse)(res, req.user);
    }
    catch (e) {
        (0, response_1.sendErrorResponse)(res, e, 500);
    }
};
exports.getCurrentUser = getCurrentUser;
const getAllUser = (req, res) => {
    try {
        (0, response_1.sendSuccessResponse)(res, {});
    }
    catch (e) {
        (0, response_1.sendErrorResponse)(res, e, 500);
    }
};
exports.getAllUser = getAllUser;
