import buyerProfileModel from "../models/buyerProfile.model.js";
import sellerProfileModel from "../models/sellerProfile.model.js";
import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import reviewModel from "../models/review.model.js";
import { uploadImage } from "../services/storage.service.js";

/**
 * Helper to get user document
 */
const getUserDoc = async (userId) => {
  return await userModel.findById(userId).select("-password");
};

/**
 * Get profile of current logged-in user (Buyer or Seller)
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userDoc = await getUserDoc(userId);

    if (!userDoc) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    const role = userDoc.role || req.user.role;

    if (role === "BUYER") {
      let profile = await buyerProfileModel.findOne({ user: userId });
      if (!profile) {
        // Create default profile
        profile = await buyerProfileModel.create({
          user: userId,
          name: userDoc.username,
          email: userDoc.email,
          phone: userDoc.contact || "",
          profilePicture: userDoc.profilePicture || "",
          stats: {
            orders: 14, // seed initial dummy values so they match the layout nicely
            wishlist: 12,
            reviews: 6
          }
        });
      }

      // Count reviews dynamically if they exist
      const reviewCount = await reviewModel.countDocuments({ "user.id": userId });
      if (reviewCount > 0) {
        profile.stats.reviews = reviewCount;
      }

      return res.status(200).json({ success: true, profile });
    } else if (role === "SELLER") {
      let profile = await sellerProfileModel.findOne({ user: userId });
      if (!profile) {
        // Create default profile
        profile = await sellerProfileModel.create({
          user: userId,
          name: userDoc.username,
          email: userDoc.email,
          phone: userDoc.contact || "",
          profilePicture: userDoc.profilePicture || "",
          companyName: "SNITCH Store",
          description: "Premium apparel seller on SNITCH.",
          stats: {
            revenue: 124850,
            orders: 156,
            activeListings: 12,
            rating: 4.8
          }
        });
      }

      // Calculate active listings dynamically
      const activeListingsCount = await productModel.countDocuments({
        seller: userId,
        stock: { $elemMatch: { quantity: { $gt: 0 } } }
      });
      profile.stats.activeListings = activeListingsCount || profile.stats.activeListings;

      return res.status(200).json({ success: true, profile });
    } else {
      const err = new Error("Invalid user role");
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update profile of current logged-in user (Buyer or Seller)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userDoc = await getUserDoc(userId);

    if (!userDoc) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    const role = userDoc.role || req.user.role;

    let profilePictureUrl = "";

    // Upload file to ImageKit if it was sent
    if (req.file) {
      try {
        profilePictureUrl = await uploadImage("SNITCH-PROFILES", req.file.buffer, req.file.originalname);
      } catch (err) {
        console.error("Avatar upload failed:", err);
      }
    }

    if (role === "BUYER") {
      let profile = await buyerProfileModel.findOne({ user: userId });
      if (!profile) {
        profile = new buyerProfileModel({ user: userId });
      }

      const { name, email, phone, dob, gender } = req.body;

      if (name) profile.name = name;
      if (email) profile.email = email;
      if (phone !== undefined) profile.phone = phone;
      if (dob !== undefined) profile.dob = dob;
      if (gender !== undefined) profile.gender = gender;

      // Handle nested arrays if passed as JSON strings
      if (req.body.addresses) {
        try {
          profile.addresses = typeof req.body.addresses === 'string' 
            ? JSON.parse(req.body.addresses) 
            : req.body.addresses;
        } catch (e) {
          console.error("Failed to parse addresses JSON", e);
        }
      }
      if (req.body.paymentMethods) {
        try {
          profile.paymentMethods = typeof req.body.paymentMethods === 'string' 
            ? JSON.parse(req.body.paymentMethods) 
            : req.body.paymentMethods;
        } catch (e) {
          console.error("Failed to parse paymentMethods JSON", e);
        }
      }

      if (profilePictureUrl) {
        profile.profilePicture = profilePictureUrl;
      } else if (req.body.profilePicture) {
        profile.profilePicture = req.body.profilePicture;
      }

      await profile.save();

      // Sync name & email with User collection
      if (email && email !== userDoc.email) {
        const emailExists = await userModel.findOne({ email });
        if (emailExists) {
          const err = new Error("Email is already in use by another account");
          err.statusCode = 400;
          return next(err);
        }
        userDoc.email = email;
      }
      if (name && name !== userDoc.username) {
        const usernameExists = await userModel.findOne({ username: name });
        if (!usernameExists) {
          userDoc.username = name;
        } else {
          console.warn(`Username "${name}" is already taken. Skipping sync to userDoc.username.`);
        }
      }
      if (profile.profilePicture) userDoc.profilePicture = profile.profilePicture;
      
      try {
        await userDoc.save();
      } catch (saveError) {
        if (saveError.code === 11000) {
          const err = new Error("Username or Email is already in use by another account");
          err.statusCode = 400;
          return next(err);
        }
        throw saveError;
      }

      return res.status(200).json({ success: true, message: "Profile updated successfully", profile });
    } else if (role === "SELLER") {
      let profile = await sellerProfileModel.findOne({ user: userId });
      if (!profile) {
        profile = new sellerProfileModel({ user: userId });
      }

      const { name, email, phone, companyName, description, gstin } = req.body;

      if (name) profile.name = name;
      if (email) profile.email = email;
      if (phone !== undefined) profile.phone = phone;
      if (companyName !== undefined) profile.companyName = companyName;
      if (description !== undefined) profile.description = description;
      if (gstin !== undefined) profile.gstin = gstin;

      // Handle address object
      if (req.body.address) {
        try {
          profile.address = typeof req.body.address === 'string' 
            ? JSON.parse(req.body.address) 
            : req.body.address;
        } catch (e) {
          console.error("Failed to parse business address JSON", e);
        }
      }

      if (profilePictureUrl) {
        profile.profilePicture = profilePictureUrl;
      } else if (req.body.profilePicture) {
        profile.profilePicture = req.body.profilePicture;
      }

      await profile.save();

      // Sync name & email with User collection
      if (email && email !== userDoc.email) {
        const emailExists = await userModel.findOne({ email });
        if (emailExists) {
          const err = new Error("Email is already in use by another account");
          err.statusCode = 400;
          return next(err);
        }
        userDoc.email = email;
      }
      if (name && name !== userDoc.username) {
        const usernameExists = await userModel.findOne({ username: name });
        if (!usernameExists) {
          userDoc.username = name;
        } else {
          console.warn(`Username "${name}" is already taken. Skipping sync to userDoc.username.`);
        }
      }
      if (profile.profilePicture) userDoc.profilePicture = profile.profilePicture;
      
      try {
        await userDoc.save();
      } catch (saveError) {
        if (saveError.code === 11000) {
          const err = new Error("Username or Email is already in use by another account");
          err.statusCode = 400;
          return next(err);
        }
        throw saveError;
      }

      return res.status(200).json({ success: true, message: "Seller profile updated successfully", profile });
    } else {
      const err = new Error("Invalid user role");
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete profile (Reset to empty/defaults)
 */
