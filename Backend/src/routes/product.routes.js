import express from 'express';
import multer from 'multer';
import { createProductController, uploadImagesController } from '../controllers/products.controller.js';
import {productCreationAuth} from "../middleware/product.middleware.js";
import { productValidationRules, validateProduct } from '../validators/product.validator.js';

const upload = multer({
    storage : multer.memoryStorage(),
    limits:{
        fileSize : 5 * 1024 * 1024
    }
})

const productRouter = express.Router();

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

