"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserWithoutPasswordProjection = void 0;
const user_model_1 = require("../../models/user.model");
const findUserWithoutPasswordProjection = async (email) => {
    return await user_model_1.User.findOne({ email }, { password: 0 });
};
exports.findUserWithoutPasswordProjection = findUserWithoutPasswordProjection;
