"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistration = exports.validateRequestBody = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("../zod/user.schema");
// Middleware function to validate and update request body using Zod
const validateRequestBody = (schema) => {
    return (req, res, next) => {
        try {
            const parsedBody = schema.parse(req.body); // Validate the request body against the Zod schema
            req.body = parsedBody; // Reassign the parsed body back to req.body
            next(); // Proceed to the next middleware or route handler
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Send validation errors to the client
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors, // Return detailed validation errors from Zod
                });
                return; // Ensure no further middleware is executed
            }
            // Handle other potential errors
            res.status(500).json({
                success: false,
                message: 'An unexpected error occurred',
            });
        }
    };
};
exports.validateRequestBody = validateRequestBody;
const validateRegistration = (req, res, next) => {
    try {
        const body = req.body;
        const role = user_schema_1.roleSchema.parse(body.role);
        switch (role) {
            case 'company':
                req.body = user_schema_1.companySchema.parse(body);
                break;
            case 'employer':
                req.body = user_schema_1.employerSchema.parse(body);
                break;
            case 'applicant':
                req.body = user_schema_1.applicantSchema.parse(body);
                break;
            default:
                break;
        }
        if (role === 'company') {
            req.body = user_schema_1.companySchema.parse(req.body);
        }
        next(); // If validation passes, proceed to the next middleware or route handler
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors, // Return detailed validation errors from Zod
            });
            return;
        }
        // Handle other potential errors
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
        });
    }
};
exports.validateRegistration = validateRegistration;
