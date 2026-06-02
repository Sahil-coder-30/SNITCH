import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    size: {
        type: String,
        required: true,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    quantity: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;