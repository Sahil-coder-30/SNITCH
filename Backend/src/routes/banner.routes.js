import express from "express";
import multer from "multer";
import {
  uploadBannerImage,
  getBanners,
  saveActiveBanners,
  getActiveBanners,
  deleteBanner,
} from "../controllers/banner.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const bannerRouter = express.Router();

// Public route to fetch active banners for storefront carousel
bannerRouter.get("/active", getActiveBanners);

// Admin-accessible routes (currently public as requested, auth middleware to be added later)
// Example: bannerRouter.use(adminAuth);

bannerRouter.get("/", getBanners);
bannerRouter.post("/upload", upload.single("image"), uploadBannerImage);
bannerRouter.put("/active", saveActiveBanners);
bannerRouter.delete("/:id", deleteBanner);

export default bannerRouter;
