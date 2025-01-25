const Joi = require('joi');

// Define validation schema
const bankAccountSchema = Joi.object({
    ifscCode: Joi.string()
        .required()
        .messages({
            "string.pattern.base": "Invalid IFSC code format.",
            "any.required": "IFSC code is required.",
        }),
    branchName: Joi.string().min(3).max(100).required().messages({
        "string.min": "Branch name must be at least 3 characters long.",
        "string.max": "Branch name cannot exceed 100 characters.",
        "any.required": "Branch name is required.",
    }),
    bankName: Joi.string().min(3).max(100).required().messages({
        "string.min": "Bank name must be at least 3 characters long.",
        "string.max": "Bank name cannot exceed 100 characters.",
        "any.required": "Bank name is required.",
    }),
    accountNumber: Joi.string().pattern(/^\d{9,18}$/).required().messages({
        "string.pattern.base": "Account number must be between 9 to 18 digits.",
        "any.required": "Account number is required.",
    }),
    accountHolderName: Joi.string().min(3).max(100).required().messages({
        "string.min": "Account holder name must be at least 3 characters long.",
        "string.max": "Account holder name cannot exceed 100 characters.",
        "any.required": "Account holder name is required.",
    }),
});

const validateBankAccount = (req, res, next) => {
    const { error } = bankAccountSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((err) => err.message),
        });
    }
    
    next();
};

module.exports = validateBankAccount;
