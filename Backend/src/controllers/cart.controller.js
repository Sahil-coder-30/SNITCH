import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

// ─── Shared helper: populate + compute cart summary ─────────────────────────
const PRODUCT_SELECT =
    "title brand coverImage price originalPrice discountPercent rating reviewCount color sizes badge category";

const buildCartResponse = (userCart) => {
    const itemCount = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = userCart.items.reduce(
        (sum, item) => sum + item.price.amount * item.quantity,
        0
    );

    return {
        _id: userCart._id,
        user: userCart.user,
        items: userCart.items,
        itemCount,
        subtotal: parseFloat(subtotal.toFixed(2)),
        currency: userCart.items[0]?.price.currency ?? "INR",
        updatedAt: userCart.updatedAt,
    };
};

// ─── Add to Cart ─────────────────────────────────────────────────────────────
export const addToCart = async (req, res, next) => {
    const { productId } = req.params;
    const { quantity, size } = req.body;
    const userId = req.user.id;

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            const err = new Error("Product not found");
            err.statusCode = 404;
            return next(err);
        }

        const sizeEntry = product.sizes.find((s) => s.size === size);

        if (!sizeEntry || sizeEntry.quantity < quantity) {
            const err = new Error(`Only ${sizeEntry ? sizeEntry.quantity : 0} items available in stock`);
            err.statusCode = 400;
            return next(err);
        }

        // Find or create the user's cart safely
        let userCart = await cartModel.findOne({ user: userId });
        if (!userCart) {
            userCart = new cartModel({ user: userId, items: [] });
        }

        const cartItem = userCart.items.find(
            (item) => item.product.toString() === productId && item.size === size
        );

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            userCart.items.push({
                product: productId,
                quantity,
                size,
                price: {
                    amount: product.price.amount,
                    currency: product.price.currency,
                },
            });
        }

        // Decrement stock in product model
        sizeEntry.quantity -= quantity;
        await product.save();

        await userCart.save();

        // Re-fetch with populated product data so response is consistent
        userCart = await cartModel
            .findById(userCart._id)
            .populate({ path: "items.product", select: PRODUCT_SELECT });

        return res.status(200).json({
            message: cartItem
                ? "Product quantity updated successfully"
                : "Product added to cart successfully",
            cart: buildCartResponse(userCart),
        });
    } catch (err) {
        next(err);
    }
};

// ─── Get Cart ─────────────────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
    try {
        // Find the cart or create a fresh empty one safely
        let userCart = await cartModel
            .findOne({ user: req.user.id })
            .populate({ path: "items.product", select: PRODUCT_SELECT });

        if (!userCart) {
            userCart = new cartModel({ user: req.user.id, items: [] });
            await userCart.save();
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart: buildCartResponse(userCart),
        });
    } catch (err) {
        next(err);
    }
};

// ─── Decrement Item ───────────────────────────────────────────────────────────
export const decrementItem = async (req, res, next) => {
    const { cartItemId } = req.params;

    try {
        const userCart = await cartModel.findOne({ user: req.user.id });

        if (!userCart) {
            const err = new Error("Cart not found");
            err.statusCode = 404;
            return next(err);
        }

        const cartItem = userCart.items.find(
            (item) => item._id.toString() === cartItemId
        );

        if (!cartItem) {
            const err = new Error("Item not found in cart");
            err.statusCode = 404;
            return next(err);
        }

        // Return 1 item back to product stock
        await productModel.updateOne(
            { _id: cartItem.product, "sizes.size": cartItem.size },
            { $inc: { "sizes.$.quantity": 1 } }
        );

        cartItem.quantity -= 1;

        if (cartItem.quantity === 0) {
            userCart.items.pull({ _id: cartItemId });
        }

        await userCart.save();

        // Re-fetch with populated product data
        const updatedCart = await cartModel
            .findById(userCart._id)
            .populate({ path: "items.product", select: PRODUCT_SELECT });

        return res.status(200).json({
            message:
                cartItem.quantity === 0
                    ? "Item removed from cart"
                    : "Item quantity decremented successfully",
            cart: buildCartResponse(updatedCart),
        });
    } catch (err) {
        next(err);
    }
};

// ─── Remove Item (Delete completely) ──────────────────────────────────────────
export const removeItem = async (req, res, next) => {
    const { cartItemId } = req.params;

    try {
        const userCart = await cartModel.findOne({ user: req.user.id });

        if (!userCart) {
            const err = new Error("Cart not found");
            err.statusCode = 404;
            return next(err);
        }

        const cartItem = userCart.items.find(
            (item) => item._id.toString() === cartItemId
        );

        if (!cartItem) {
            const err = new Error("Item not found in cart");
            err.statusCode = 404;
            return next(err);
        }

        // Return all quantity of this item back to product stock
        await productModel.updateOne(
            { _id: cartItem.product, "sizes.size": cartItem.size },
            { $inc: { "sizes.$.quantity": cartItem.quantity } }
        );

        userCart.items.pull({ _id: cartItemId });
        await userCart.save();

        const updatedCart = await cartModel
            .findById(userCart._id)
            .populate({ path: "items.product", select: PRODUCT_SELECT });

        return res.status(200).json({
            message: "Item removed from cart successfully",
            cart: buildCartResponse(updatedCart),
        });
    } catch (err) {
        next(err);
    }
};