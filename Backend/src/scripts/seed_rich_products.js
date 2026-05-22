import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductModel from "../models/product.model.js";

// Load environment variables
dotenv.config({ path: "../../.env" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is missing from environmental variables");
  process.exit(1);
}

const sellerId = "69de61e7ad40720b2de62beb"; // 'yoboy' seller account

const productsData = [
  {
    title: "Aether Technical Windbreaker",
    brand: "SNITCH",
    description: "A lightweight, weather-resistant shell crafted from premium technical fabric. Designed with an adjustable hood, water-repellent zippers, and clean minimalist lines.",
    originalPrice: { amount: 4999, currency: "INR" },
    price: { amount: 3499, currency: "INR" },
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 84,
    coverImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Jackets" },
    badge: "new-arrival",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 15,
        colors: [
          { name: "Charcoal Gray", hex: "#2F4F4F", images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"] },
          { name: "Cobalt Blue", hex: "#0047AB", images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "M",
        quantity: 20,
        colors: [
          { name: "Charcoal Gray", hex: "#2F4F4F", images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"] },
          { name: "Cobalt Blue", hex: "#0047AB", images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 25,
        colors: [
          { name: "Charcoal Gray", hex: "#2F4F4F", images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"] },
          { name: "Cobalt Blue", hex: "#0047AB", images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "XL",
        quantity: 10,
        colors: [
          { name: "Charcoal Gray", hex: "#2F4F4F", images: ["https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"] },
          { name: "Cobalt Blue", hex: "#0047AB", images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Classic Linen Button-Down",
    brand: "SNITCH",
    description: "Breathable, premium linen-cotton blend shirt in a relaxed tailoring. Perfect for warm-weather layering or as a standalone smart-casual piece.",
    originalPrice: { amount: 2999, currency: "INR" },
    price: { amount: 1899, currency: "INR" },
    discountPercent: 36,
    rating: 4.8,
    reviewCount: 112,
    coverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Shirts" },
    badge: "best-seller",
    seller: sellerId,
    stock: [
      {
        size: "M",
        quantity: 30,
        colors: [
          { name: "Olive Green", hex: "#556B2F", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
          { name: "Sand Beige", hex: "#F5F5DC", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 30,
        colors: [
          { name: "Olive Green", hex: "#556B2F", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
          { name: "Sand Beige", hex: "#F5F5DC", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "XL",
        quantity: 20,
        colors: [
          { name: "Olive Green", hex: "#556B2F", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
          { name: "Sand Beige", hex: "#F5F5DC", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Streetwear Cargo Trousers",
    brand: "SNITCH",
    description: "Utility cargo pants featuring multi-pocket configuration, reinforced knees, and adjustable ankle cuffs. Heavyweight cotton twill for maximum durability.",
    originalPrice: { amount: 3999, currency: "INR" },
    price: { amount: 2499, currency: "INR" },
    discountPercent: 37,
    rating: 4.4,
    reviewCount: 48,
    coverImage: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Trousers" },
    badge: "sale",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 12,
        colors: [
          { name: "Combat Khaki", hex: "#8B8589", images: ["https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "M",
        quantity: 18,
        colors: [
          { name: "Combat Khaki", hex: "#8B8589", images: ["https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 15,
        colors: [
          { name: "Combat Khaki", hex: "#8B8589", images: ["https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Sartorial Double-Breasted Coat",
    brand: "SNITCH",
    description: "Exquisitely tailored wool-blend coat featuring a structured shoulder design, peak lapels, and double-breasted button closure. Timeless winter luxury.",
    originalPrice: { amount: 9999, currency: "INR" },
    price: { amount: 6999, currency: "INR" },
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 32,
    coverImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Coats" },
    badge: "limited-edition",
    seller: sellerId,
    stock: [
      {
        size: "M",
        quantity: 8,
        colors: [{ name: "Camel Brown", hex: "#C19A6B", images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 12,
        colors: [{ name: "Camel Brown", hex: "#C19A6B", images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "XL",
        quantity: 10,
        colors: [{ name: "Camel Brown", hex: "#C19A6B", images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  },
  {
    title: "Signature Raw Denim Jeans",
    brand: "SNITCH",
    description: "Premium 13.5oz raw indigo selvedge denim. Clean slim-straight fit that breaks in beautifully over time to map your natural wear patterns.",
    originalPrice: { amount: 4500, currency: "INR" },
    price: { amount: 2999, currency: "INR" },
    discountPercent: 33,
    rating: 4.7,
    reviewCount: 95,
    coverImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Jeans" },
    badge: "best-seller",
    seller: sellerId,
    stock: [
      {
        size: "M",
        quantity: 20,
        colors: [{ name: "Raw Indigo", hex: "#0F2C59", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 25,
        colors: [{ name: "Raw Indigo", hex: "#0F2C59", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "XL",
        quantity: 15,
        colors: [{ name: "Raw Indigo", hex: "#0F2C59", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  },
  {
    title: "Ethereal Satin Slip Dress",
    brand: "SNITCH",
    description: "Elegantly draped fluid satin midi dress featuring delicate adjustable spaghetti straps, a cowl neckline, and a subtle side slit for soft movement.",
    originalPrice: { amount: 3999, currency: "INR" },
    price: { amount: 2799, currency: "INR" },
    discountPercent: 30,
    rating: 4.5,
    reviewCount: 64,
    coverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    category: { for: "Womens", name: "Dresses" },
    badge: "new-arrival",
    seller: sellerId,
    stock: [
      {
        size: "XS",
        quantity: 10,
        colors: [
          { name: "Champagne Pink", hex: "#F3E5E8", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"] },
          { name: "Emerald Green", hex: "#046307", images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "S",
        quantity: 15,
        colors: [
          { name: "Champagne Pink", hex: "#F3E5E8", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"] },
          { name: "Emerald Green", hex: "#046307", images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "M",
        quantity: 15,
        colors: [
          { name: "Champagne Pink", hex: "#F3E5E8", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"] },
          { name: "Emerald Green", hex: "#046307", images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 10,
        colors: [
          { name: "Champagne Pink", hex: "#F3E5E8", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"] },
          { name: "Emerald Green", hex: "#046307", images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Structured Bouclé Jacket",
    brand: "SNITCH",
    description: "A chic textured bouclé knit jacket finished with gold-tone custom buttons and fringed trim details. A sophisticated outer layer for day-to-night styling.",
    originalPrice: { amount: 5499, currency: "INR" },
    price: { amount: 3899, currency: "INR" },
    discountPercent: 29,
    rating: 4.8,
    reviewCount: 42,
    coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    category: { for: "Womens", name: "Jackets" },
    badge: "best-seller",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 10,
        colors: [
          { name: "Cream Ivory", hex: "#FFFDD0", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "M",
        quantity: 12,
        colors: [
          { name: "Cream Ivory", hex: "#FFFDD0", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 8,
        colors: [
          { name: "Cream Ivory", hex: "#FFFDD0", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "High-Waist Pleated Trousers",
    brand: "SNITCH",
    description: "Flowy, wide-leg tailored trousers featuring sharp front pleats and a high-rise waist. Lightweight crease-resistant crepe fabric.",
    originalPrice: { amount: 2999, currency: "INR" },
    price: { amount: 1999, currency: "INR" },
    discountPercent: 33,
    rating: 4.4,
    reviewCount: 51,
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    category: { for: "Womens", name: "Trousers" },
    badge: "sale",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 15,
        colors: [
          { name: "Taupe Brown", hex: "#B38B6D", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "M",
        quantity: 20,
        colors: [
          { name: "Taupe Brown", hex: "#B38B6D", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 15,
        colors: [
          { name: "Taupe Brown", hex: "#B38B6D", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Ribbed Knit Midi Skirt",
    brand: "SNITCH",
    description: "Soft, form-fitting ribbed knit skirt with a comfortable elasticated waistband and side slit. Crafted from premium organic cotton yarn.",
    originalPrice: { amount: 2499, currency: "INR" },
    price: { amount: 1599, currency: "INR" },
    discountPercent: 36,
    rating: 4.3,
    reviewCount: 39,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    category: { for: "Womens", name: "Skirts" },
    badge: "new-arrival",
    seller: sellerId,
    stock: [
      {
        size: "XS",
        quantity: 8,
        colors: [
          { name: "Heather Gray", hex: "#808080", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "S",
        quantity: 12,
        colors: [
          { name: "Heather Gray", hex: "#808080", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "M",
        quantity: 15,
        colors: [
          { name: "Heather Gray", hex: "#808080", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 10,
        colors: [
          { name: "Heather Gray", hex: "#808080", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Aero Comfort Knit Sneakers",
    brand: "SNITCH",
    description: "Ultra-lightweight breathable knit sneakers with a responsive impact-absorbing sole and ergonomic sock-like collar for all-day urban exploration.",
    originalPrice: { amount: 4999, currency: "INR" },
    price: { amount: 3299, currency: "INR" },
    discountPercent: 34,
    rating: 4.7,
    reviewCount: 142,
    coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Shoes" },
    badge: "best-seller",
    seller: sellerId,
    stock: [
      {
        size: "M",
        quantity: 25,
        colors: [
          { name: "Cloud White", hex: "#F8F9FA", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"] },
          { name: "Ash Black", hex: "#343A40", images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "L",
        quantity: 30,
        colors: [
          { name: "Cloud White", hex: "#F8F9FA", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"] },
          { name: "Ash Black", hex: "#343A40", images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"] }
        ]
      },
      {
        size: "XL",
        quantity: 20,
        colors: [
          { name: "Cloud White", hex: "#F8F9FA", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"] },
          { name: "Ash Black", hex: "#343A40", images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"] }
        ]
      }
    ]
  },
  {
    title: "Minimalist Leather Chelsea Boots",
    brand: "SNITCH",
    description: "Premium full-grain leather Chelsea boots featuring elasticated side gussets, pull tabs, and a durable stacked leather sole. Handcrafted elegance.",
    originalPrice: { amount: 6999, currency: "INR" },
    price: { amount: 4899, currency: "INR" },
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 29,
    coverImage: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Shoes" },
    badge: "limited-edition",
    seller: sellerId,
    stock: [
      {
        size: "M",
        quantity: 12,
        colors: [{ name: "Chocolate Brown", hex: "#3D2314", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 18,
        colors: [{ name: "Chocolate Brown", hex: "#3D2314", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "XL",
        quantity: 10,
        colors: [{ name: "Chocolate Brown", hex: "#3D2314", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  },
  {
    title: "Polar Bear Fleece Pullover",
    brand: "SNITCH",
    description: "Super-soft, high-pile Sherpa fleece hoodie designed to keep your little ones warm. Features a cute bear ear hood and a cozy front kangaroo pocket.",
    originalPrice: { amount: 2199, currency: "INR" },
    price: { amount: 1499, currency: "INR" },
    discountPercent: 31,
    rating: 4.9,
    reviewCount: 75,
    coverImage: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80",
    category: { for: "Kids", name: "Jackets" },
    badge: "new-arrival",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 15,
        colors: [{ name: "Teddy Brown", hex: "#967969", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "M",
        quantity: 20,
        colors: [{ name: "Teddy Brown", hex: "#967969", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 15,
        colors: [{ name: "Teddy Brown", hex: "#967969", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  },
  {
    title: "Retro Denim Dungarees",
    brand: "SNITCH",
    description: "Durable washed blue denim overalls featuring adjustable shoulder straps, multi-pocket utility design, and easy button side closures.",
    originalPrice: { amount: 2499, currency: "INR" },
    price: { amount: 1699, currency: "INR" },
    discountPercent: 32,
    rating: 4.8,
    reviewCount: 38,
    coverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80",
    category: { for: "Kids", name: "Jeans" },
    badge: "best-seller",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 10,
        colors: [{ name: "Vintage Blue", hex: "#4682B4", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "M",
        quantity: 15,
        colors: [{ name: "Vintage Blue", hex: "#4682B4", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 12,
        colors: [{ name: "Vintage Blue", hex: "#4682B4", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  },
  {
    title: "Signature Matte Aviator Sunglasses",
    brand: "SNITCH",
    description: "Classic aviator frames in high-grade stainless steel with polarising matte black lenses. Offers 100% UVA/UVB protection and a scratch-resistant coating.",
    originalPrice: { amount: 1999, currency: "INR" },
    price: { amount: 1299, currency: "INR" },
    discountPercent: 35,
    rating: 4.5,
    reviewCount: 110,
    coverImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Accessories" },
    badge: "limited-edition",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 20,
        colors: [{ name: "Matte Black", hex: "#000000", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "M",
        quantity: 35,
        colors: [{ name: "Matte Black", hex: "#000000", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 25,
        colors: [{ name: "Matte Black", hex: "#000000", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  },
  {
    title: "Streetwear Graphic Tee",
    brand: "SNITCH",
    description: "Heavyweight organic cotton streetwear tee featuring a bold retro-modern graphic print on the chest. Relaxed boxy fit with dropped shoulders.",
    originalPrice: { amount: 1799, currency: "INR" },
    price: { amount: 1199, currency: "INR" },
    discountPercent: 33,
    rating: 4.7,
    reviewCount: 154,
    coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    category: { for: "Mens", name: "Tshirts" },
    badge: "new-arrival",
    seller: sellerId,
    stock: [
      {
        size: "S",
        quantity: 30,
        colors: [{ name: "Graphic White", hex: "#FFFFFF", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "M",
        quantity: 45,
        colors: [{ name: "Graphic White", hex: "#FFFFFF", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "L",
        quantity: 40,
        colors: [{ name: "Graphic White", hex: "#FFFFFF", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] }]
      },
      {
        size: "XL",
        quantity: 20,
        colors: [{ name: "Graphic White", hex: "#FFFFFF", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] }]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect DB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully for rich products seeding");

    // Clear existing products to ensure a fresh, clean database storefront
    const deleteResult = await ProductModel.deleteMany({});
    console.log(`Cleaned up database: Deleted ${deleteResult.deletedCount} existing products.`);

    // Insert new ones
    const createdProducts = await ProductModel.insertMany(productsData);
    console.log(`Successfully seeded ${createdProducts.length} premium products into the database!`);

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

// Execute seeding
seedDatabase();
