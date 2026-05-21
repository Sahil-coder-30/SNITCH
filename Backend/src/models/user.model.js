import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      default: "",
      sparse: true,
    },
    role: {
      type: String,
      enum: ["BUYER", "SELLER"],
      required: true,
      default: "BUYER",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.googleId ? false : true;
      },
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
