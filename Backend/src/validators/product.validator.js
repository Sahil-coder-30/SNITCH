import { body, validationResult } from 'express-validator';

export const productValidationRules = () => {
    return [
        body('title').notEmpty().withMessage('Title is required').trim(),
        body('brand').notEmpty().withMessage('Brand is required').trim(),
        body('description').notEmpty().withMessage('Description is required'),
        body('originalPrice').custom((value) => {
            let parsed = value;
            if (typeof value === 'string') parsed = JSON.parse(value);
            if (!parsed.amount || !parsed.currency) {
                throw new Error('originalPrice must include amount and currency');
            }
            return true;
        }),
        body('price').custom((value) => {
            let parsed = value;
            if (typeof value === 'string') parsed = JSON.parse(value);
            if (!parsed.amount || !parsed.currency) {
                throw new Error('price must include amount and currency');
            }
            return true;
        }),
        body('category').custom((value) => {
            let parsed = value;
            if (typeof value === 'string') parsed = JSON.parse(value);
            if (!parsed.for || !parsed.name) {
                throw new Error('category must include "for" and "name" properties');
            }
            const allowedFor = ["Mens", "Womens", "Kids"];
            if (!allowedFor.includes(parsed.for)) {
                throw new Error('Invalid category.for type');
            }
            return true;
        }),
        body('styleCode').notEmpty().withMessage('styleCode is required').trim(),
        body('color').custom((value) => {
            let parsed = value;
            if (typeof value === 'string') {
                try {
                    parsed = JSON.parse(value);
                } catch (e) {
                    throw new Error('Invalid color JSON format');
                }
            }
            if (!parsed || !parsed.name || !parsed.hex) {
                throw new Error('color must include "name" and "hex" properties');
            }
            return true;
        }),
        body('sizes').custom((value) => {
            let parsed = value;
            if (typeof value === 'string') {
                try {
                    parsed = JSON.parse(value);
                } catch (e) {
                    throw new Error('Invalid sizes JSON format');
                }
            }
            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new Error('sizes must be a non-empty array');
            }
            const allowedSizes = ["XS", "S", "M", "L", "XL", "XXL"];
            for (const item of parsed) {
                if (!item.size || !allowedSizes.includes(item.size)) {
                    throw new Error(`Invalid or missing size. Allowed: ${allowedSizes.join(', ')}`);
                }
                const qty = Number(item.quantity);
                if (isNaN(qty) || qty < 0) {
                    throw new Error(`Invalid quantity for size ${item.size}`);
                }
            }
            return true;
        })
    ];
};

export const validateProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const formattedErrors = errors.array().map(err => ({ field: err.path, message: err.msg }));
    return res.status(400).json({
        errors: formattedErrors,
    });
};
