import express from 'express';
import multer from 'multer';
import { 
    createProductController, 
    uploadImagesController,
    getProductsController,
    getSellerProductsController,
    getProductByIdController
} from '../controllers/products.controller.js';
import { searchProductsController } from '../controllers/search.controller.js';
import { productCreationAuth } from "../middleware/product.middleware.js";
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

// Public route to fetch a single product details
productRouter.get("/:id", getProductByIdController);

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

