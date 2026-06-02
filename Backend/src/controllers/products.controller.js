import productModel from "../models/product.model.js";
import styleCodeModel from "../models/stylecode.model.js";
import reviewModel from "../models/review.model.js";
import { uploadImage } from "../services/storage.service.js";
import crypto from "crypto";

export const createProductController = async (req, res, next) => {
    try {
        const sellerId = req.user.id;

        // Extracting fields from body, handling possibly stringified JSON
        let {
            title, brand, description, 
            originalPrice, price, discountPercent,
            sizes, category, badge, styleCode, color
        } = req.body;

        // Parse nested fields if they come as stringified JSON (common in form-data)
        if (typeof originalPrice === "string") originalPrice = JSON.parse(originalPrice);
        if (typeof price === "string") price = JSON.parse(price);
        if (typeof sizes === "string") sizes = JSON.parse(sizes);
        if (typeof category === "string") category = JSON.parse(category);
        if (typeof color === "string") color = JSON.parse(color);

        if (!title || !description || !price || !category || !sizes || !brand || !styleCode || !color) {
            const err = new Error("Missing required fields (title, brand, description, price, category, sizes, styleCode, color).");
            err.statusCode = 400;
            return next(err);
        }

        // Check if a variant with the same styleCode and color already exists
        const existingVariant = await productModel.findOne({
            styleCode: styleCode.trim(),
            $or: [
                { "color.hex": new RegExp(`^${color.hex.trim()}$`, "i") },
                { "color.name": new RegExp(`^${color.name.trim()}$`, "i") }
            ]
        });

        if (existingVariant) {
            const err = new Error(`A product variant under style code "${styleCode}" with color "${color.name}" (${color.hex}) already exists.`);
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

        // 2. Map product images dynamically
        let images = [];
        if (req.body.images) {
            images = typeof req.body.images === "string" ? JSON.parse(req.body.images) : req.body.images;
        }
        uploadedFiles.forEach(file => {
            if (file.fieldname !== "coverImage") {
                images.push(file.url);
            }
        });

        const newProduct = await productModel.create({
            title,
            brand,
            description,
            originalPrice: originalPrice || price, // Fallback to price if originalPrice not provided
            price,
            discountPercent: discountPercent || 0,
            styleCode,
            color,
            sizes,
            images,
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

export const getProductsController = async (req, res, next) => {
    try {
        const { category, search, sort } = req.query;
        const query = {};

        // Category filter
        if (category && category !== 'all') {
            query["category.name"] = new RegExp(`^${category}$`, "i");
        }

        // Search query
        if (search) {
            query.$or = [
                { title: new RegExp(search, "i") },
                { brand: new RegExp(search, "i") },
                { description: new RegExp(search, "i") }
            ];
        }

        let products = await productModel.find(query);

        // Sorting
        if (sort === "price-asc") {
            products.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        } else if (sort === "price-desc") {
            products.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        } else if (sort === "rating") {
            products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sort === "newest") {
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Fetch sibling color variations of same styleCode to support color swatches on catalog cards
        const styleCodes = products.map(p => p.styleCode).filter(Boolean);
        const siblings = styleCodes.length > 0 
            ? await productModel.find({ styleCode: { $in: styleCodes } }, 'styleCode color')
            : [];
            
        // Group sibling colors by styleCode
        const styleColorMap = {};
        siblings.forEach(sib => {
            if (!sib.styleCode || !sib.color) return;
            if (!styleColorMap[sib.styleCode]) {
                styleColorMap[sib.styleCode] = [];
            }
            const exists = styleColorMap[sib.styleCode].some(c => c.hex === sib.color.hex);
            if (!exists) {
                styleColorMap[sib.styleCode].push({
                    name: sib.color.name,
                    hex: sib.color.hex,
                    id: sib._id
                });
            }
        });

        // Map database schema to storefront UI representation
        const mappedProducts = products.map(product => {
            const isSale = product.discountPercent > 0;
            const colors = [];
            const colorNames = [];

            // Add this product's own color first
            if (product.color && product.color.hex) {
                colors.push(product.color.hex);
                colorNames.push(product.color.name || 'Color');
            }

            // Add other sibling colors
            const siblingsList = styleColorMap[product.styleCode] || [];
            siblingsList.forEach(sib => {
                if (sib.hex && !colors.includes(sib.hex)) {
                    colors.push(sib.hex);
                    colorNames.push(sib.name || 'Color');
                }
            });

            return {
                id: product._id,
                styleCode: product.styleCode,
                name: product.title,
                brand: product.brand,
                price: product.price ? product.price.amount : 0,
                originalPrice: product.originalPrice ? product.originalPrice.amount : (product.price ? product.price.amount : 0),
                discount: product.discountPercent || 0,
                category: product.category ? product.category.name : '',
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || 0,
                image: product.coverImage,
                badge: product.badge,
                badgeType: product.badge === 'new-arrival' ? 'new' : (isSale ? 'sale' : 'new'),
                inStock: product.sizes ? product.sizes.some(s => s.quantity > 0) : false,
                colors,
                colorNames,
                deliveryDays: 3
            };
        });

        res.status(200).json({ products: mappedProducts });
    } catch (error) {
        next(error);
    }
};

export const getSellerProductsController = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const products = await productModel.find({ seller: sellerId });

        const mappedProducts = products.map(product => {
            const totalStock = product.sizes 
                ? product.sizes.reduce((sum, item) => sum + (item.quantity || 0), 0)
                : 0;

            return {
                id: product._id,
                name: product.title,
                brand: product.brand,
                category: product.category ? product.category.for : "Mens",
                subCategory: product.category ? product.category.name : 'Tshirts',
                price: product.price ? product.price.amount : 0,
                originalPrice: product.originalPrice ? product.originalPrice.amount : null,
                stock: totalStock,
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || 0,
                status: totalStock > 0 ? "active" : "out-of-stock",
                badge: product.badge ? product.badge.toUpperCase() : null,
                image: product.coverImage
            };
        });

        res.status(200).json(mappedProducts);
    } catch (error) {
        next(error);
    }
};

export const getProductByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id).populate("seller", "username email verified");

        if (!product) {
            const err = new Error("Product not found");
            err.statusCode = 404;
            return next(err);
        }

        // Fetch sibling color variants of the same styleCode
        const siblings = await productModel.find({ styleCode: product.styleCode });

        const colors = siblings.map(sib => ({
            id: sib._id,
            name: sib.color.name,
            hex: sib.color.hex,
            available: sib.sizes ? sib.sizes.some(s => s.quantity > 0) : false,
            images: sib.images || []
        }));

        const images = [product.coverImage, ...(product.images || [])].filter(Boolean);

        const sizes = (product.sizes || []).map(item => ({
            label: item.size,
            available: item.quantity > 0
        }));

        // Fetch real reviews from DB
        const reviews = await reviewModel.find({ "product.id": id }).populate({
            path: "user.id",
            select: "username profilePicture"
        });

        const mappedReviews = reviews.map(r => ({
            id: r._id,
            rating: r.rating,
            comment: r.data?.commnet || "",
            images: r.data?.images || [],
            user: {
                username: r.user?.id?.username || "Anonymous",
                profilePicture: r.user?.id?.profilePicture || ""
            },
            createdAt: r.createdAt
        }));

        const MOCK_REVIEWS = [
            {
                id: "mock1",
                rating: 5,
                comment: "Extremely comfortable fabric and great modern fit. Matches the photos exactly! Recommended.",
                images: [],
                user: { username: "Kabir S.", profilePicture: "" },
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: "mock2",
                rating: 4,
                comment: "Quality is top notch, looks premium. Delivery took 3 days, fit is slightly snug but looks very nice.",
                images: [],
                user: { username: "Neha Sharma", profilePicture: "" },
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                id: "mock3",
                rating: 5,
                comment: "Wow, completely blown away by the quality. Very premium fabric and stitching. Definitely buying in other colors.",
                images: [],
                user: { username: "Aman V.", profilePicture: "" },
                createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
            }
        ];

        const mappedProduct = {
            id: product._id,
            styleCode: product.styleCode,
            name: product.title,
            brand: product.brand,
            description: product.description,
            price: product.price ? product.price.amount : 0,
            originalPrice: product.originalPrice ? product.originalPrice.amount : (product.price ? product.price.amount : 0),
            discount: product.discountPercent || 0,
            category: product.category ? `${product.category.for} / ${product.category.name}` : '',
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || 0,
            sku: product._id.toString().substring(18).toUpperCase(),
            image: product.coverImage,
            images: images.length > 0 ? images : [product.coverImage],
            badge: product.badge,
            sizes,
            colors,
            delivery: { estimatedDays: "3 Days" },
            seller: product.seller ? {
                id: product.seller._id,
                username: product.seller.username,
                email: product.seller.email,
                verified: product.seller.verified || false
            } : null,
            highlights: [
                "100% Authentic SNITCH Product",
                "Premium quality tailoring",
                "Designed for regular & comfort fit"
            ],
            reviews: mappedReviews.length > 0 ? mappedReviews : MOCK_REVIEWS
        };

        res.status(200).json(mappedProduct);
    } catch (error) {
        next(error);
    }
};

export const createStyleCodeController = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const { key } = req.body;

        if (!key || !key.trim()) {
            const err = new Error("Key/Label is required");
            err.statusCode = 400;
            return next(err);
        }

        // Generate a unique 8-character style code, e.g. SN-A3D5B1
        let uniqueCode = "";
        let isUnique = false;
        while (!isUnique) {
            const randHex = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
            uniqueCode = `SN-${randHex}`;
            const exists = await styleCodeModel.findOne({ styleCode: uniqueCode });
            if (!exists) {
                isUnique = true;
            }
        }

        const newStyle = await styleCodeModel.create({
            seller: sellerId,
            key: key.trim(),
            styleCode: uniqueCode
        });

        res.status(201).json({ message: "Style code generated successfully", style: newStyle });
    } catch (error) {
        next(error);
    }
};

