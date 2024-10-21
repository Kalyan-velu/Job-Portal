"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Create = void 0;
const response_1 = require("@/common/response");
const Create = (req, res) => {
    try {
        (0, response_1.sendSuccessResponse)(res, {}, 'Success');
        return;
    }
    catch (e) {
        (0, response_1.sendErrorResponse)(res, e, 500);
        return;
    }
};
exports.Create = Create;
