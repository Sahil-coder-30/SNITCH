import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    imageKitFileId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    accent: {
      type: String,
      default: "#FFE066",
    },
    gradient: {
      type: String,
      default: "linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #252525 100%)",
    },
    cta: {
      type: String,
      default: "Explore Collection",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const bannerModel = mongoose.model("Banner", bannerSchema);

export default bannerModel;
