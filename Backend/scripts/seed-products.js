/**
 * Bulk Product Seed Script for Snitch E-Commerce
 *
 * Usage:
 *   cd Backend && node scripts/seed-products.js
 *
 * What it does:
 *   - Connects to the LOCAL MongoDB (uses MONGO_URI from .env)
 *   - Finds an existing seller user to assign products to
 *   - Creates 100+ realistic clothing products with variants
 *   - Skips products that already exist (by title)
 *   - Preserves all existing products, users, orders, carts
 *
 * Safe to run multiple times (idempotent by product title).
 * Does NOT affect production — reads the same .env as the dev server.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env from Backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

// ─── Product Schema (matches existing model exactly) ────────────────────────

const priceSchema = new mongoose.Schema(
  { amount: { type: Number, required: true }, currency: { type: String, default: "INR" } },
  { _id: false, _v: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    price: { type: priceSchema, required: true },
    images: [{ url: { type: String, required: true } }],
    variants: [
      {
        images: [{ url: { type: String, required: true } }],
        stock: { type: Number, default: 0 },
        attributes: { type: Map, of: String },
        price: { type: priceSchema },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
const User = mongoose.model("user", new mongoose.Schema({}, { strict: false }));

// ─── Curated Image URLs ─────────────────────────────────────────────────────
// Free Unsplash images for clothing products (commercially usable).

const IMGS = {
  // T-shirts
  tshirt: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
  ],
  // Shirts
  shirt: [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop",
  ],
  // Jeans / Denim
  denim: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop",
  ],
  // Trousers / Pants
  trouser: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
  ],
  // Hoodies / Sweatshirts
  hoodie: [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1578768079470-7b3d6a6094d0?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1614976015542-941e45774e3e?w=600&h=800&fit=crop",
  ],
  // Dresses
  dress: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop&q=90",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
  ],
  // Jackets / Outerwear
  jacket: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&h=800&fit=crop",
  ],
  // Sweaters / Knitwear
  sweater: [
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3a90?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=85",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop&q=85",
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3a90?w=600&h=800&fit=crop&q=85",
  ],
  // Kurtis / Ethnic
  kurti: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop&q=90",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop&q=90",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=85",
  ],
  // Co-ord / Sets
  coord: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop&q=85",
  ],
  // Shoes
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=800&fit=crop",
  ],
  // Accessories
  accessory: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
  ],
};

// ─── Product Catalog ────────────────────────────────────────────────────────

const SELLER_ID = "69e691bfabb21f0711432d50"; // existing seller from DB

const products = [
  // ──── MEN: T-SHIRTS ──────────────────────────────────────────────────────
  {
    title: "Classic Oversized Cotton T-Shirt",
    description: "Premium 100% cotton oversized tee with a relaxed drop-shoulder silhouette. Perfect for layering or wearing solo for an effortlessly cool look.",
    price: { amount: 899, currency: "INR" },
    images: [{ url: IMGS.tshirt[0] }],
    variants: [
      { images: [{ url: IMGS.tshirt[0] }], stock: 50, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 899, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[0] }], stock: 45, attributes: new Map([["color", "White"], ["size", "L"]]), price: { amount: 899, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[1] }], stock: 40, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 899, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[1] }], stock: 35, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 899, currency: "INR" } },
    ],
  },
  {
    title: "Ribbed Knit Crew Neck Tee",
    description: "Textured ribbed cotton blend tee with a close-fitting crew neck. A versatile wardrobe essential that works day to night.",
    price: { amount: 749, currency: "INR" },
    images: [{ url: IMGS.tshirt[2] }],
    variants: [
      { images: [{ url: IMGS.tshirt[2] }], stock: 60, attributes: new Map([["color", "Grey"], ["size", "S"]]), price: { amount: 749, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[2] }], stock: 55, attributes: new Map([["color", "Grey"], ["size", "M"]]), price: { amount: 749, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[3] }], stock: 50, attributes: new Map([["color", "Navy"], ["size", "M"]]), price: { amount: 749, currency: "INR" } },
    ],
  },
  {
    title: "Piqué Polo T-Shirt",
    description: "Classic piqué knit polo with a structured collar and two-button placket. Breathable cotton for warm-weather sophistication.",
    price: { amount: 1199, currency: "INR" },
    images: [{ url: IMGS.tshirt[4] }],
    variants: [
      { images: [{ url: IMGS.tshirt[4] }], stock: 30, attributes: new Map([["color", "Navy"], ["size", "M"]]), price: { amount: 1199, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[4] }], stock: 25, attributes: new Map([["color", "Navy"], ["size", "L"]]), price: { amount: 1199, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[5] }], stock: 35, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 1199, currency: "INR" } },
    ],
  },
  {
    title: "Vintage Wash Graphic Tee",
    description: "Soft-washed cotton tee with a subtle vintage patina and minimal chest graphic. Lived-in comfort from day one.",
    price: { amount: 999, currency: "INR" },
    images: [{ url: IMGS.tshirt[1] }],
    variants: [
      { images: [{ url: IMGS.tshirt[1] }], stock: 40, attributes: new Map([["color", "Charcoal"], ["size", "M"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[1] }], stock: 35, attributes: new Map([["color", "Charcoal"], ["size", "L"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[0] }], stock: 30, attributes: new Map([["color", "Off-White"], ["size", "M"]]), price: { amount: 999, currency: "INR" } },
    ],
  },
  {
    title: "Slim Fit Henley Tee",
    description: "Long-sleeve henley with a three-button placket in brushed cotton jersey. Rugged refinement for transitional weather.",
    price: { amount: 1099, currency: "INR" },
    images: [{ url: IMGS.tshirt[3] }],
    variants: [
      { images: [{ url: IMGS.tshirt[3] }], stock: 25, attributes: new Map([["color", "Olive"], ["size", "M"]]), price: { amount: 1099, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[3] }], stock: 20, attributes: new Map([["color", "Olive"], ["size", "L"]]), price: { amount: 1099, currency: "INR" } },
    ],
  },
  {
    title: "Stripe Minimal Tee",
    description: "Clean horizontal stripe pattern on lightweight cotton jersey. A timeless nautical-inspired staple.",
    price: { amount: 849, currency: "INR" },
    images: [{ url: IMGS.tshirt[5] }],
    variants: [
      { images: [{ url: IMGS.tshirt[5] }], stock: 45, attributes: new Map([["color", "Blue Stripe"], ["size", "S"]]), price: { amount: 849, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[5] }], stock: 50, attributes: new Map([["color", "Blue Stripe"], ["size", "M"]]), price: { amount: 849, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[5] }], stock: 40, attributes: new Map([["color", "Blue Stripe"], ["size", "L"]]), price: { amount: 849, currency: "INR" } },
    ],
  },

  // ──── MEN: SHIRTS ────────────────────────────────────────────────────────
  {
    title: "Slim Fit Oxford Casual Shirt",
    description: "Washed Oxford cotton shirt with a tailored slim fit. Button-down collar and a chest pocket complete this smart-casual essential.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: IMGS.shirt[0] }],
    variants: [
      { images: [{ url: IMGS.shirt[0] }], stock: 30, attributes: new Map([["color", "Sky Blue"], ["size", "M"]]), price: { amount: 1499, currency: "INR" } },
      { images: [{ url: IMGS.shirt[0] }], stock: 25, attributes: new Map([["color", "Sky Blue"], ["size", "L"]]), price: { amount: 1499, currency: "INR" } },
      { images: [{ url: IMGS.shirt[1] }], stock: 20, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 1499, currency: "INR" } },
    ],
  },
  {
    title: "Linen Blend Resort Shirt",
    description: "Relaxed-fit linen-cotton camp collar shirt. Breathable weave ideal for warm-weather dressing with a vacation-ready attitude.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.shirt[2] }],
    variants: [
      { images: [{ url: IMGS.shirt[2] }], stock: 20, attributes: new Map([["color", "Sage"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.shirt[2] }], stock: 15, attributes: new Map([["color", "Sage"], ["size", "L"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.shirt[3] }], stock: 25, attributes: new Map([["color", "Beige"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Classic Chambray Button-Down",
    description: "Soft chambray shirt in a regular fit with a spread collar. The perfect alternative to denim in a lighter, more refined fabric.",
    price: { amount: 1399, currency: "INR" },
    images: [{ url: IMGS.shirt[3] }],
    variants: [
      { images: [{ url: IMGS.shirt[3] }], stock: 35, attributes: new Map([["color", "Light Blue"], ["size", "M"]]), price: { amount: 1399, currency: "INR" } },
      { images: [{ url: IMGS.shirt[3] }], stock: 30, attributes: new Map([["color", "Light Blue"], ["size", "L"]]), price: { amount: 1399, currency: "INR" } },
    ],
  },
  {
    title: "Floral Print Vacation Shirt",
    description: "All-over botanical print on a lightweight viscose shirt. An easy statement piece for holidays and weekend outings.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.shirt[4] }],
    variants: [
      { images: [{ url: IMGS.shirt[4] }], stock: 20, attributes: new Map([["color", "Dark Floral"], ["size", "M"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.shirt[4] }], stock: 15, attributes: new Map([["color", "Dark Floral"], ["size", "L"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },
  {
    title: "Formal Slim Fit Dress Shirt",
    description: "Crisp poplin dress shirt with a fitted silhouette and French placket. Boardroom-ready with a modern edge.",
    price: { amount: 1699, currency: "INR" },
    images: [{ url: IMGS.shirt[1] }],
    variants: [
      { images: [{ url: IMGS.shirt[1] }], stock: 25, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 1699, currency: "INR" } },
      { images: [{ url: IMGS.shirt[1] }], stock: 20, attributes: new Map([["color", "White"], ["size", "L"]]), price: { amount: 1699, currency: "INR" } },
      { images: [{ url: IMGS.shirt[0] }], stock: 15, attributes: new Map([["color", "Light Pink"], ["size", "M"]]), price: { amount: 1699, currency: "INR" } },
    ],
  },

  // ──── MEN: JEANS ─────────────────────────────────────────────────────────
  {
    title: "High-Rise Straight Fit Denim Jeans",
    description: "Heritage selvedge denim with a high-rise straight leg. Rigid 12oz cotton that breaks in beautifully over time.",
    price: { amount: 2299, currency: "INR" },
    images: [{ url: IMGS.denim[0] }],
    variants: [
      { images: [{ url: IMGS.denim[0] }], stock: 30, attributes: new Map([["color", "Indigo"], ["size", "30"]]), price: { amount: 2299, currency: "INR" } },
      { images: [{ url: IMGS.denim[0] }], stock: 25, attributes: new Map([["color", "Indigo"], ["size", "32"]]), price: { amount: 2299, currency: "INR" } },
      { images: [{ url: IMGS.denim[1] }], stock: 20, attributes: new Map([["color", "Light Wash"], ["size", "30"]]), price: { amount: 2299, currency: "INR" } },
      { images: [{ url: IMGS.denim[1] }], stock: 20, attributes: new Map([["color", "Light Wash"], ["size", "32"]]), price: { amount: 2299, currency: "INR" } },
    ],
  },
  {
    title: "Slim Tapered Stretch Jeans",
    description: "Modern slim taper cut in comfort-stretch denim. A clean silhouette that works with sneakers or boots alike.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.denim[2] }],
    variants: [
      { images: [{ url: IMGS.denim[2] }], stock: 35, attributes: new Map([["color", "Dark Indigo"], ["size", "30"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.denim[2] }], stock: 30, attributes: new Map([["color", "Dark Indigo"], ["size", "32"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.denim[2] }], stock: 25, attributes: new Map([["color", "Dark Indigo"], ["size", "34"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Relaxed Fit Carpenter Jeans",
    description: "Workwear-inspired carpenter jeans with utility loops and a relaxed fit. Durable canvas denim built for everyday wear.",
    price: { amount: 2199, currency: "INR" },
    images: [{ url: IMGS.denim[3] }],
    variants: [
      { images: [{ url: IMGS.denim[3] }], stock: 20, attributes: new Map([["color", "Washed Black"], ["size", "30"]]), price: { amount: 2199, currency: "INR" } },
      { images: [{ url: IMGS.denim[3] }], stock: 18, attributes: new Map([["color", "Washed Black"], ["size", "32"]]), price: { amount: 2199, currency: "INR" } },
    ],
  },
  {
    title: "Vintage Wash Bootcut Jeans",
    description: "Retro-inspired bootcut with a subtle flare at the hem. Stone-washed finish for an authentic lived-in feel.",
    price: { amount: 2099, currency: "INR" },
    images: [{ url: IMGS.denim[1] }],
    variants: [
      { images: [{ url: IMGS.denim[1] }], stock: 22, attributes: new Map([["color", "Medium Wash"], ["size", "30"]]), price: { amount: 2099, currency: "INR" } },
      { images: [{ url: IMGS.denim[1] }], stock: 18, attributes: new Map([["color", "Medium Wash"], ["size", "32"]]), price: { amount: 2099, currency: "INR" } },
    ],
  },

  // ──── MEN: TROUSERS ──────────────────────────────────────────────────────
  {
    title: "Relaxed Fit Cargo Trousers",
    description: "Military-inspired cargo pants with multiple utility pockets. Tapered leg in a durable cotton twill for off-duty styling.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.trouser[0] }],
    variants: [
      { images: [{ url: IMGS.trouser[0] }], stock: 30, attributes: new Map([["color", "Khaki"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.trouser[0] }], stock: 25, attributes: new Map([["color", "Khaki"], ["size", "L"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.trouser[0] }], stock: 20, attributes: new Map([["color", "Olive"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Pleated Wide Leg Trousers",
    description: "Tailored wide-leg trousers with single front pleat. Fluid drape in a lightweight wool-blend fabric for elevated minimalism.",
    price: { amount: 2499, currency: "INR" },
    images: [{ url: IMGS.trouser[1] }],
    variants: [
      { images: [{ url: IMGS.trouser[1] }], stock: 18, attributes: new Map([["color", "Charcoal"], ["size", "M"]]), price: { amount: 2499, currency: "INR" } },
      { images: [{ url: IMGS.trouser[1] }], stock: 15, attributes: new Map([["color", "Charcoal"], ["size", "L"]]), price: { amount: 2499, currency: "INR" } },
    ],
  },
  {
    title: "Drawstring Jogger Trousers",
    description: "French terry joggers with an elasticated waist and tapered ankle. Lounge-to-street comfort in premium cotton jersey.",
    price: { amount: 1299, currency: "INR" },
    images: [{ url: IMGS.trouser[2] }],
    variants: [
      { images: [{ url: IMGS.trouser[2] }], stock: 40, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.trouser[2] }], stock: 35, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.trouser[2] }], stock: 30, attributes: new Map([["color", "Grey"], ["size", "M"]]), price: { amount: 1299, currency: "INR" } },
    ],
  },
  {
    title: "Slim Fit Chinos",
    description: "Washed cotton chinos in a streamlined slim fit. Versatile enough for the office or a weekend brunch.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.trouser[3] }],
    variants: [
      { images: [{ url: IMGS.trouser[3] }], stock: 28, attributes: new Map([["color", "Tan"], ["size", "30"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.trouser[3] }], stock: 25, attributes: new Map([["color", "Tan"], ["size", "32"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.trouser[3] }], stock: 22, attributes: new Map([["color", "Navy"], ["size", "32"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },

  // ──── MEN: HOODIES / SWEATSHIRTS ─────────────────────────────────────────
  {
    title: "Oversized Fleece Hoodie",
    description: "Heavyweight brushed fleece hoodie with a kangaroo pocket and adjustable drawstring hood. Cosy oversized fit for maximum comfort.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.hoodie[0] }],
    variants: [
      { images: [{ url: IMGS.hoodie[0] }], stock: 35, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[0] }], stock: 30, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[1] }], stock: 25, attributes: new Map([["color", "Grey"], ["size", "M"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Half-Zip Pullover Sweatshirt",
    description: "Quarter-zip fleece pullover with a stand collar and ribbed cuffs. Layering made easy with a clean athletic aesthetic.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.hoodie[2] }],
    variants: [
      { images: [{ url: IMGS.hoodie[2] }], stock: 25, attributes: new Map([["color", "Forest Green"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[2] }], stock: 20, attributes: new Map([["color", "Forest Green"], ["size", "L"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Heavyweight Terry Hoodie",
    description: "Loopback terry hoodie in a boxy fit with dropped shoulders. Clean finish with no drawstring for a minimalist look.",
    price: { amount: 2199, currency: "INR" },
    images: [{ url: IMGS.hoodie[3] }],
    variants: [
      { images: [{ url: IMGS.hoodie[3] }], stock: 22, attributes: new Map([["color", "Sand"], ["size", "M"]]), price: { amount: 2199, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[3] }], stock: 18, attributes: new Map([["color", "Sand"], ["size", "L"]]), price: { amount: 2199, currency: "INR" } },
    ],
  },
  {
    title: "Logo Appliqué Crewneck Sweatshirt",
    description: "Mid-weight cotton fleece crewneck with a tonal embroidered logo on the chest. Easy weekend layering.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.hoodie[1] }],
    variants: [
      { images: [{ url: IMGS.hoodie[1] }], stock: 30, attributes: new Map([["color", "Cream"], ["size", "M"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[1] }], stock: 28, attributes: new Map([["color", "Cream"], ["size", "L"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },

  // ──── MEN: JACKETS ───────────────────────────────────────────────────────
  {
    title: "Classic Denim Trucker Jacket",
    description: "Iconic trucker jacket in unwashed indigo denim. Button front with chest flap pockets. A timeless layering piece.",
    price: { amount: 2999, currency: "INR" },
    images: [{ url: IMGS.jacket[0] }],
    variants: [
      { images: [{ url: IMGS.jacket[0] }], stock: 15, attributes: new Map([["color", "Indigo"], ["size", "M"]]), price: { amount: 2999, currency: "INR" } },
      { images: [{ url: IMGS.jacket[0] }], stock: 12, attributes: new Map([["color", "Indigo"], ["size", "L"]]), price: { amount: 2999, currency: "INR" } },
    ],
  },
  {
    title: "Utility Field Jacket",
    description: "Military-style field jacket with four front pockets and a drawstring waist. Water-resistant cotton canvas for unpredictable weather.",
    price: { amount: 3499, currency: "INR" },
    images: [{ url: IMGS.jacket[1] }],
    variants: [
      { images: [{ url: IMGS.jacket[1] }], stock: 12, attributes: new Map([["color", "Army Green"], ["size", "M"]]), price: { amount: 3499, currency: "INR" } },
      { images: [{ url: IMGS.jacket[1] }], stock: 10, attributes: new Map([["color", "Army Green"], ["size", "L"]]), price: { amount: 3499, currency: "INR" } },
    ],
  },
  {
    title: "Bomber Jacket",
    description: "Sleek nylon bomber with ribbed collar, cuffs, and hem. Padded lining for warmth without bulk. A modern essential.",
    price: { amount: 2799, currency: "INR" },
    images: [{ url: IMGS.jacket[2] }],
    variants: [
      { images: [{ url: IMGS.jacket[2] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 2799, currency: "INR" } },
      { images: [{ url: IMGS.jacket[2] }], stock: 15, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 2799, currency: "INR" } },
      { images: [{ url: IMGS.jacket[3] }], stock: 12, attributes: new Map([["color", "Navy"], ["size", "M"]]), price: { amount: 2799, currency: "INR" } },
    ],
  },
  {
    title: "Wool Blend Overcoat",
    description: "Mid-length overcoat in a structured wool-polyester blend. Notched lapels and a single-button closure for polished winter layering.",
    price: { amount: 4999, currency: "INR" },
    images: [{ url: IMGS.jacket[3] }],
    variants: [
      { images: [{ url: IMGS.jacket[3] }], stock: 8, attributes: new Map([["color", "Camel"], ["size", "M"]]), price: { amount: 4999, currency: "INR" } },
      { images: [{ url: IMGS.jacket[3] }], stock: 6, attributes: new Map([["color", "Camel"], ["size", "L"]]), price: { amount: 4999, currency: "INR" } },
    ],
  },

  // ──── MEN: SWEATERS ──────────────────────────────────────────────────────
  {
    title: "Ribbed Knit Crewneck Sweater",
    description: "Chunky ribbed knit in soft merino-blend yarn. Relaxed fit with a classic crew neck for everyday winter warmth.",
    price: { amount: 1899, currency: "INR" },
    images: [{ url: IMGS.sweater[0] }],
    variants: [
      { images: [{ url: IMGS.sweater[0] }], stock: 20, attributes: new Map([["color", "Oatmeal"], ["size", "M"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.sweater[0] }], stock: 18, attributes: new Map([["color", "Oatmeal"], ["size", "L"]]), price: { amount: 1899, currency: "INR" } },
    ],
  },
  {
    title: "Cable Knit V-Neck Sweater",
    description: "Traditional cable-knit pattern in a premium cotton-cashmere blend. V-neck for a preppy yet relaxed aesthetic.",
    price: { amount: 2299, currency: "INR" },
    images: [{ url: IMGS.sweater[1] }],
    variants: [
      { images: [{ url: IMGS.sweater[1] }], stock: 15, attributes: new Map([["color", "Navy"], ["size", "M"]]), price: { amount: 2299, currency: "INR" } },
      { images: [{ url: IMGS.sweater[1] }], stock: 12, attributes: new Map([["color", "Navy"], ["size", "L"]]), price: { amount: 2299, currency: "INR" } },
    ],
  },
  {
    title: "Mock Neck Merino Sweater",
    description: "Fine-gauge merino wool sweater with a mock turtleneck. Smooth hand-feel and a slim silhouette for refined layering.",
    price: { amount: 2499, currency: "INR" },
    images: [{ url: IMGS.sweater[2] }],
    variants: [
      { images: [{ url: IMGS.sweater[2] }], stock: 14, attributes: new Map([["color", "Charcoal"], ["size", "M"]]), price: { amount: 2499, currency: "INR" } },
      { images: [{ url: IMGS.sweater[2] }], stock: 12, attributes: new Map([["color", "Charcoal"], ["size", "L"]]), price: { amount: 2499, currency: "INR" } },
    ],
  },
  {
    title: "Zip-Through Track Jacket",
    description: "Retro-inspired track jacket in tricot fabric with contrast piping. Full zip, stand collar, and elasticated cuffs.",
    price: { amount: 1699, currency: "INR" },
    images: [{ url: IMGS.sweater[3] }],
    variants: [
      { images: [{ url: IMGS.sweater[3] }], stock: 22, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1699, currency: "INR" } },
      { images: [{ url: IMGS.sweater[3] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 1699, currency: "INR" } },
    ],
  },

  // ──── WOMEN: TOPS ────────────────────────────────────────────────────────
  {
    title: "Draped Cowl Neck Blouse",
    description: "Fluid viscose blouse with a flattering cowl neckline. Relaxed fit with a soft drape for effortless elegance.",
    price: { amount: 1299, currency: "INR" },
    images: [{ url: IMGS.tshirt[4] }],
    variants: [
      { images: [{ url: IMGS.tshirt[4] }], stock: 30, attributes: new Map([["color", "Ivory"], ["size", "S"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[4] }], stock: 28, attributes: new Map([["color", "Ivory"], ["size", "M"]]), price: { amount: 1299, currency: "INR" } },
    ],
  },
  {
    title: "Puff Sleeve Crop Top",
    description: "Statement puff sleeves on a cropped cotton top. Elasticated cuffs and hem for a romantic yet modern silhouette.",
    price: { amount: 999, currency: "INR" },
    images: [{ url: IMGS.tshirt[5] }],
    variants: [
      { images: [{ url: IMGS.tshirt[5] }], stock: 35, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[5] }], stock: 30, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[2] }], stock: 25, attributes: new Map([["color", "Lilac"], ["size", "S"]]), price: { amount: 999, currency: "INR" } },
    ],
  },
  {
    title: "Wrap-Front Satin Camisole",
    description: "Lustrous satin camisole with a flattering wrap front and adjustable spaghetti straps. Date-night essential.",
    price: { amount: 1199, currency: "INR" },
    images: [{ url: IMGS.coord[1] }],
    variants: [
      { images: [{ url: IMGS.coord[1] }], stock: 22, attributes: new Map([["color", "Champagne"], ["size", "S"]]), price: { amount: 1199, currency: "INR" } },
      { images: [{ url: IMGS.coord[1] }], stock: 20, attributes: new Map([["color", "Champagne"], ["size", "M"]]), price: { amount: 1199, currency: "INR" } },
    ],
  },
  {
    title: "Linen Button-Down Shirt",
    description: "Relaxed-fit linen shirt with mother-of-pearl buttons. Breathable and beautifully wrinkled — that's the charm.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: IMGS.shirt[2] }],
    variants: [
      { images: [{ url: IMGS.shirt[2] }], stock: 18, attributes: new Map([["color", "Powder Blue"], ["size", "S"]]), price: { amount: 1499, currency: "INR" } },
      { images: [{ url: IMGS.shirt[2] }], stock: 15, attributes: new Map([["color", "Powder Blue"], ["size", "M"]]), price: { amount: 1499, currency: "INR" } },
    ],
  },
  {
    title: "Ribbed Mock Neck Tank",
    description: "Form-fitting ribbed tank with a mock neckline. A sleek base layer or solo statement in stretch cotton.",
    price: { amount: 699, currency: "INR" },
    images: [{ url: IMGS.tshirt[3] }],
    variants: [
      { images: [{ url: IMGS.tshirt[3] }], stock: 40, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 699, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[3] }], stock: 35, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 699, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[0] }], stock: 30, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 699, currency: "INR" } },
    ],
  },

  // ──── WOMEN: DRESSES ─────────────────────────────────────────────────────
  {
    title: "Floral Printed Midi Dress",
    description: "Flowing midi dress in a ditsy floral print on lightweight georgette. Elasticated waist and flutter sleeves for a feminine silhouette.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.dress[0] }],
    variants: [
      { images: [{ url: IMGS.dress[0] }], stock: 20, attributes: new Map([["color", "Blue Floral"], ["size", "S"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.dress[0] }], stock: 18, attributes: new Map([["color", "Blue Floral"], ["size", "M"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.dress[1] }], stock: 15, attributes: new Map([["color", "Red Floral"], ["size", "S"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Minimal Slip Dress",
    description: "Bias-cut slip dress in washed silk-touch satin. V-neck, thin straps, and a figure-skimming silhouette. Day-to-night versatility.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.dress[2] }],
    variants: [
      { images: [{ url: IMGS.dress[2] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.dress[2] }], stock: 15, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.dress[4] }], stock: 12, attributes: new Map([["color", "Champagne"], ["size", "S"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Shirt Dress with Belt",
    description: "Crisp cotton shirt dress with a removable waist belt. Button front, pointed collar, and a midi hemline for polished ease.",
    price: { amount: 2199, currency: "INR" },
    images: [{ url: IMGS.dress[4] }],
    variants: [
      { images: [{ url: IMGS.dress[4] }], stock: 15, attributes: new Map([["color", "Khaki"], ["size", "S"]]), price: { amount: 2199, currency: "INR" } },
      { images: [{ url: IMGS.dress[4] }], stock: 12, attributes: new Map([["color", "Khaki"], ["size", "M"]]), price: { amount: 2199, currency: "INR" } },
    ],
  },
  {
    title: "Knitted Bodycon Dress",
    description: "Figure-hugging ribbed knit dress with a crew neck and above-knee hem. Stretchy double-knit fabric for a sculpted fit.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.coord[0] }],
    variants: [
      { images: [{ url: IMGS.coord[0] }], stock: 22, attributes: new Map([["color", "Camel"], ["size", "S"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.coord[0] }], stock: 18, attributes: new Map([["color", "Camel"], ["size", "M"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.coord[0] }], stock: 15, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },
  {
    title: "Tiered Maxi Dress",
    description: "Voluminous tiered maxi dress in breathable cotton voile. Smocked elasticated bodice and a flared hemline.",
    price: { amount: 2499, currency: "INR" },
    images: [{ url: IMGS.dress[1] }],
    variants: [
      { images: [{ url: IMGS.dress[1] }], stock: 12, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 2499, currency: "INR" } },
      { images: [{ url: IMGS.dress[1] }], stock: 10, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 2499, currency: "INR" } },
    ],
  },

  // ──── WOMEN: KURTIS / ETHNIC ─────────────────────────────────────────────
  {
    title: "Embroidered Cotton Kurti",
    description: "Hand-embroidered cotton kurti with delicate threadwork on the yoke. Straight-cut hemline with side slits for easy movement.",
    price: { amount: 1399, currency: "INR" },
    images: [{ url: IMGS.kurti[0] }],
    variants: [
      { images: [{ url: IMGS.kurti[0] }], stock: 25, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 1399, currency: "INR" } },
      { images: [{ url: IMGS.kurti[0] }], stock: 22, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 1399, currency: "INR" } },
      { images: [{ url: IMGS.kurti[0] }], stock: 18, attributes: new Map([["color", "White"], ["size", "L"]]), price: { amount: 1399, currency: "INR" } },
    ],
  },
  {
    title: "Printed A-Line Kurti",
    description: "All-over block-print kurti in a flattering A-line silhouette. Mandarin collar and three-quarter sleeves for everyday ethnic elegance.",
    price: { amount: 1199, currency: "INR" },
    images: [{ url: IMGS.kurti[1] }],
    variants: [
      { images: [{ url: IMGS.kurti[1] }], stock: 30, attributes: new Map([["color", "Indigo Print"], ["size", "S"]]), price: { amount: 1199, currency: "INR" } },
      { images: [{ url: IMGS.kurti[1] }], stock: 28, attributes: new Map([["color", "Indigo Print"], ["size", "M"]]), price: { amount: 1199, currency: "INR" } },
    ],
  },
  {
    title: "Anarkali Style Kurti",
    description: "Flared Anarkali-style kurti in georgette with a fitted bodice and flowing skirt. Perfect for festive gatherings.",
    price: { amount: 1899, currency: "INR" },
    images: [{ url: IMGS.kurti[2] }],
    variants: [
      { images: [{ url: IMGS.kurti[2] }], stock: 15, attributes: new Map([["color", "Teal"], ["size", "S"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.kurti[2] }], stock: 12, attributes: new Map([["color", "Teal"], ["size", "M"]]), price: { amount: 1899, currency: "INR" } },
    ],
  },
  {
    title: "Contemporary Straight Kurti",
    description: "Minimal straight-cut kurti in premium cotton with side pockets. Clean lines and a modern length that pairs well with jeans or leggings.",
    price: { amount: 1099, currency: "INR" },
    images: [{ url: IMGS.kurti[3] }],
    variants: [
      { images: [{ url: IMGS.kurti[3] }], stock: 32, attributes: new Map([["color", "Mustard"], ["size", "S"]]), price: { amount: 1099, currency: "INR" } },
      { images: [{ url: IMGS.kurti[3] }], stock: 28, attributes: new Map([["color", "Mustard"], ["size", "M"]]), price: { amount: 1099, currency: "INR" } },
      { images: [{ url: IMGS.kurti[3] }], stock: 22, attributes: new Map([["color", "Rust"], ["size", "M"]]), price: { amount: 1099, currency: "INR" } },
    ],
  },

  // ──── WOMEN: JEANS & TROUSERS ────────────────────────────────────────────
  {
    title: "High-Rise Skinny Jeans",
    description: "Figure-hugging skinny jeans in power-stretch denim. High waist with a clean ankle hem for a sleek profile.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.denim[0] }],
    variants: [
      { images: [{ url: IMGS.denim[0] }], stock: 28, attributes: new Map([["color", "Dark Blue"], ["size", "26"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.denim[0] }], stock: 25, attributes: new Map([["color", "Dark Blue"], ["size", "28"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.denim[1] }], stock: 20, attributes: new Map([["color", "Light Blue"], ["size", "26"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Wide Leg Palazzo Pants",
    description: "Fluid palazzo pants with a high waist and dramatic wide leg. Lightweight crepe fabric for effortless movement.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: IMGS.trouser[1] }],
    variants: [
      { images: [{ url: IMGS.trouser[1] }], stock: 20, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 1499, currency: "INR" } },
      { images: [{ url: IMGS.trouser[1] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1499, currency: "INR" } },
    ],
  },

  // ──── WOMEN: CO-ORD SETS ─────────────────────────────────────────────────
  {
    title: "Linen Co-ord Set — Crop Top & Shorts",
    description: "Matching linen crop top and high-waisted shorts set. Breathable summer coordinate with a relaxed tailored feel.",
    price: { amount: 2199, currency: "INR" },
    images: [{ url: IMGS.coord[0] }],
    variants: [
      { images: [{ url: IMGS.coord[0] }], stock: 15, attributes: new Map([["color", "Beige"], ["size", "S"]]), price: { amount: 2199, currency: "INR" } },
      { images: [{ url: IMGS.coord[0] }], stock: 12, attributes: new Map([["color", "Beige"], ["size", "M"]]), price: { amount: 2199, currency: "INR" } },
    ],
  },
  {
    title: "Ribbed Knit Two-Piece Set",
    description: "Matching ribbed knit tank and midi skirt set. Body-hugging stretch fabric in a tonal colourway for coordinated minimalism.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.coord[1] }],
    variants: [
      { images: [{ url: IMGS.coord[1] }], stock: 18, attributes: new Map([["color", "Mocha"], ["size", "S"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.coord[1] }], stock: 15, attributes: new Map([["color", "Mocha"], ["size", "M"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Printed Palazzo & Shirt Set",
    description: "Coordinating printed shirt and palazzo pant set in breathable viscose. Bold botanical pattern for resort-ready dressing.",
    price: { amount: 2499, currency: "INR" },
    images: [{ url: IMGS.coord[2] }],
    variants: [
      { images: [{ url: IMGS.coord[2] }], stock: 12, attributes: new Map([["color", "Green Botanical"], ["size", "S"]]), price: { amount: 2499, currency: "INR" } },
      { images: [{ url: IMGS.coord[2] }], stock: 10, attributes: new Map([["color", "Green Botanical"], ["size", "M"]]), price: { amount: 2499, currency: "INR" } },
    ],
  },

  // ──── WOMEN: JACKETS / OUTERWEAR ─────────────────────────────────────────
  {
    title: "Cropped Denim Jacket",
    description: "Boxy cropped denim jacket with a raw hem. Vintage-wash cotton with antique brass hardware for a casual edge.",
    price: { amount: 2299, currency: "INR" },
    images: [{ url: IMGS.jacket[0] }],
    variants: [
      { images: [{ url: IMGS.jacket[0] }], stock: 14, attributes: new Map([["color", "Light Wash"], ["size", "S"]]), price: { amount: 2299, currency: "INR" } },
      { images: [{ url: IMGS.jacket[0] }], stock: 12, attributes: new Map([["color", "Light Wash"], ["size", "M"]]), price: { amount: 2299, currency: "INR" } },
    ],
  },
  {
    title: "Teddy Bear Fleece Jacket",
    description: "Ultra-soft teddy fleece jacket with a snap-button front. Cosy warmth in a plush textured fabric for cold-weather layering.",
    price: { amount: 2599, currency: "INR" },
    images: [{ url: IMGS.jacket[1] }],
    variants: [
      { images: [{ url: IMGS.jacket[1] }], stock: 16, attributes: new Map([["color", "Toffee"], ["size", "S"]]), price: { amount: 2599, currency: "INR" } },
      { images: [{ url: IMGS.jacket[1] }], stock: 12, attributes: new Map([["color", "Toffee"], ["size", "M"]]), price: { amount: 2599, currency: "INR" } },
    ],
  },
  {
    title: "Quilted Puffer Vest",
    description: "Lightweight quilted vest with a stand collar and zip front. Perfect transitional layering piece over hoodies or shirts.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.jacket[2] }],
    variants: [
      { images: [{ url: IMGS.jacket[2] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.jacket[2] }], stock: 14, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },

  // ──── WOMEN: SWEATERS ────────────────────────────────────────────────────
  {
    title: "Oversized V-Neck Pullover",
    description: "Loosely knitted oversized pullover with a deep V-neck. Soft chenille-blend yarn that feels like a warm hug.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.sweater[0] }],
    variants: [
      { images: [{ url: IMGS.sweater[0] }], stock: 20, attributes: new Map([["color", "Dusty Rose"], ["size", "S"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.sweater[0] }], stock: 18, attributes: new Map([["color", "Dusty Rose"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Turtleneck Roll-Neck Sweater",
    description: "Fine-knit roll-neck sweater in soft lambswool. A wardrobe staple that layers beautifully under coats and blazers.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.sweater[2] }],
    variants: [
      { images: [{ url: IMGS.sweater[2] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.sweater[2] }], stock: 15, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.sweater[1] }], stock: 12, attributes: new Map([["color", "Cream"], ["size", "S"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Crop Cardigan with Buttons",
    description: "Cropped cardigan with contrast buttons and ribbed edges. Soft cotton-cashmere blend for lightweight warmth.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.sweater[1] }],
    variants: [
      { images: [{ url: IMGS.sweater[1] }], stock: 22, attributes: new Map([["color", "Lavender"], ["size", "S"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.sweater[1] }], stock: 18, attributes: new Map([["color", "Lavender"], ["size", "M"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },

  // ──── WOMEN: CASUAL WEAR ─────────────────────────────────────────────────
  {
    title: "Cotton Wrap Skirt",
    description: "Adjustable wrap skirt in printed cotton voile. Side-tie closure and a mid-calf hemline for easy resort dressing.",
    price: { amount: 1299, currency: "INR" },
    images: [{ url: IMGS.dress[1] }],
    variants: [
      { images: [{ url: IMGS.dress[1] }], stock: 18, attributes: new Map([["color", "Printed"], ["size", "S"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.dress[1] }], stock: 15, attributes: new Map([["color", "Printed"], ["size", "M"]]), price: { amount: 1299, currency: "INR" } },
    ],
  },
  {
    title: "High-Rise Mom Jeans",
    description: "Relaxed-fit mom jeans with a high rise and tapered ankle. Soft vintage-wash denim with a lived-in feel from the start.",
    price: { amount: 1899, currency: "INR" },
    images: [{ url: IMGS.denim[2] }],
    variants: [
      { images: [{ url: IMGS.denim[2] }], stock: 25, attributes: new Map([["color", "Blue"], ["size", "26"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.denim[2] }], stock: 22, attributes: new Map([["color", "Blue"], ["size", "28"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.denim[3] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "26"]]), price: { amount: 1899, currency: "INR" } },
    ],
  },
  {
    title: "Boxy Pocket T-Shirt",
    description: "Boxy-fit cotton tee with a single chest pocket. Slightly cropped hem for a modern relaxed proportion.",
    price: { amount: 799, currency: "INR" },
    images: [{ url: IMGS.tshirt[0] }],
    variants: [
      { images: [{ url: IMGS.tshirt[0] }], stock: 40, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 799, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[0] }], stock: 35, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 799, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[1] }], stock: 30, attributes: new Map([["color", "Black"], ["size", "S"]]), price: { amount: 799, currency: "INR" } },
    ],
  },
  {
    title: "Linen Wide-Leg Shorts",
    description: "Relaxed wide-leg shorts in pure linen with an elasticated drawstring waist. Effortless summer style.",
    price: { amount: 1099, currency: "INR" },
    images: [{ url: IMGS.trouser[0] }],
    variants: [
      { images: [{ url: IMGS.trouser[0] }], stock: 22, attributes: new Map([["color", "Sand"], ["size", "S"]]), price: { amount: 1099, currency: "INR" } },
      { images: [{ url: IMGS.trouser[0] }], stock: 18, attributes: new Map([["color", "Sand"], ["size", "M"]]), price: { amount: 1099, currency: "INR" } },
    ],
  },

  // ──── UNISEX / ESSENTIALS ────────────────────────────────────────────────
  {
    title: "French Terry Sweatshorts",
    description: "Mid-weight French terry shorts with an elasticated waist and side pockets. Everyday comfort in premium loopback cotton.",
    price: { amount: 999, currency: "INR" },
    images: [{ url: IMGS.trouser[2] }],
    variants: [
      { images: [{ url: IMGS.trouser[2] }], stock: 40, attributes: new Map([["color", "Grey Marle"], ["size", "M"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.trouser[2] }], stock: 35, attributes: new Map([["color", "Grey Marle"], ["size", "L"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.trouser[2] }], stock: 30, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 999, currency: "INR" } },
    ],
  },
  {
    title: "Washed Canvas Bucket Hat",
    description: "Unstructured bucket hat in stonewashed cotton canvas. UPF 50+ sun protection with a chin strap for windy days.",
    price: { amount: 599, currency: "INR" },
    images: [{ url: IMGS.accessory[0] }],
    variants: [
      { images: [{ url: IMGS.accessory[0] }], stock: 50, attributes: new Map([["color", "Khaki"]]), price: { amount: 599, currency: "INR" } },
      { images: [{ url: IMGS.accessory[0] }], stock: 45, attributes: new Map([["color", "Black"]]), price: { amount: 599, currency: "INR" } },
    ],
  },
  {
    title: "Minimal Leather Crossbody Bag",
    description: "Compact crossbody bag in genuine vegetable-tanned leather. Adjustable strap, magnetic closure, and inner card slots.",
    price: { amount: 2999, currency: "INR" },
    images: [{ url: IMGS.accessory[1] }],
    variants: [
      { images: [{ url: IMGS.accessory[1] }], stock: 15, attributes: new Map([["color", "Tan"]]), price: { amount: 2999, currency: "INR" } },
      { images: [{ url: IMGS.accessory[1] }], stock: 12, attributes: new Map([["color", "Black"]]), price: { amount: 2999, currency: "INR" } },
    ],
  },
  {
    title: "Canvas Low-Top Sneakers",
    description: "Clean low-top sneakers in organic canvas with a vulcanised rubber sole. Minimal branding for a timeless look.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.shoes[0] }],
    variants: [
      { images: [{ url: IMGS.shoes[0] }], stock: 25, attributes: new Map([["color", "White"], ["size", "40"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.shoes[0] }], stock: 20, attributes: new Map([["color", "White"], ["size", "42"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.shoes[1] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "40"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Leather Chelsea Boots",
    description: "Pull-on Chelsea boots in smooth full-grain leather with elastic side panels. Goodyear welted sole for durability.",
    price: { amount: 3999, currency: "INR" },
    images: [{ url: IMGS.shoes[2] }],
    variants: [
      { images: [{ url: IMGS.shoes[2] }], stock: 10, attributes: new Map([["color", "Brown"], ["size", "40"]]), price: { amount: 3999, currency: "INR" } },
      { images: [{ url: IMGS.shoes[2] }], stock: 8, attributes: new Map([["color", "Brown"], ["size", "42"]]), price: { amount: 3999, currency: "INR" } },
    ],
  },
  {
    title: "Knit Beanie",
    description: "Ribbed-knit beanie in soft merino wool. Fold-over cuff with a subtle woven label. Cold-weather essential.",
    price: { amount: 499, currency: "INR" },
    images: [{ url: IMGS.accessory[0] }],
    variants: [
      { images: [{ url: IMGS.accessory[0] }], stock: 60, attributes: new Map([["color", "Black"]]), price: { amount: 499, currency: "INR" } },
      { images: [{ url: IMGS.accessory[0] }], stock: 55, attributes: new Map([["color", "Grey"]]), price: { amount: 499, currency: "INR" } },
    ],
  },
  {
    title: "Striped Lounge Set",
    description: "Matching striped long-sleeve top and pant lounge set in brushed cotton. Effortless weekend comfort.",
    price: { amount: 1699, currency: "INR" },
    images: [{ url: IMGS.hoodie[1] }],
    variants: [
      { images: [{ url: IMGS.hoodie[1] }], stock: 20, attributes: new Map([["color", "Cream Stripe"], ["size", "S"]]), price: { amount: 1699, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[1] }], stock: 18, attributes: new Map([["color", "Cream Stripe"], ["size", "M"]]), price: { amount: 1699, currency: "INR" } },
    ],
  },

  // ──── ADDITIONAL MEN ─────────────────────────────────────────────────────
  {
    title: "Textured Waffle Knit Polo",
    description: "Textured waffle-knit polo in mercerized cotton. A contemporary take on the classic polo with a tactile finish.",
    price: { amount: 1299, currency: "INR" },
    images: [{ url: IMGS.shirt[0] }],
    variants: [
      { images: [{ url: IMGS.shirt[0] }], stock: 28, attributes: new Map([["color", "Olive"], ["size", "M"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.shirt[0] }], stock: 22, attributes: new Map([["color", "Olive"], ["size", "L"]]), price: { amount: 1299, currency: "INR" } },
    ],
  },
  {
    title: "Drop Shoulder Casual T-Shirt",
    description: "Relaxed drop-shoulder tee in heavyweight organic cotton. Boxy proportions and a raw hem for an undone, effortless vibe.",
    price: { amount: 899, currency: "INR" },
    images: [{ url: IMGS.tshirt[2] }],
    variants: [
      { images: [{ url: IMGS.tshirt[2] }], stock: 45, attributes: new Map([["color", "Stone"], ["size", "M"]]), price: { amount: 899, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[2] }], stock: 40, attributes: new Map([["color", "Stone"], ["size", "L"]]), price: { amount: 899, currency: "INR" } },
      { images: [{ url: IMGS.tshirt[4] }], stock: 35, attributes: new Map([["color", "Sage"], ["size", "M"]]), price: { amount: 899, currency: "INR" } },
    ],
  },
  {
    title: "Double-Breasted Blazer",
    description: "Tailored double-breasted blazer in structured wool-blend fabric. Peak lapels and a nipped waist for sharp power dressing.",
    price: { amount: 3999, currency: "INR" },
    images: [{ url: IMGS.jacket[3] }],
    variants: [
      { images: [{ url: IMGS.jacket[3] }], stock: 8, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 3999, currency: "INR" } },
      { images: [{ url: IMGS.jacket[3] }], stock: 6, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 3999, currency: "INR" } },
    ],
  },
  {
    title: "Patchwork Denim Jacket",
    description: "Mixed-denim patchwork jacket combining different washes and textures. A statement layering piece with artisan character.",
    price: { amount: 3299, currency: "INR" },
    images: [{ url: IMGS.jacket[0] }],
    variants: [
      { images: [{ url: IMGS.jacket[0] }], stock: 10, attributes: new Map([["color", "Mixed Blue"], ["size", "M"]]), price: { amount: 3299, currency: "INR" } },
      { images: [{ url: IMGS.jacket[0] }], stock: 8, attributes: new Map([["color", "Mixed Blue"], ["size", "L"]]), price: { amount: 3299, currency: "INR" } },
    ],
  },
  {
    title: "Heavyweight Terry Shorts",
    description: "Boxy cut-off shorts in 400gsm loopback terry. Elasticated waist with drawstring and deep side pockets.",
    price: { amount: 899, currency: "INR" },
    images: [{ url: IMGS.trouser[2] }],
    variants: [
      { images: [{ url: IMGS.trouser[2] }], stock: 35, attributes: new Map([["color", "Black"], ["size", "M"]]), price: { amount: 899, currency: "INR" } },
      { images: [{ url: IMGS.trouser[2] }], stock: 30, attributes: new Map([["color", "Black"], ["size", "L"]]), price: { amount: 899, currency: "INR" } },
    ],
  },
  {
    title: "Quilted Liner Jacket",
    description: "Lightweight ripstop liner jacket with diamond quilting. Snap-button front, stand collar — perfect under a heavier coat or on its own.",
    price: { amount: 1899, currency: "INR" },
    images: [{ url: IMGS.jacket[2] }],
    variants: [
      { images: [{ url: IMGS.jacket[2] }], stock: 15, attributes: new Map([["color", "Navy"], ["size", "M"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.jacket[2] }], stock: 12, attributes: new Map([["color", "Navy"], ["size", "L"]]), price: { amount: 1899, currency: "INR" } },
    ],
  },
  {
    title: "Brushed Flannel Shirt",
    description: "Soft brushed-cotton flannel in a classic placket-front design. Cosy brushed interior for autumn and winter layering.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.shirt[3] }],
    variants: [
      { images: [{ url: IMGS.shirt[3] }], stock: 22, attributes: new Map([["color", "Red Plaid"], ["size", "M"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.shirt[3] }], stock: 18, attributes: new Map([["color", "Red Plaid"], ["size", "L"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },
  {
    title: "Stretch Twill Joggers",
    description: "Tailored joggers in stretch twill with a tapered leg. Elasticated cuffs and a clean finish that bridges smart and casual.",
    price: { amount: 1399, currency: "INR" },
    images: [{ url: IMGS.trouser[3] }],
    variants: [
      { images: [{ url: IMGS.trouser[3] }], stock: 28, attributes: new Map([["color", "Olive"], ["size", "M"]]), price: { amount: 1399, currency: "INR" } },
      { images: [{ url: IMGS.trouser[3] }], stock: 24, attributes: new Map([["color", "Olive"], ["size", "L"]]), price: { amount: 1399, currency: "INR" } },
    ],
  },
  {
    title: "Color Block Windbreaker",
    description: "Lightweight nylon windbreaker with color-block paneling. Drawstring hood, elasticated cuffs, and a packable design.",
    price: { amount: 2199, currency: "INR" },
    images: [{ url: IMGS.hoodie[0] }],
    variants: [
      { images: [{ url: IMGS.hoodie[0] }], stock: 14, attributes: new Map([["color", "Blue/White"], ["size", "M"]]), price: { amount: 2199, currency: "INR" } },
      { images: [{ url: IMGS.hoodie[0] }], stock: 10, attributes: new Map([["color", "Blue/White"], ["size", "L"]]), price: { amount: 2199, currency: "INR" } },
    ],
  },
  {
    title: "Merino Wool V-Neck Jumper",
    description: "Fine-gauge merino wool jumper with a V-neck and ribbed hem. Lightweight warmth ideal for layering over shirts.",
    price: { amount: 2699, currency: "INR" },
    images: [{ url: IMGS.sweater[0] }],
    variants: [
      { images: [{ url: IMGS.sweater[0] }], stock: 14, attributes: new Map([["color", "Camel"], ["size", "M"]]), price: { amount: 2699, currency: "INR" } },
      { images: [{ url: IMGS.sweater[0] }], stock: 10, attributes: new Map([["color", "Camel"], ["size", "L"]]), price: { amount: 2699, currency: "INR" } },
    ],
  },

  // ──── ADDITIONAL WOMEN ────────────────────────────────────────────────────
  {
    title: "Ruched Bodycon Midi Dress",
    description: "Figure-flattering midi dress with adjustable side ruching. Stretch jersey fabric that hugs and sculpts.",
    price: { amount: 1699, currency: "INR" },
    images: [{ url: IMGS.dress[0] }],
    variants: [
      { images: [{ url: IMGS.dress[0] }], stock: 18, attributes: new Map([["color", "Burgundy"], ["size", "S"]]), price: { amount: 1699, currency: "INR" } },
      { images: [{ url: IMGS.dress[0] }], stock: 14, attributes: new Map([["color", "Burgundy"], ["size", "M"]]), price: { amount: 1699, currency: "INR" } },
    ],
  },
  {
    title: "Asymmetric Hem Blouse",
    description: "Draped viscose blouse with an asymmetric hemline and subtle pleating. An architectural silhouette for modern dressing.",
    price: { amount: 1399, currency: "INR" },
    images: [{ url: IMGS.coord[1] }],
    variants: [
      { images: [{ url: IMGS.coord[1] }], stock: 20, attributes: new Map([["color", "Ivory"], ["size", "S"]]), price: { amount: 1399, currency: "INR" } },
      { images: [{ url: IMGS.coord[1] }], stock: 16, attributes: new Map([["color", "Ivory"], ["size", "M"]]), price: { amount: 1399, currency: "INR" } },
    ],
  },
  {
    title: "Pleated Tennis Skirt",
    description: "Classic pleated mini skirt in crisp cotton-blend fabric. Flat front with knife-pleat back. Sporty-chic for all occasions.",
    price: { amount: 999, currency: "INR" },
    images: [{ url: IMGS.coord[0] }],
    variants: [
      { images: [{ url: IMGS.coord[0] }], stock: 25, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.coord[0] }], stock: 22, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 999, currency: "INR" } },
      { images: [{ url: IMGS.coord[0] }], stock: 18, attributes: new Map([["color", "Navy"], ["size", "S"]]), price: { amount: 999, currency: "INR" } },
    ],
  },
  {
    title: "Textured Knit Cardigan",
    description: "Boucle-textured cardigan with patch pockets and coconut shell buttons. Relaxed open-front silhouette for layering.",
    price: { amount: 1899, currency: "INR" },
    images: [{ url: IMGS.sweater[1] }],
    variants: [
      { images: [{ url: IMGS.sweater[1] }], stock: 16, attributes: new Map([["color", "Cream"], ["size", "S"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.sweater[1] }], stock: 14, attributes: new Map([["color", "Cream"], ["size", "M"]]), price: { amount: 1899, currency: "INR" } },
    ],
  },
  {
    title: "High-Rise Cargo Jeans",
    description: "Utility cargo pockets on straight-leg denim. High-rise fit in mid-weight stretch cotton for a streetwear-ready look.",
    price: { amount: 2199, currency: "INR" },
    images: [{ url: IMGS.denim[2] }],
    variants: [
      { images: [{ url: IMGS.denim[2] }], stock: 20, attributes: new Map([["color", "Black"], ["size", "26"]]), price: { amount: 2199, currency: "INR" } },
      { images: [{ url: IMGS.denim[2] }], stock: 18, attributes: new Map([["color", "Black"], ["size", "28"]]), price: { amount: 2199, currency: "INR" } },
    ],
  },
  {
    title: "Satin Slip Skirt",
    description: "Bias-cut satin midi skirt with an elasticated waistband. Luxurious drape and a subtle sheen for elevated casual wear.",
    price: { amount: 1199, currency: "INR" },
    images: [{ url: IMGS.dress[2] }],
    variants: [
      { images: [{ url: IMGS.dress[2] }], stock: 22, attributes: new Map([["color", "Champagne"], ["size", "S"]]), price: { amount: 1199, currency: "INR" } },
      { images: [{ url: IMGS.dress[2] }], stock: 18, attributes: new Map([["color", "Champagne"], ["size", "M"]]), price: { amount: 1199, currency: "INR" } },
    ],
  },
  {
    title: "Collared Knit Vest",
    description: "Preppy knit vest with a pointed collar and V-neckline. Fine-gauge cotton in a slim fit for layered styling.",
    price: { amount: 1099, currency: "INR" },
    images: [{ url: IMGS.sweater[3] }],
    variants: [
      { images: [{ url: IMGS.sweater[3] }], stock: 20, attributes: new Map([["color", "Navy"], ["size", "S"]]), price: { amount: 1099, currency: "INR" } },
      { images: [{ url: IMGS.sweater[3] }], stock: 16, attributes: new Map([["color", "Navy"], ["size", "M"]]), price: { amount: 1099, currency: "INR" } },
    ],
  },
  {
    title: "Corduroy A-Line Skirt",
    description: "Wale corduroy A-line mini skirt with a button-front closure. Retro-inspired with a modern high-waist silhouette.",
    price: { amount: 1299, currency: "INR" },
    images: [{ url: IMGS.kurti[1] }],
    variants: [
      { images: [{ url: IMGS.kurti[1] }], stock: 18, attributes: new Map([["color", "Rust"], ["size", "S"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.kurti[1] }], stock: 14, attributes: new Map([["color", "Rust"], ["size", "M"]]), price: { amount: 1299, currency: "INR" } },
    ],
  },
  {
    title: "Cropped Puffer Jacket",
    description: "Cropped puffer with horizontal quilting and a stand collar. Lightweight synthetic fill for warmth without weight.",
    price: { amount: 2599, currency: "INR" },
    images: [{ url: IMGS.jacket[1] }],
    variants: [
      { images: [{ url: IMGS.jacket[1] }], stock: 14, attributes: new Map([["color", "Blush"], ["size", "S"]]), price: { amount: 2599, currency: "INR" } },
      { images: [{ url: IMGS.jacket[1] }], stock: 10, attributes: new Map([["color", "Blush"], ["size", "M"]]), price: { amount: 2599, currency: "INR" } },
    ],
  },
  {
    title: "Draped Wrap Cardigan",
    description: "Asymmetric wrap cardigan in a soft viscose-blend knit. Drapes beautifully as a lightweight outer layer.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: IMGS.sweater[2] }],
    variants: [
      { images: [{ url: IMGS.sweater[2] }], stock: 16, attributes: new Map([["color", "Taupe"], ["size", "S"]]), price: { amount: 1499, currency: "INR" } },
      { images: [{ url: IMGS.sweater[2] }], stock: 12, attributes: new Map([["color", "Taupe"], ["size", "M"]]), price: { amount: 1499, currency: "INR" } },
    ],
  },
  {
    title: "Printed Kaftan Tunic",
    description: "Flowing kaftan tunic in digitally printed georgette. Wide sleeves and a relaxed fit for resort or occasion wear.",
    price: { amount: 1799, currency: "INR" },
    images: [{ url: IMGS.kurti[2] }],
    variants: [
      { images: [{ url: IMGS.kurti[2] }], stock: 12, attributes: new Map([["color", "Multi Print"], ["size", "S"]]), price: { amount: 1799, currency: "INR" } },
      { images: [{ url: IMGS.kurti[2] }], stock: 10, attributes: new Map([["color", "Multi Print"], ["size", "M"]]), price: { amount: 1799, currency: "INR" } },
    ],
  },
  {
    title: "Cotton Palazzo Pants",
    description: "Wide-leg palazzo pants in breathable cotton with a flat front and elasticated back waist. Effortless warm-weather dressing.",
    price: { amount: 1199, currency: "INR" },
    images: [{ url: IMGS.trouser[1] }],
    variants: [
      { images: [{ url: IMGS.trouser[1] }], stock: 24, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 1199, currency: "INR" } },
      { images: [{ url: IMGS.trouser[1] }], stock: 20, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 1199, currency: "INR" } },
    ],
  },
  {
    title: "Sequin Party Top",
    description: "All-over sequin camisole top with a V-neckline and adjustable straps. Light-catching sparkle for evening occasions.",
    price: { amount: 1599, currency: "INR" },
    images: [{ url: IMGS.coord[1] }],
    variants: [
      { images: [{ url: IMGS.coord[1] }], stock: 14, attributes: new Map([["color", "Gold"], ["size", "S"]]), price: { amount: 1599, currency: "INR" } },
      { images: [{ url: IMGS.coord[1] }], stock: 12, attributes: new Map([["color", "Gold"], ["size", "M"]]), price: { amount: 1599, currency: "INR" } },
    ],
  },
  {
    title: "Linen Blend Culottes",
    description: "Wide-leg culottes in a linen-cotton blend. Cropped length with a clean waistband for relaxed sophistication.",
    price: { amount: 1399, currency: "INR" },
    images: [{ url: IMGS.trouser[0] }],
    variants: [
      { images: [{ url: IMGS.trouser[0] }], stock: 18, attributes: new Map([["color", "Linen"], ["size", "S"]]), price: { amount: 1399, currency: "INR" } },
      { images: [{ url: IMGS.trouser[0] }], stock: 14, attributes: new Map([["color", "Linen"], ["size", "M"]]), price: { amount: 1399, currency: "INR" } },
    ],
  },
  {
    title: "Denim Overall Dress",
    description: "Pinafore-style denim overall dress with adjustable straps and a button-front bib. A playful throwback with modern proportions.",
    price: { amount: 1899, currency: "INR" },
    images: [{ url: IMGS.denim[0] }],
    variants: [
      { images: [{ url: IMGS.denim[0] }], stock: 14, attributes: new Map([["color", "Light Wash"], ["size", "S"]]), price: { amount: 1899, currency: "INR" } },
      { images: [{ url: IMGS.denim[0] }], stock: 10, attributes: new Map([["color", "Light Wash"], ["size", "M"]]), price: { amount: 1899, currency: "INR" } },
    ],
  },
  {
    title: "Ribbed Knit Lounge Pants",
    description: "Soft ribbed knit pants with a wide waistband and straight leg. Cosy loungewear that transitions to café casual.",
    price: { amount: 1099, currency: "INR" },
    images: [{ url: IMGS.trouser[2] }],
    variants: [
      { images: [{ url: IMGS.trouser[2] }], stock: 25, attributes: new Map([["color", "Mushroom"], ["size", "S"]]), price: { amount: 1099, currency: "INR" } },
      { images: [{ url: IMGS.trouser[2] }], stock: 22, attributes: new Map([["color", "Mushroom"], ["size", "M"]]), price: { amount: 1099, currency: "INR" } },
    ],
  },
  {
    title: "Boho Embroidered Tunic",
    description: "Relaxed tunic top with hand-embroidered mirror work on the yoke. Cotton voile with tassel tie closures.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: IMGS.kurti[3] }],
    variants: [
      { images: [{ url: IMGS.kurti[3] }], stock: 16, attributes: new Map([["color", "White"], ["size", "S"]]), price: { amount: 1499, currency: "INR" } },
      { images: [{ url: IMGS.kurti[3] }], stock: 12, attributes: new Map([["color", "White"], ["size", "M"]]), price: { amount: 1499, currency: "INR" } },
    ],
  },
  {
    title: "Structured Leather Belt Bag",
    description: "Convertible belt bag in structured vegan leather with an adjustable strap. Wear at the waist or crossbody for hands-free convenience.",
    price: { amount: 1999, currency: "INR" },
    images: [{ url: IMGS.accessory[1] }],
    variants: [
      { images: [{ url: IMGS.accessory[1] }], stock: 20, attributes: new Map([["color", "Black"]]), price: { amount: 1999, currency: "INR" } },
      { images: [{ url: IMGS.accessory[1] }], stock: 16, attributes: new Map([["color", "Tan"]]), price: { amount: 1999, currency: "INR" } },
    ],
  },
  {
    title: "Woven Raffia Tote",
    description: "Handwoven raffia tote bag with leather-look handles and an interior zip pocket. The perfect beach or market companion.",
    price: { amount: 1499, currency: "INR" },
    images: [{ url: IMGS.accessory[0] }],
    variants: [
      { images: [{ url: IMGS.accessory[0] }], stock: 18, attributes: new Map([["color", "Natural"]]), price: { amount: 1499, currency: "INR" } },
    ],
  },
  {
    title: "Platform Chunky Sneakers",
    description: "Retro-inspired platform sneakers with a chunky rubber sole. Mesh and synthetic upper for breathability and bold street style.",
    price: { amount: 2299, currency: "INR" },
    images: [{ url: IMGS.shoes[0] }],
    variants: [
      { images: [{ url: IMGS.shoes[0] }], stock: 18, attributes: new Map([["color", "White"], ["size", "37"]]), price: { amount: 2299, currency: "INR" } },
      { images: [{ url: IMGS.shoes[0] }], stock: 14, attributes: new Map([["color", "White"], ["size", "39"]]), price: { amount: 2299, currency: "INR" } },
    ],
  },
  {
    title: "Quilted Slip-On Mules",
    description: "Padded quilted mules in vegan leather with a cushioned insole. Effortless slip-on style for weekend errands.",
    price: { amount: 1299, currency: "INR" },
    images: [{ url: IMGS.shoes[1] }],
    variants: [
      { images: [{ url: IMGS.shoes[1] }], stock: 20, attributes: new Map([["color", "Black"], ["size", "37"]]), price: { amount: 1299, currency: "INR" } },
      { images: [{ url: IMGS.shoes[1] }], stock: 16, attributes: new Map([["color", "Black"], ["size", "39"]]), price: { amount: 1299, currency: "INR" } },
    ],
  },
];

// ─── Seed Function ──────────────────────────────────────────────────────────

async function seed() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected.\n");

  // Verify the database
  const productCount = await Product.countDocuments();
  console.log(`📦 Existing products in database: ${productCount}`);

  // Find an existing seller
  const seller = await User.findById(SELLER_ID);
  if (!seller) {
    console.error("❌ Seller user not found. Aborting.");
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`👤 Using seller: ${seller.fullname} (${seller.email})\n`);

  // Check which products already exist (by title)
  const existingTitles = new Set(
    (await Product.find().select("title")).map((p) => p.title)
  );
  console.log(`📋 Already existing titles: ${existingTitles.size}`);

  // Filter out duplicates
  const newProducts = products.filter((p) => !existingTitles.has(p.title));
  const skipped = products.length - newProducts.length;

  if (skipped > 0) {
    console.log(`⏭️  Skipping ${skipped} products (already exist)`);
  }

  if (newProducts.length === 0) {
    console.log("\n✅ All products already seeded. Nothing to do.");
    await mongoose.disconnect();
    return;
  }

  console.log(`\n🌱 Seeding ${newProducts.length} new products...\n`);

  // Insert in batches for safety
  const BATCH_SIZE = 20;
  let inserted = 0;

  for (let i = 0; i < newProducts.length; i += BATCH_SIZE) {
    const batch = newProducts.slice(i, i + BATCH_SIZE).map((p) => ({
      ...p,
      seller: seller._id,
    }));

    try {
      await Product.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`   ✅ Inserted ${inserted}/${newProducts.length}`);
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key — some products in batch already exist
        const inserted_count = err.insertedDocs?.length || 0;
        inserted += inserted_count;
        console.log(
          `   ⚠️  Batch had duplicates. Inserted ${inserted_count} of ${batch.length}. Total: ${inserted}/${newProducts.length}`
        );
      } else {
        console.error(`   ❌ Batch error:`, err.message);
      }
    }
  }

  const finalCount = await Product.countDocuments();
  console.log(`\n🎉 Done!`);
  console.log(`   Products inserted: ${inserted}`);
  console.log(`   Total products in DB: ${finalCount}`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("💥 Seed failed:", err);
  process.exit(1);
});
