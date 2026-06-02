import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import ProductModel from "../models/product.model.js";

// Load environment variables
dotenv.config({ path: "../../.env" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is missing from environmental variables");
  process.exit(1);
}

// File paths setup
const brainDir = "/Users/home/.gemini/antigravity-ide/brain/18743659-64ba-4e63-8a27-3c2e277dd809";
const frontendPublicAssetsDir = "/Users/home/Desktop/SNITCH/Frontend/public/assets";

const filesToCopy = [
  {
    src: path.join(brainDir, "nano_banana_tee_1779368417257.png"),
    dest: path.join(frontendPublicAssetsDir, "nano_banana_tee.png"),
  },
  {
    src: path.join(brainDir, "nano_banana_hoodie_1779368485406.png"),
    dest: path.join(frontendPublicAssetsDir, "nano_banana_hoodie.png"),
  },
  {
    src: path.join(brainDir, "nano_banana_cap_1779368503777.png"),
    dest: path.join(frontendPublicAssetsDir, "nano_banana_cap.png"),
  }
];

// Helper to copy files
function copyImageFiles() {
  console.log("Copying generated images to frontend public assets...");
  if (!fs.existsSync(frontendPublicAssetsDir)) {
    fs.mkdirSync(frontendPublicAssetsDir, { recursive: true });
  }

  for (const item of filesToCopy) {
    if (fs.existsSync(item.src)) {
      fs.copyFileSync(item.src, item.dest);
      console.log(`Successfully copied ${path.basename(item.src)} -> ${path.basename(item.dest)}`);
    } else {
      console.error(`Warning: Source file not found: ${item.src}`);
    }
  }
}

// Data definitions
const sellerId = "69de61e7ad40720b2de62beb"; // 'yoboy' seller account

const nanoProducts = [
  {
    title: "Nano Banana Graphic Tee",
    brand: "SNITCH",
    description: "Heavyweight organic cotton streetwear tee in deep black, featuring a striking minimalist neon-yellow graphic print of our signature nano banana on the chest.",
    originalPrice: {
      amount: 2499,
      currency: "INR"
    },
    price: {
      amount: 1299,
      currency: "INR"
    },
    discountPercent: 48,
    coverImage: "/assets/nano_banana_tee.png",
    category: {
      for: "Mens",
      name: "Tshirts"
    },
    badge: "new-arrival",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 25,
        colors: [
          {
            name: "Deep Black",
            hex: "#0b0c10",
            images: ["/assets/nano_banana_tee.png"]
          }
        ]
      },
      {
        size: "M",
        quantity: 25,
        colors: [
          {
            name: "Deep Black",
            hex: "#0b0c10",
            images: ["/assets/nano_banana_tee.png"]
          }
        ]
      },
      {
        size: "L",
        quantity: 25,
        colors: [
          {
            name: "Deep Black",
            hex: "#0b0c10",
            images: ["/assets/nano_banana_tee.png"]
          }
        ]
      },
      {
        size: "XL",
        quantity: 25,
        colors: [
          {
            name: "Deep Black",
            hex: "#0b0c10",
            images: ["/assets/nano_banana_tee.png"]
          }
        ]
      }
    ]
  },
  {
    title: "Nano Banana Pastel Hoodie",
    brand: "SNITCH",
    description: "An ultra-cozy, oversized hoodie in warm pastel yellow, detailed with a clean, high-precision embroidered nano banana logo on the chest. Crafted from fleece-lined brushed cotton for ultimate warmth and comfort.",
    originalPrice: {
      amount: 4999,
      currency: "INR"
    },
    price: {
      amount: 2899,
      currency: "INR"
    },
    discountPercent: 42,
    coverImage: "/assets/nano_banana_hoodie.png",
    category: {
      for: "Mens",
      name: "Jackets"
    },
    badge: "best-seller",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 20,
        colors: [
          {
            name: "Pastel Yellow",
            hex: "#fef6c9",
            images: ["/assets/nano_banana_hoodie.png"]
          }
        ]
      },
      {
        size: "M",
        quantity: 20,
        colors: [
          {
            name: "Pastel Yellow",
            hex: "#fef6c9",
            images: ["/assets/nano_banana_hoodie.png"]
          }
        ]
      },
      {
        size: "L",
        quantity: 20,
        colors: [
          {
            name: "Pastel Yellow",
            hex: "#fef6c9",
            images: ["/assets/nano_banana_hoodie.png"]
          }
        ]
      },
      {
        size: "XL",
        quantity: 20,
        colors: [
          {
            name: "Pastel Yellow",
            hex: "#fef6c9",
            images: ["/assets/nano_banana_hoodie.png"]
          }
        ]
      }
    ]
  },
  {
    title: "Nano Banana Embroidered Cap",
    brand: "SNITCH",
    description: "Classic six-panel dad hat in distressed washed black canvas, detailed with a tiny, high-density embroidered neon yellow nano banana design. Features an adjustable brass clasp strap for a customized fit.",
    originalPrice: {
      amount: 1499,
      currency: "INR"
    },
    price: {
      amount: 899,
      currency: "INR"
    },
    discountPercent: 40,
    coverImage: "/assets/nano_banana_cap.png",
    category: {
      for: "Mens",
      name: "Accessories"
    },
    badge: "limited-edition",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 50,
        colors: [
          {
            name: "Washed Black",
            hex: "#212121",
            images: ["/assets/nano_banana_cap.png"]
          }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect DB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully for seeding");

    // Clean existing "Nano Banana" products if any to avoid duplication
    const deleteResult = await ProductModel.deleteMany({
      title: { $regex: /Nano Banana/i }
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing Nano Banana products.`);

    // Transform nanoProducts from the old nested structure to Color-as-Product format
    const transformedProducts = [];
    nanoProducts.forEach((orig, index) => {
      const styleCode = `ST-NANO-${1000 + index}`;
      const colorMap = {}; // name -> { name, hex, images, sizes: [] }

      orig.stock.forEach(sizeItem => {
        if (sizeItem.colors) {
          sizeItem.colors.forEach(colorItem => {
            if (!colorMap[colorItem.name]) {
              colorMap[colorItem.name] = {
                name: colorItem.name,
                hex: colorItem.hex,
                images: colorItem.images || [],
                sizes: []
              };
            }
            colorMap[colorItem.name].sizes.push({
              size: sizeItem.size,
              quantity: sizeItem.quantity
            });
          });
        }
      });

      Object.values(colorMap).forEach(variant => {
        transformedProducts.push({
          title: `${orig.title} - ${variant.name}`,
          brand: orig.brand,
          description: orig.description,
          originalPrice: orig.originalPrice,
          price: orig.price,
          discountPercent: orig.discountPercent,
          rating: orig.rating || 4.5,
          reviewCount: orig.reviewCount || 0,
          coverImage: variant.images[0] || orig.coverImage,
          category: orig.category,
          badge: orig.badge,
          seller: orig.seller,
          styleCode: styleCode,
          color: {
            name: variant.name,
            hex: variant.hex
          },
          sizes: variant.sizes,
          images: variant.images
        });
      });
    });

    // Insert new ones
    const createdProducts = await ProductModel.insertMany(transformedProducts);
    console.log(`Successfully seeded ${createdProducts.length} new Nano Banana products!`);

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

// Execute
copyImageFiles();
seedDatabase();
