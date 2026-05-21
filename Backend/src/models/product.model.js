import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    originalPrice: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true, enum: ["USD", "EUR", "GBP", "INR"] },
    },

    // Selling price after discount
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true, enum: ["USD", "EUR", "GBP", "INR"] },
    },

    // Percentage (0–100)
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },

    // Computed from reviews — not manually set
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    stock: [
      {
        size: {
          type: String,
          required: true,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
        },
        quantity: { type: Number, required: true, min: 0 },
        colors: [
          {
            name: { type: String, required: true },
            hex: { type: String, required: true },
            images: [{ type: String, required: true }], // plain URL strings
          },
        ],
      },
    ],

    coverImage: { type: String, required: true }, // plain URL

    category: {
      for: {
        type: String,
        required: true,
        enum: ["Mens", "Womens", "Kids"],
      },
      name: {
        type: String,
        required: true,
        enum: [
          "Tshirts", "Shirts", "Jeans", "Trousers",
          "Dresses", "Skirts", "Jackets", "Coats",
          "Shoes", "Accessories",
        ],
      },
    },

    // Merged badge + badgeType into one field
    badge: {
      type: String,
      enum: ["new-arrival", "best-seller", "limited-edition", "sale"],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for common query patterns
productSchema.index({ "category.for": 1, "category.name": 1 });
productSchema.index({ seller: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ "price.amount": 1 });

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
