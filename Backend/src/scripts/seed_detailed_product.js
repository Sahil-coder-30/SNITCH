import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductModel from "../models/product.model.js";
import StyleCodeModel from "../models/stylecode.model.js";

dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing");
  process.exit(1);
}

const SELLER_ID = "69de61e7ad40720b2de62beb"; // Default seller ID
const STYLE_CODE = "SN-ELITE-01";

const productVariants = [
  {
    title: "Luxe Sartorial Wool Blend Trench Coat - Charcoal Gray",
    brand: "SNITCH",
    description: "Elevate your cold-weather wardrobe with the Luxe Sartorial Wool Blend Trench Coat. Masterfully tailored from a premium heavyweight wool blend (70% wool, 30% organic fibers), this double-breasted piece boasts clean lines and an exquisite drape. It features structured shoulders, a classic gun flap, deep hand-warmer welt pockets, and custom tortoiseshell button closures. The interior is fully lined in luxurious viscose satin for effortless layering. An adjustable self-tie waist belt allows you to alternate between a relaxed straight silhouette and a sharp, defined fit.",
    originalPrice: { amount: 12999, currency: "INR" },
    price: { amount: 8999, currency: "INR" },
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 147,
    styleCode: STYLE_CODE,
    color: { name: "Charcoal Gray", hex: "#36454F" },
    sizes: [
      { size: "XS", quantity: 5 },
      { size: "S", quantity: 12 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 20 },
      { size: "XL", quantity: 15 },
      { size: "XXL", quantity: 8 }
    ],
    coverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&w=600&q=80"
    ],
    category: { for: "Mens", name: "Coats" },
    badge: "limited-edition",
    seller: SELLER_ID
  },
  {
    title: "Luxe Sartorial Wool Blend Trench Coat - Camel Tan",
    brand: "SNITCH",
    description: "A timeless masterpiece, the Luxe Sartorial Wool Blend Trench Coat in Camel Tan is the epitome of classic metropolitan style. Built from a heavy-drape wool blend, this double-breasted coat offers exceptional thermal comfort and visual texture. Details include wide notched lapels, a traditional storm shield back, buttoned sleeve straps, and deep internal slip pockets for valuable essentials. Viscose-lined sleeves ensure comfortable wear over heavy knits and tailored suits. Finish with the belt closed to highlight the structured silhouette.",
    originalPrice: { amount: 12999, currency: "INR" },
    price: { amount: 8999, currency: "INR" },
    discountPercent: 30,
    rating: 4.8,
    reviewCount: 96,
    styleCode: STYLE_CODE,
    color: { name: "Camel Tan", hex: "#C19A6B" },
    sizes: [
      { size: "XS", quantity: 3 },
      { size: "S", quantity: 10 },
      { size: "M", quantity: 30 },
      { size: "L", quantity: 25 },
      { size: "XL", quantity: 12 },
      { size: "XXL", quantity: 5 }
    ],
    coverImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80"
    ],
    category: { for: "Mens", name: "Coats" },
    badge: "limited-edition",
    seller: SELLER_ID
  },
  {
    title: "Luxe Sartorial Wool Blend Trench Coat - Midnight Navy",
    brand: "SNITCH",
    description: "Tailored to perfection, the Luxe Sartorial Wool Blend Trench Coat in Midnight Navy delivers a modern, sleek aesthetic. Featuring a rich dark navy weave, this double-breasted coat is both wind-resistant and incredibly soft to the touch. Complete with wide notch collar, buckle straps on cuffs, a gun flap, and side-slanted entry pockets. Pair with crisp denim or tailored trousers for an unmatched, sharp urban lookup. Premium tortoiseshell buttons and a heavy-grade self-tie waist belt complete the garment structure.",
    originalPrice: { amount: 12999, currency: "INR" },
    price: { amount: 8999, currency: "INR" },
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 110,
    styleCode: STYLE_CODE,
    color: { name: "Midnight Navy", hex: "#1A2433" },
    sizes: [
      { size: "XS", quantity: 4 },
      { size: "S", quantity: 8 },
      { size: "M", quantity: 20 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 10 },
      { size: "XXL", quantity: 6 }
    ],
    coverImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    ],
    category: { for: "Mens", name: "Coats" },
    badge: "limited-edition",
    seller: SELLER_ID
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully for seeding detailed product");

    // Clean up existing entries for style code SN-ELITE-01
    await ProductModel.deleteMany({ styleCode: STYLE_CODE });
    await StyleCodeModel.deleteMany({ styleCode: STYLE_CODE });

    // 1. Create StyleCode registry key entry
    const styleCodeObj = await StyleCodeModel.create({
      seller: SELLER_ID,
      key: "Elite Wool Trench Coat Series",
      styleCode: STYLE_CODE
    });
    console.log("Created Style Code Passbook Entry:", styleCodeObj);

    // 2. Create products color variants
    const insertedProducts = await ProductModel.insertMany(productVariants);
    console.log(`Successfully seeded ${insertedProducts.length} highly detailed color variants linked by style code ${STYLE_CODE}`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with exception:", error);
    process.exit(1);
  }
}

seed();
