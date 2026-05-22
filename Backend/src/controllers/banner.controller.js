import bannerModel from "../models/banner.model.js";
import { uploadImageWithDetails, deleteImage } from "../services/storage.service.js";

// Upload a new banner image to ImageKit and save it as inactive in DB
export const uploadBannerImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error("No image file provided");
      err.statusCode = 400;
      return next(err);
    }

    const result = await uploadImageWithDetails(
      "SNITCH-BANNERS",
      req.file.buffer,
      req.file.originalname
    );

    const newBanner = await bannerModel.create({
      imageUrl: result.url,
      imageKitFileId: result.fileId,
      isActive: false,
    });

    res.status(201).json({
      message: "Banner uploaded successfully to ImageKit",
      banner: newBanner,
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve all banner images in DB (both active and inactive)
export const getBanners = async (req, res, next) => {
  try {
    const banners = await bannerModel.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    next(error);
  }
};

// Save the active banners configuration (admin chooses 5-6 final banners)
export const saveActiveBanners = async (req, res, next) => {
  try {
    const { banners } = req.body;

    if (!Array.isArray(banners)) {
      const err = new Error("Banners must be an array");
      err.statusCode = 400;
      return next(err);
    }

    // Set all banners to inactive first
    await bannerModel.updateMany({}, { isActive: false });

    // Update the chosen banners to be active and save their configuration
    const updatedBanners = await Promise.all(
      banners.map(async (b, index) => {
        const id = b.id || b._id;
        return await bannerModel.findByIdAndUpdate(
          id,
          {
            isActive: true,
            title: b.title || "",
            subtitle: b.subtitle || "",
            accent: b.accent || "#FFE066",
            gradient: b.gradient || "linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #252525 100%)",
            cta: b.cta || "Explore Collection",
            order: b.order !== undefined ? b.order : index,
          },
          { new: true }
        );
      })
    );

    res.status(200).json({
      message: "Active banners configuration updated successfully",
      banners: updatedBanners,
    });
  } catch (error) {
    next(error);
  }
};

// Public endpoint to retrieve active banners for storefront
export const getActiveBanners = async (req, res, next) => {
  try {
    const activeBanners = await bannerModel.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(activeBanners);
  } catch (error) {
    next(error);
  }
};

// Delete a banner from DB and its matching file from ImageKit
export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await bannerModel.findById(id);

    if (!banner) {
      const err = new Error("Banner not found");
      err.statusCode = 404;
      return next(err);
    }

    // Delete from ImageKit
    try {
      await deleteImage(banner.imageKitFileId);
    } catch (ikError) {
      console.warn("Failed to delete from ImageKit, proceeding with DB deletion:", ikError);
    }

    // Delete from DB
    await bannerModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Banner deleted successfully",
      id,
    });
  } catch (error) {
    next(error);
  }
};
