import express from "express";
import multer from "multer";
import { identifyUser } from "../middleware/identifyUser.middleware.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addPaymentMethod,
  deletePaymentMethod
} from "../controllers/profile.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const profileRouter = express.Router();

// Apply authentication to all profile routes
profileRouter.use(identifyUser);

// Profile CRUD
profileRouter.get("/", getProfile);
profileRouter.put("/", upload.single("profilePicture"), updateProfile);
profileRouter.delete("/", deleteProfile);

// Address CRUD
profileRouter.post("/address", addAddress);
profileRouter.put("/address/:addressId", updateAddress);
profileRouter.delete("/address/:addressId", deleteAddress);

// Payment Method CRUD
profileRouter.post("/payment", addPaymentMethod);
profileRouter.delete("/payment/:paymentId", deletePaymentMethod);

export default profileRouter;
