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

        // Map database schema to storefront UI representation
        const mappedProducts = products.map(product => {
            const isSale = product.discountPercent > 0;
            const colors = [];
            const colorNames = [];

            if (product.stock) {
                product.stock.forEach(item => {
                    if (item.colors) {
                        item.colors.forEach(c => {
                            if (c.hex && !colors.includes(c.hex)) {
                                colors.push(c.hex);
                                colorNames.push(c.name || 'Color');
                            }
                        });
                    }
                });
            }

            return {
                id: product._id,
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
                inStock: product.stock ? product.stock.some(s => s.quantity > 0) : false,
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
            const totalStock = product.stock 
                ? product.stock.reduce((sum, item) => sum + (item.quantity || 0), 0)
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

        const colorImages = [];
        const colorMap = {};

        if (product.stock) {
            product.stock.forEach(item => {
                if (item.colors) {
                    item.colors.forEach(c => {
                        if (c.images) {
                            c.images.forEach(img => {
                                if (img && !colorImages.includes(img)) {
                                    colorImages.push(img);
                                }
                            });
                        }
                        if (!colorMap[c.name]) {
                            colorMap[c.name] = {
                                name: c.name,
                                hex: c.hex,
                                available: item.quantity > 0,
                                images: c.images || []
                            };
                        } else if (item.quantity > 0) {
                            colorMap[c.name].available = true;
                        }
                    });
                }
            });
        }

        const images = [product.coverImage, ...colorImages].filter(Boolean);

        const sizes = (product.stock || []).map(item => ({
            label: item.size,
            available: item.quantity > 0
        }));

        const mappedProduct = {
            id: product._id,
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
            colors: Object.values(colorMap),
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
            ]
        };

        res.status(200).json(mappedProduct);
    } catch (error) {
        next(error);
    }
};



