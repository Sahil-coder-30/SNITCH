import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { productCreationAuth } from "../middleware/product.middleware.js";
import { getSellerProductsController } from "../controllers/products.controller.js";

dotenv.config({ path: "../../.env" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing");
  process.exit(1);
}

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully for test");

    // Generate token for seller 'yoboy' (role not in token payload to test robust fallback)
    const token = jwt.sign(
      {
        id: "69de61e7ad40720b2de62beb",
        email: "sahilsharma3043@gmail.com"
      },
      process.env.JWT_SECRET
    );

    // Mock request, response, and next
    const req = {
      cookies: { token },
      user: null
    };

    let nextCalled = false;
    let nextError = null;

    const next = (err) => {
      nextCalled = true;
      nextError = err;
    };

    console.log("Running productCreationAuth middleware...");
    await productCreationAuth(req, {}, next);

    if (nextError) {
      console.error("Middleware failed with error:", nextError.message);
      process.exit(1);
    }

    console.log("Middleware passed! req.user: ", req.user);

    // Mock response for controller
    let responseStatus = null;
    let responseData = null;
    const res = {
      status: function (code) {
        responseStatus = code;
        return this;
      },
      json: function (data) {
        responseData = data;
      }
    };

    console.log("Running getSellerProductsController...");
    await getSellerProductsController(req, res, next);

    if (nextError) {
      console.error("Controller failed with error:", nextError.message);
      process.exit(1);
    }

    console.log("Controller passed! Status:", responseStatus);
    console.log("Returned products count:", responseData.length);
    console.log("Seeded products returned:");
    responseData.forEach(p => {
      console.log(`- Title: "${p.name}", Category: "${p.category}", Stock: ${p.stock}, Price: ${p.price}, Image: "${p.image}"`);
    });

    console.log(">>> SUCCESS: My Products API verification complete! <<<");
    process.exit(0);
  } catch (error) {
    console.error("Test failed with exception:", error);
    process.exit(1);
  }
}

test();
