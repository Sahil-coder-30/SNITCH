import express from 'express';
import multer from 'multer';
import { 
    createProductController, 
    uploadImagesController,
    getProductsController,
    getSellerProductsController,
    getProductByIdController,
    createStyleCodeController,
    getStyleCodesController,
    createProductReviewController,
    getSuggestedProductsController
} from '../controllers/products.controller.js';
import { searchProductsController } from '../controllers/search.controller.js';
import { productCreationAuth } from "../middleware/product.middleware.js";
import { identifyUser } from "../middleware/identifyUser.middleware.js";
import { productValidationRules, validateProduct } from '../validators/product.validator.js';

const upload = multer({
    storage : multer.memoryStorage(),
    limits:{
        fileSize : 5 * 1024 * 1024
    }
})

const productRouter = express.Router();

// Public routes for fetching products
productRouter.get("/", getProductsController);

// Public route for searching products with filters
productRouter.get("/search", searchProductsController);

// Seller dashboard routes (needs authentication, must be before /:id)
productRouter.get("/seller", productCreationAuth, getSellerProductsController);

// StyleCode Passbook routes
productRouter.post("/stylecodes", productCreationAuth, createStyleCodeController);
productRouter.get("/stylecodes", productCreationAuth, getStyleCodesController);

// Public route to fetch a single product details
productRouter.get("/:id", getProductByIdController);

// Public route to fetch suggested related products
productRouter.get("/:id/suggested", getSuggestedProductsController);

// Authenticated route to submit a review for a product
productRouter.post("/:id/reviews", identifyUser, createProductReviewController);

productRouter.post(
    "/upload_images",
    productCreationAuth,
    upload.any(),
    uploadImagesController
);

productRouter.post(
    "/create_Product", 
    productCreationAuth, 
    upload.any(),
    productValidationRules(),
    validateProduct,
    createProductController
);

export default productRouter;