export const getStyleCodesController = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        
        // Find all style codes for this seller
        const styleCodes = await styleCodeModel.find({ seller: sellerId }).sort({ createdAt: -1 });

        // Query products associated with these style codes in a single batch
        const codes = styleCodes.map(s => s.styleCode);
        const products = codes.length > 0 
            ? await productModel.find({ styleCode: { $in: codes } }) 
            : [];

        // Group products by styleCode
        const productMap = {};
        products.forEach(p => {
            if (!productMap[p.styleCode]) {
                productMap[p.styleCode] = [];
            }
            productMap[p.styleCode].push({
                id: p._id,
                title: p.title,
                brand: p.brand,
                coverImage: p.coverImage,
                price: p.price ? p.price.amount : 0,
                color: p.color
            });
        });

        // Delete style codes that have no products and are older than 15 minutes (grace period for creation)
        const gracePeriod = 15 * 60 * 1000; // 15 minutes
        const now = Date.now();
        const toDeleteIds = [];

        const filteredStyleCodes = styleCodes.filter(s => {
            const hasProducts = productMap[s.styleCode] && productMap[s.styleCode].length > 0;
            const isWithinGrace = (now - new Date(s.createdAt).getTime()) < gracePeriod;
            if (!hasProducts && !isWithinGrace) {
                toDeleteIds.push(s._id);
                return false;
            }
            return true;
        });

        if (toDeleteIds.length > 0) {
            await styleCodeModel.deleteMany({ _id: { $in: toDeleteIds } });
        }

        const mappedStyles = filteredStyleCodes.map(s => ({
            id: s._id,
            key: s.key,
            styleCode: s.styleCode,
            createdAt: s.createdAt,
            products: productMap[s.styleCode] || []
        }));

        res.status(200).json(mappedStyles);
    } catch (error) {
        next(error);
    }
};