export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userDoc = await getUserDoc(userId);
    if (!userDoc) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    const role = userDoc.role || req.user.role;

    if (role === "BUYER") {
      await buyerProfileModel.findOneAndDelete({ user: userId });
      return res.status(200).json({ success: true, message: "Buyer profile deleted successfully" });
    } else if (role === "SELLER") {
      await sellerProfileModel.findOneAndDelete({ user: userId });
      return res.status(200).json({ success: true, message: "Seller profile deleted successfully" });
    } else {
      const err = new Error("Invalid user role");
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Add an address to Buyer Profile
 */
export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, line1, line2, phone } = req.body;

    const profile = await buyerProfileModel.findOne({ user: userId });
    if (!profile) {
      const err = new Error("Profile not found");
      err.statusCode = 404;
      return next(err);
    }

    profile.addresses.push({ type, line1, line2, phone });
    await profile.save();

    return res.status(200).json({ success: true, message: "Address added successfully", profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a specific address in Buyer Profile
 */
export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { type, line1, line2, phone } = req.body;

    const profile = await buyerProfileModel.findOne({ user: userId });
    if (!profile) {
      const err = new Error("Profile not found");
      err.statusCode = 404;
      return next(err);
    }

    const addr = profile.addresses.id(addressId);
    if (!addr) {
      const err = new Error("Address not found");
      err.statusCode = 404;
      return next(err);
    }

    if (type) addr.type = type;
    if (line1) addr.line1 = line1;
    if (line2 !== undefined) addr.line2 = line2;
    if (phone) addr.phone = phone;

    await profile.save();
    return res.status(200).json({ success: true, message: "Address updated successfully", profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific address in Buyer Profile
 */
export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const profile = await buyerProfileModel.findOne({ user: userId });
    if (!profile) {
      const err = new Error("Profile not found");
      err.statusCode = 404;
      return next(err);
    }

    profile.addresses.pull({ _id: addressId });
    await profile.save();

    return res.status(200).json({ success: true, message: "Address deleted successfully", profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a payment method to Buyer Profile
 */
export const addPaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, label, last4, id, icon } = req.body;

    const profile = await buyerProfileModel.findOne({ user: userId });
    if (!profile) {
      const err = new Error("Profile not found");
      err.statusCode = 404;
      return next(err);
    }

    profile.paymentMethods.push({ type, label, last4, id, icon });
    await profile.save();

    return res.status(200).json({ success: true, message: "Payment method added successfully", profile });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a specific payment method in Buyer Profile
 */
export const deletePaymentMethod = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { paymentId } = req.params;

    const profile = await buyerProfileModel.findOne({ user: userId });
    if (!profile) {
      const err = new Error("Profile not found");
      err.statusCode = 404;
      return next(err);
    }

    profile.paymentMethods.pull({ _id: paymentId });
    await profile.save();

    return res.status(200).json({ success: true, message: "Payment method deleted successfully", profile });
  } catch (error) {
    next(error);
  }
};
