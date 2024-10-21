"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = exports.Login = void 0;
const response_1 = require("../../../common/response");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const user_model_1 = require("../../../models/user.model");
const Login = async (req, res) => {
    try {
        const userDoc = await user_model_1.User.findOne({ email: req.body.email });
        if (!userDoc) {
            (0, response_1.sendErrorResponse)(res, "User doesn't  exist", 402);
            return;
        }
        // Verify the password (assuming you have a method on your User model)
        const isPasswordValid = await userDoc.comparePassword(req.body.password); // Assuming you have this method
        if (!isPasswordValid) {
            (0, response_1.sendErrorResponse)(res, 'Invalid password', 401); // Unauthorized
            return;
        }
        const user = userDoc.toJSON();
        req.user = { ...user };
        const token = (0, auth_middleware_1.createSession)(req, res);
        if (user.role === 'employer' && !user.companyId) {
            (0, response_1.sendSuccessResponse)(res, {
                token,
                message: 'Please complete your company profile',
                redirectTo: '/update-company',
            });
            return;
        }
        else if (user.role === 'applicant' && !user.applicantId) {
            (0, response_1.sendSuccessResponse)(res, {
                token,
                message: 'Please complete your profile',
                redirectTo: '/update-applicant',
            });
            return;
        }
        (0, response_1.sendSuccessResponse)(res, { token, type: 'authorization' }, 'Success');
        return;
    }
    catch (e) {
        (0, response_1.sendErrorResponse)(res, e, 500);
        return;
    }
};
exports.Login = Login;
const Register = async (req, res) => {
    try {
        const { role, email, password } = req.body;
        const userExist = await user_model_1.User.findOne({ email });
        if (userExist) {
            return (0, response_1.sendErrorResponse)(res, 'User already exists.', 400);
        }
        const newUser = new user_model_1.User({
            email,
            password, // Remember to hash the password
            role,
        });
        await newUser.save();
        await newUser.save();
        // Return the user without the password
        const user = newUser.toJSON();
        delete user.password;
        return (0, response_1.sendSuccessResponse)(res, user, 'User registered successfully.');
    }
    catch (e) {
        return (0, response_1.sendErrorResponse)(res, e.message || 'Internal server error', 500);
    }
};
exports.Register = Register;