export const createProductReviewController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment, images } = req.body;
        const userId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            const err = new Error("Rating must be between 1 and 5");
            err.statusCode = 400;
            return next(err);
        }
        if (!comment || !comment.trim()) {
            const err = new Error("Comment is required");
            err.statusCode = 400;
            return next(err);
        }

        const product = await productModel.findById(id);
        if (!product) {
            const err = new Error("Product not found");
            err.statusCode = 404;
            return next(err);
        }

        // Create review in DB (note spelling of 'commnet' in the schema!)
        const newReview = await reviewModel.create({
            user: { id: userId },
            product: { id },
            rating: Number(rating),
            data: {
                commnet: comment.trim(),
                images: images || []
            }
        });

        // Recalculate average rating and reviewCount for product
        const allReviews = await reviewModel.find({ "product.id": id });
        const reviewCount = allReviews.length;
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Number((totalRating / reviewCount).toFixed(1));

        product.rating = avgRating;
        product.reviewCount = reviewCount;
        await product.save();

        // Populate user info to return to frontend
        const populatedReview = await reviewModel.findById(newReview._id).populate({
            path: "user.id",
            select: "username profilePicture"
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review: {
                id: populatedReview._id,
                rating: populatedReview.rating,
                comment: populatedReview.data?.commnet || "",
                images: populatedReview.data?.images || [],
                user: {
                    username: populatedReview.user?.id?.username || "Anonymous",
                    profilePicture: populatedReview.user?.id?.profilePicture || ""
                },
                createdAt: populatedReview.createdAt
            },
            productRating: avgRating,
            productReviewCount: reviewCount
        });
    } catch (error) {
        next(error);
    }
};

export const getSuggestedProductsController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentProduct = await productModel.findById(id);

        if (!currentProduct) {
            const err = new Error("Product not found");
            err.statusCode = 404;
            return next(err);
        }

        // Try to find products with the same category name (sub-category)
        let suggestions = await productModel.find({
            "category.name": currentProduct.category.name,
            _id: { $ne: currentProduct._id }
        }).limit(8);

        // If not enough suggestions, query by the parent category 'for' (e.g., Mens)
        if (suggestions.length < 4) {
            const additional = await productModel.find({
                "category.for": currentProduct.category.for,
                _id: { $ne: currentProduct._id, $nin: suggestions.map(s => s._id) }
            }).limit(8 - suggestions.length);
            suggestions = [...suggestions, ...additional];
        }

        // Map them to storefront representation
        const mappedSuggestions = suggestions.map(product => {
            const isSale = product.discountPercent > 0;
            return {
                id: product._id,
                styleCode: product.styleCode,
                name: product.title,
                brand: product.brand,
                price: product.price ? product.price.amount : 0,
                originalPrice: product.originalPrice ? product.originalPrice.amount : (product.price ? product.price.amount : 0),
                discount: product.discountPercent || 0,
                category: product.category ? product.category.name : '',
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || 0,
                image: product.coverImage,
                badge: product.badge,
                badgeType: product.badge === 'new-arrival' ? 'new' : (isSale ? 'sale' : 'new'),
                inStock: product.sizes ? product.sizes.some(s => s.quantity > 0) : false,
                colors: product.color && product.color.hex ? [product.color.hex] : [],
                deliveryDays: 3
            };
        });

        res.status(200).json(mappedSuggestions);
    } catch (error) {
        next(error);
    }
};



