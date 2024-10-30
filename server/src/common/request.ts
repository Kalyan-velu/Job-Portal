import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

// Middleware function to validate and update request body using Zod
export const validateRequestBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.debug('ℹ️ ~ file: request.ts:7 ~ return ~ req:', req.body)
    try {
      const parsedBody = schema.parse(req.body) // Validate the request body against the Zod schema

      req.body = parsedBody // Reassign the parsed body back to req.body
      next() // Proceed to the next middleware or route handler
    } catch (error) {
      console.debug('ℹ️ ~ file: request.ts:16 ~ return ~ error:', error)
      if (error instanceof ZodError) {
        // Send validation errors to the client
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors, // Return detailed validation errors from Zod
        })
        return // Ensure no further middleware is executed
      }

      // Handle other potential errors
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred',
      })
      return
    }
  }
}

// export const validateRegistration = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   try {
//     const body = req.body;
//     const role = roleSchema.parse(body.role);

//     switch (role) {
//       case 'company':
//         req.body = companySchema.parse(body);
//         break;
//       case 'employer':
//         req.body = employerSchema.parse(body);
//         break;
//       case 'applicant':
//         req.body = applicantSchema.parse(body);
//         break;
//       default:
//         break;
//     }
//     if (role === 'company') {
//       req.body = companySchema.parse(req.body);
//     }
//     next(); // If validation passes, proceed to the next middleware or route handler
//   } catch (error) {
//     if (error instanceof ZodError) {
//       res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.errors, // Return detailed validation errors from Zod
//       });
//       return;
//     }
//     // Handle other potential errors
//     res.status(500).json({
//       success: false,
//       message: 'An unexpected error occurred',
//     });
//   }
// };
