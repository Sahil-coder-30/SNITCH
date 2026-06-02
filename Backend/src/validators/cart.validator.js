import { body, param, validationResult } from "express-validator";

const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ─── Add to Cart ─────────────────────────────────────────────────────────────
export const validateAddToCart = [
  param("productId")
    .exists({ checkFalsy: true })
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("quantity")
    .exists({ checkFalsy: true })
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("size")
    .exists({ checkFalsy: true })
    .withMessage("Size is required")
    .bail()
    .isString()
    .withMessage("Size must be a string")
    .trim()
    .toUpperCase()
    .isIn(VALID_SIZES)
    .withMessage(`Size must be one of: ${VALID_SIZES.join(", ")}`),

  validateRequest,
];

// ─── Decrement / Remove Cart Item ─────────────────────────────────────────────
export const validateCartItemId = [
  param("cartItemId")
    .exists({ checkFalsy: true })
    .withMessage("Cart item ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid cart item ID"),

  validateRequest,
];

// ─── Shared error handler ─────────────────────────────────────────────────────
export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    status: "error",
    message: "Validation failed",
    errors: errors
      .array()
      .map((err) => ({ field: err.param ?? err.path, message: err.msg })),
  });
}
