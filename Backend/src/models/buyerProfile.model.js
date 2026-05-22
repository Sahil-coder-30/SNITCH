import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  type: { type: String, default: "Home" },
  line1: { type: String, default: "" },
  line2: { type: String, default: "" },
  phone: { type: String, default: "" }
});

const paymentMethodSchema = new mongoose.Schema({
  type: { type: String, default: "card" }, // card, upi, etc.
  label: { type: String, default: "" }, // Visa, MasterCard, UPI, etc.
  last4: { type: String, default: "" }, // for cards
  id: { type: String, default: "" }, // for UPI/other IDs
  icon: { type: String, default: "" }
});

const buyerProfileSchema = new mongoose.Schema(
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
    dob: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "Prefer not to say",
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
      orders: { type: Number, default: 0 },
      wishlist: { type: Number, default: 0 },
      reviews: { type: Number, default: 0 }
    },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema],
    profilePicture: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

const buyerProfileModel = mongoose.model("BuyerProfile", buyerProfileSchema);

export default buyerProfileModel;
