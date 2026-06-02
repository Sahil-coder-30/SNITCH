import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    size: {
        type: String,
        required: true,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true, enum: ["USD", "EUR", "GBP", "INR"] },
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },
    items: [cartItemSchema],
}, { timestamps: true });

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
