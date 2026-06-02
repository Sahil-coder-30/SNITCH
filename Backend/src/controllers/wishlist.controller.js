import Wishlist from "../models/wishlist.model.js";
import productModel from "../models/product.model.js";

// ─── Add To Wishlist ──────────────────────────────────────────────────────────
export const addToWishlist = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { size } = req.body;

    try {
        if (!size) {
            const err = new Error("Size is required");
            err.statusCode = 400;
            return next(err);
        }

        // Check if this exact product+size combo already exists
        const existingItem = await Wishlist.findOne({
            user: userId,
            product: productId,
            size,
        });

        if (existingItem) {
            const err = new Error("Item already in wishlist");
            err.statusCode = 400;
            return next(err);
        }

        const wishlistItem = await Wishlist.create({
            user: userId,
            product: productId,
            size,
        });

        await wishlistItem.populate({ path: "product", select: "title brand coverImage price originalPrice discountPercent rating reviewCount color sizes badge category" });

        return res.status(201).json({
            message: "Item added to wishlist",
            item: wishlistItem,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Remove From Wishlist ─────────────────────────────────────────────────────
export const removeFromWishlist = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;
    const { size } = req.body;

    try {
        const existingItem = await Wishlist.findOne({
            user: userId,
            product: productId,
            size,
        });

        if (!existingItem) {
            const err = new Error("Item not found in wishlist");
            err.statusCode = 404;
            return next(err);
        }

        await existingItem.deleteOne();

        return res.status(200).json({
            message: "Item removed from wishlist",
        });
    } catch (error) {
        next(error);
    }
};

// ─── Get User Wishlist ────────────────────────────────────────────────────────
export const getUserWishList = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const wishlistItems = await Wishlist.find({ user: userId })
            .populate({
                path: "product",
                select: "title brand coverImage price originalPrice discountPercent rating reviewCount color sizes badge category",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist: wishlistItems,
            count: wishlistItems.length,
        });
    } catch (error) {
        next(error);
    }
};

// ─── Check Product In Wishlist ────────────────────────────────────────────────
export const isProductInWishList = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const items = await Wishlist.find({ user: userId, product: productId });

        return res.status(200).json({
            message: items.length > 0 ? "Item found in wishlist" : "Item not found in wishlist",
            isInWishlist: items.length > 0,
            sizes: items.map((i) => i.size),
        });
    } catch (error) {
        next(error);
    }
};