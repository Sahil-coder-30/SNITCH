import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    gstin: {
      type: String,
      default: "",
    },
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" }
    },
    memberSince: {
      type: String,
      default: () => {
        const date = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      },
    },
    stats: {
      revenue: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      activeListings: { type: Number, default: 0 },
      rating: { type: Number, default: 5.0 }
    },
    profilePicture: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

const sellerProfileModel = mongoose.model("SellerProfile", sellerProfileSchema);

export default sellerProfileModel;
