import mongoose from "mongoose";

const styleCodeSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    styleCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes
styleCodeSchema.index({ seller: 1 });


const StyleCodeModel = mongoose.model("StyleCode", styleCodeSchema);

export default StyleCodeModel;
