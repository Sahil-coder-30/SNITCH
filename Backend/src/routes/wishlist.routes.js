import express from "express";
import { identifyUser } from "../middleware/identifyUser.middleware.js";
import {
    addToWishlist,
    removeFromWishlist,
    getUserWishList,
    isProductInWishList,
} from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();

// All wishlist routes require authentication
wishlistRouter.use(identifyUser);

wishlistRouter.get("/", getUserWishList);
wishlistRouter.post("/add/:productId", addToWishlist);
wishlistRouter.post("/remove/:productId", removeFromWishlist);
wishlistRouter.get("/check/:productId", isProductInWishList);

export default wishlistRouter;
