import express from "express";
import { validateAddToCart, validateCartItemId } from "../validators/cart.validator.js";
import { identifyUser } from "../middleware/identifyUser.middleware.js";
import {
    addToCart,
    getCart,
    decrementItem,
    removeItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add/:productId", identifyUser, validateAddToCart, addToCart);
router.get("/get", identifyUser, getCart);
router.post("/decrement/:cartItemId", identifyUser, validateCartItemId, decrementItem);
router.delete("/remove/:cartItemId", identifyUser, validateCartItemId, removeItem);

export default router;