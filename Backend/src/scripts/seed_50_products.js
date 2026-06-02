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

const SELLER_ID = "69de61e7ad40720b2de62beb"; // Default seller

// Define the 19 fashion series with expanded color variants (totaling 70 products)
const seriesData = [
  {
    key: "Aero Comfort Knit Sneakers Series",
    styleCode: "SN-AERO-01",
    brand: "SNITCH",
    category: { for: "Mens", name: "Shoes" },
    badge: "best-seller",
    description: "Designed with responsive comfort knit uppers and lightweight phylon soles, these sneakers offer adaptive flexibility for all-day athletic performance or everyday street style. Features seamless construction and breathable lining.",
    price: 3299,
    originalPrice: 4999,
    discountPercent: 34,
    rating: 4.7,
    reviewCount: 142,
    variants: [
      { name: "Cloud White", hex: "#F8F9FA", coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"] },
      { name: "Ash Black", hex: "#343A40", coverImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"] },
      { name: "Crimson Red", hex: "#DC3545", coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"] },
      { name: "Navy Blue", hex: "#000080", coverImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"] },
      { name: "Forest Green", hex: "#228B22", coverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Classic Linen Button-Down Series",
    styleCode: "SN-LINEN-02",
    brand: "SNITCH",
    category: { for: "Mens", name: "Shirts" },
    badge: "best-seller",
    description: "Breathable and highly comfortable, this shirt is woven from a luxury linen-cotton blend. Tailored for a clean, relaxed shape that layers effortlessly or stands bold on its own.",
    price: 1899,
    originalPrice: 2999,
    discountPercent: 36,
    rating: 4.8,
    reviewCount: 112,
    variants: [
      { name: "Sand Beige", hex: "#F5F5DC", coverImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
      { name: "Olive Green", hex: "#556B2F", coverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] },
      { name: "Pastel Pink", hex: "#FFD1DC", coverImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
      { name: "Sky Blue", hex: "#87CEEB", coverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] },
      { name: "Lavender Purple", hex: "#E6E6FA", coverImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Streetwear Cargo Trousers Series",
    styleCode: "SN-CARGO-03",
    brand: "SNITCH",
    category: { for: "Mens", name: "Trousers" },
    badge: "sale",
    description: "Utility cargo pants featuring multi-pocket configuration, reinforced knees, and adjustable ankle cuffs. Heavyweight cotton twill for maximum durability.",
    price: 2499,
    originalPrice: 3999,
    discountPercent: 37,
    rating: 4.4,
    reviewCount: 48,
    variants: [
      { name: "Combat Khaki", hex: "#8B8589", coverImage: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] },
      { name: "Stealth Black", hex: "#1A1A1A", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80"] },
      { name: "Navy Blue", hex: "#000080", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80"] },
      { name: "Olive Green", hex: "#556B2F", coverImage: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Sartorial Double-Breasted Coat Series",
    styleCode: "SN-SART-04",
    brand: "SNITCH",
    category: { for: "Mens", name: "Coats" },
    badge: "limited-edition",
    description: "Finely constructed winter luxury double-breasted coat in a heavy wool blend. Features custom tortoise closures, peak lapels, and deep interior slots.",
    price: 6999,
    originalPrice: 9999,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 32,
    variants: [
      { name: "Camel Brown", hex: "#C19A6B", coverImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80"] },
      { name: "Charcoal Gray", hex: "#36454F", coverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"] },
      { name: "Midnight Blue", hex: "#191970", coverImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80"] },
      { name: "Forest Green", hex: "#2E8B57", coverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Signature Raw Denim Jeans Series",
    styleCode: "SN-JEAN-05",
    brand: "SNITCH",
    category: { for: "Mens", name: "Jeans" },
    badge: "best-seller",
    description: "Premium raw selvedge denim in a clean straight fit. Breaks in uniquely to map your specific wear patterns over time.",
    price: 2999,
    originalPrice: 4500,
    discountPercent: 33,
    rating: 4.7,
    reviewCount: 95,
    variants: [
      { name: "Indigo Blue", hex: "#0F2C59", coverImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] },
      { name: "Jet Black", hex: "#1C1C1C", coverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"] },
      { name: "Bleached Blue", hex: "#ADD8E6", coverImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] },
      { name: "Dark Indigo", hex: "#1B305E", coverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Ethereal Satin Slip Dress Series",
    styleCode: "SN-SATIN-06",
    brand: "SNITCH",
    category: { for: "Womens", name: "Dresses" },
    badge: "new-arrival",
    description: "Exquisite fluid satin slip dress featuring elegant spaghetti straps and a soft cowl neck line. Delivers a gorgeous natural drape and clean lining.",
    price: 2799,
    originalPrice: 3999,
    discountPercent: 30,
    rating: 4.5,
    reviewCount: 64,
    variants: [
      { name: "Champagne Pink", hex: "#F3E5E8", coverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"] },
      { name: "Emerald Green", hex: "#046307", coverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"] },
      { name: "Royal Violet", hex: "#4B0082", coverImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"] },
      { name: "Ruby Red", hex: "#E0115F", coverImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Structured Bouclé Jacket Series",
    styleCode: "SN-BOUC-07",
    brand: "SNITCH",
    category: { for: "Womens", name: "Jackets" },
    badge: "best-seller",
    description: "French-inspired bouclé weave knit jacket featuring tactile gold-tone buttons and patch pockets. Provides structured form and vintage class.",
    price: 3899,
    originalPrice: 5499,
    discountPercent: 29,
    rating: 4.8,
    reviewCount: 42,
    variants: [
      { name: "Cream Ivory", hex: "#FFFDD0", coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Rose Pink", hex: "#FFC0CB", coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Onyx Black", hex: "#0F0F0F", coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Charcoal Gray", hex: "#2F4F4F", coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Classic Crewneck Graphic Tee Series",
    styleCode: "SN-TEE-08",
    brand: "SNITCH",
    category: { for: "Mens", name: "Tshirts" },
    badge: "new-arrival",
    description: "Heavyweight organic jersey graphic tee cut in an oversized boxy block. Features clean double stitching and a retro-washed graphic print.",
    price: 1199,
    originalPrice: 1799,
    discountPercent: 33,
    rating: 4.7,
    reviewCount: 154,
    variants: [
      { name: "Graphic White", hex: "#FFFFFF", coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] },
      { name: "Athletic Gray", hex: "#D3D3D3", coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] },
      { name: "Sunset Orange", hex: "#FF5F1F", coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] },
      { name: "Navy Blue", hex: "#000080", coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] },
      { name: "Stealth Black", hex: "#1C1C1C", coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Elite Wool Trench Coat Series",
    styleCode: "SN-ELITE-09",
    brand: "SNITCH",
    category: { for: "Mens", name: "Coats" },
    badge: "limited-edition",
    description: "Premium heavy wool blend tailored trench coat featuring broad notch lapels, buttoned sleeve straps, a clean storm flap, and visceral satin linings.",
    price: 8999,
    originalPrice: 12999,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 147,
    variants: [
      { name: "Charcoal Gray", hex: "#36454F", coverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80"] },
      { name: "Camel Tan", hex: "#C19A6B", coverImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"] },
      { name: "Midnight Navy", hex: "#1A2433", coverImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"] },
      { name: "Black Gold", hex: "#8D7B54", coverImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "High-Waist Pleated Trousers Series",
    styleCode: "SN-TROU-10",
    brand: "SNITCH",
    category: { for: "Mens", name: "Trousers" },
    badge: "sale",
    description: "Relaxed pleated trousers constructed with a high-rise waist and fluid front pleats. Provides premium drapery and tailored versatility.",
    price: 1999,
    originalPrice: 2999,
    discountPercent: 33,
    rating: 4.4,
    reviewCount: 51,
    variants: [
      { name: "Taupe Brown", hex: "#B38B6D", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] },
      { name: "Navy Blue", hex: "#101D42", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] },
      { name: "Light Gray", hex: "#E5E5E5", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] },
      { name: "Olive Drab", hex: "#3C4E3A", coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Ribbed Knit Midi Skirt Series",
    styleCode: "SN-SKIRT-11",
    brand: "SNITCH",
    category: { for: "Womens", name: "Skirts" },
    badge: "new-arrival",
    description: "Premium heavy-weight ribbed knit midi skirt featuring a comfortable elastic waist band. Designed for a sleek body-hugging line and clean warmth.",
    price: 1599,
    originalPrice: 2499,
    discountPercent: 36,
    rating: 4.3,
    reviewCount: 39,
    variants: [
      { name: "Heather Gray", hex: "#808080", coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Rusty Amber", hex: "#FFBF00", coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Sage Green", hex: "#9C9C84", coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Charcoal Black", hex: "#1F2022", coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Minimalist Leather Chelsea Boots Series",
    styleCode: "SN-BOOT-12",
    brand: "SNITCH",
    category: { for: "Mens", name: "Shoes" },
    badge: "limited-edition",
    description: "Premium full-grain leather Chelsea boots featuring double pull tabs and custom elastic side gores. Offers unmatched durability and sleek detailing.",
    price: 4899,
    originalPrice: 6999,
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 29,
    variants: [
      { name: "Chestnut Brown", hex: "#5C4033", coverImage: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80"] },
      { name: "Onyx Black", hex: "#0D0D0D", coverImage: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80"] },
      { name: "Tan Suede", hex: "#D2B48C", coverImage: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Polar Bear Fleece Pullover Series",
    styleCode: "SN-FLEECE-13",
    brand: "SNITCH",
    category: { for: "Mens", name: "Jackets" },
    badge: "new-arrival",
    description: "Thick polar thermal fleece pullover featuring a snap-button mock neck and contrast binding details. Designed to maintain warmth during cold elements.",
    price: 1499,
    originalPrice: 2199,
    discountPercent: 31,
    rating: 4.9,
    reviewCount: 75,
    variants: [
      { name: "Teddy Brown", hex: "#967969", coverImage: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Off White", hex: "#FAF9F6", coverImage: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Forest Green", hex: "#B2AC88", coverImage: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] },
      { name: "Charcoal Gray", hex: "#2E2F30", coverImage: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Retro Denim Dungarees Series",
    styleCode: "SN-DUNG-14",
    brand: "SNITCH",
    category: { for: "Mens", name: "Jeans" },
    badge: "best-seller",
    description: "Classic dungarees crafted in 12oz washed denim. Features metal buckle straps, chest utility pouch, and standard tool loops for retro workwear utility.",
    price: 1699,
    originalPrice: 2499,
    discountPercent: 32,
    rating: 4.8,
    reviewCount: 38,
    variants: [
      { name: "Vintage Blue", hex: "#4682B4", coverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] },
      { name: "Dark Indigo", hex: "#1F305E", coverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] },
      { name: "Light Bleach", hex: "#D0E0F0", coverImage: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Aviator Metal Sunglasses Series",
    styleCode: "SN-GLASS-15",
    brand: "SNITCH",
    category: { for: "Mens", name: "Accessories" },
    badge: "limited-edition",
    description: "Premium aviator frames crafted from polished stainless steel. Features polarized lenses with 100% UV400 shield and adjustable silicone nose pads.",
    price: 1299,
    originalPrice: 1999,
    discountPercent: 35,
    rating: 4.5,
    reviewCount: 110,
    variants: [
      { name: "Gold Frame", hex: "#FFD700", coverImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] },
      { name: "Gunmetal Frame", hex: "#8A9A86", coverImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] },
      { name: "Black Frame", hex: "#000000", coverImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] },
      { name: "Silver Frame", hex: "#C0C0C0", coverImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Pima Cotton Henley Shirt Series",
    styleCode: "SN-HENL-16",
    brand: "SNITCH",
    category: { for: "Mens", name: "Shirts" },
    badge: "new-arrival",
    description: "Premium long-sleeve Henley shirt knitted from extra-long staple Pima cotton. Offers exceptional softness, comfort, and custom three-button placket detailing.",
    price: 1399,
    originalPrice: 1999,
    discountPercent: 30,
    rating: 4.6,
    reviewCount: 68,
    variants: [
      { name: "Cloud Gray", hex: "#E8E8E8", coverImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
      { name: "Navy Blue", hex: "#0F1E36", coverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] },
      { name: "Forest Green", hex: "#1E3F20", coverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] },
      { name: "Wine Red", hex: "#722F37", coverImage: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"] },
      { name: "Stealth Black", hex: "#0E0E0F", coverImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80", images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"] }
    ]
  },
  {
    key: "Nano Banana Graphic Tee Series",
    styleCode: "SN-NANO-17",
    brand: "SNITCH",
    category: { for: "Mens", name: "Tshirts" },
    badge: "new-arrival",
    description: "Oversized cotton streetwear tee featuring a bold retro-modern graphic print on the chest. Relaxed boxy fit with dropped shoulders.",
    price: 1299,
    originalPrice: 2499,
    discountPercent: 48,
    rating: 4.5,
    reviewCount: 15,
    variants: [
      { name: "Deep Black", hex: "#0b0c10", coverImage: "/assets/nano_banana_tee.png", images: ["/assets/nano_banana_tee.png"] }
    ]
  },
  {
    key: "Nano Banana Pastel Hoodie Series",
    styleCode: "SN-NANO-18",
    brand: "SNITCH",
    category: { for: "Mens", name: "Jackets" },
    badge: "best-seller",
    description: "Premium fleece pullover hoodie in a soft pastel yellow weave. Features cozy drawcords, kangaroo pockets, and high comfort fit.",
    price: 2899,
    originalPrice: 4999,
    discountPercent: 42,
    rating: 4.5,
    reviewCount: 22,
    variants: [
      { name: "Pastel Yellow", hex: "#fef6c9", coverImage: "/assets/nano_banana_hoodie.png", images: ["/assets/nano_banana_hoodie.png"] }
    ]
  },
  {
    key: "Nano Banana Cap Series",
    styleCode: "SN-NANO-19",
    brand: "SNITCH",
    category: { for: "Mens", name: "Accessories" },
    badge: "limited-edition",
    description: "Adjustable washed cotton baseball cap with custom embroidered Nano Banana logo on the front. Classic curved visor and brass buckle closure.",
    price: 899,
    originalPrice: 1499,
    discountPercent: 40,
    rating: 4.5,
    reviewCount: 9,
    variants: [
      { name: "Washed Black", hex: "#212121", coverImage: "/assets/nano_banana_cap.png", images: ["/assets/nano_banana_cap.png"] }
    ]
  }
];

const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];

// Help generate random sizes and stock capacities
const generateSizes = () => {
  return sizesList.map(sz => {
    // Random stock quantity between 5 and 45 units
    const quantity = Math.floor(Math.random() * 41) + 5;
    return { size: sz, quantity };
  });
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully for mass database seed");

    // 1. Wipe out existing product and style code collections entirely
    const deleteProducts = await ProductModel.deleteMany({});
    const deleteStyleCodes = await StyleCodeModel.deleteMany({});
    
    console.log(`Cleared collections:\n- Deleted ${deleteProducts.deletedCount} products.\n- Deleted ${deleteStyleCodes.deletedCount} style codes.`);

    const styleCodesToInsert = [];
    const productsToInsert = [];

    // 2. Loop through our series and generate documents
    seriesData.forEach(series => {
      // Create StyleCode Passbook entry
      styleCodesToInsert.push({
        seller: SELLER_ID,
        key: series.key,
        styleCode: series.styleCode
      });

      // Generate separate standalone product variants for each color
      series.variants.forEach(variant => {
        productsToInsert.push({
          title: `${series.key.replace(" Series", "")} - ${variant.name}`,
          brand: series.brand,
          description: series.description,
          originalPrice: { amount: series.originalPrice, currency: "INR" },
          price: { amount: series.price, currency: "INR" },
          discountPercent: series.discountPercent,
          rating: series.rating,
          reviewCount: series.reviewCount,
          styleCode: series.styleCode,
          color: { name: variant.name, hex: variant.hex },
          sizes: generateSizes(),
          coverImage: variant.coverImage,
          images: variant.images,
          category: series.category,
          badge: series.badge,
          seller: SELLER_ID
        });
      });
    });

    console.log(`Preparing to insert:\n- ${styleCodesToInsert.length} StyleCode registry keys.\n- ${productsToInsert.length} Product variants.`);

    // 3. Database insertions
    const insertedStyleCodes = await StyleCodeModel.insertMany(styleCodesToInsert);
    console.log(`Seeded ${insertedStyleCodes.length} style codes in Passbook.`);

    const insertedProducts = await ProductModel.insertMany(productsToInsert);
    console.log(`Seeded ${insertedProducts.length} standalone product variants in Catalog.`);

    console.log("\n>>> SUCCESS: Mass database seeding complete! <<<");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed with exception:", error);
    process.exit(1);
  }
}

seed();
