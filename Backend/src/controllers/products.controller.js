import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProductController = async (req, res, next) => {
    try {
        const sellerId = req.user.id;

        // Extracting fields from body, handling possibly stringified JSON
        let {
            title, brand, description, 
            originalPrice, price, discountPercent,
            stock, category, badge
        } = req.body;

        // Parse nested fields if they come as stringified JSON (common in form-data)
        if (typeof originalPrice === "string") originalPrice = JSON.parse(originalPrice);
        if (typeof price === "string") price = JSON.parse(price);
        if (typeof stock === "string") stock = JSON.parse(stock);
        if (typeof category === "string") category = JSON.parse(category);

        if (!title || !description || !price || !category || !stock || !brand) {
            const err = new Error("Missing required fields (title, brand, description, price, category, stock).");
            err.statusCode = 400;
            return next(err);
        }

        // Handle uploaded images and map their fieldnames
        const uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            await Promise.all(req.files.map(async (file) => {
                const url = await uploadImage(
                    "SNITCH",
                    file.buffer,
                    file.originalname
                );
                uploadedFiles.push({ fieldname: file.fieldname, url });
            }));
        }

        // 1. Map cover image (frontend should send cover image with fieldname "coverImage")
        let coverImage = req.body.coverImage;
        const coverFile = uploadedFiles.find(f => f.fieldname === "coverImage");
        if (coverFile) {
            coverImage = coverFile.url;
        }

        if (!coverImage) {
            const err = new Error("Cover image is required");
            err.statusCode = 400;
            return next(err);
        }

        // 2. Map stock images dynamically 
        // Frontend sends stock images with fieldname format "color_J" 
        // where J = color array index
        const uploadedColorUrls = {}; // map j -> [url1, url2]
        
        uploadedFiles.forEach(file => {
            if (file.fieldname.startsWith('color_')) {
                const j = file.fieldname.split('_')[1];
                if (!uploadedColorUrls[j]) uploadedColorUrls[j] = [];
                uploadedColorUrls[j].push(file.url);
            }
        });

        if (Array.isArray(stock)) {
            stock.forEach((stockItem) => {
                if (Array.isArray(stockItem.colors)) {
                    stockItem.colors.forEach((colorItem, j) => {
                        // If files were uploaded via multipart for this color, use them
                        if (uploadedColorUrls[j] && uploadedColorUrls[j].length > 0) {
                            colorItem.images = uploadedColorUrls[j];
                        }
                        // Otherwise, colorItem.images remains as whatever the frontend sent (already valid URLs)
                        if (!colorItem.images) colorItem.images = [];
                    });
                }
            });
        }

        const newProduct = await productModel.create({
            title,
            brand,
            description,
            originalPrice: originalPrice || price, // Fallback to price if originalPrice not provided
            price,
            discountPercent: discountPercent || 0,
            stock,
            coverImage,
            category,
            badge,
            seller: sellerId
        });

        res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        next(error);
    }
};

export const uploadImagesController = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ urls: [] });
        }

        const urls = await Promise.all(req.files.map(async (file) => {
            return await uploadImage("SNITCH", file.buffer, file.originalname);
        }));

        res.status(200).json({ message: "Images uploaded", urls });
    } catch (error) {
        next(error);
    }
};


