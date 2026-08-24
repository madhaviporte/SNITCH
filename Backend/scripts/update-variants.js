/**
 * Variant Update Script for Snitch Products
 *
 * Usage:
 *   cd Backend && node scripts/update-variants.js
 *
 * What it does:
 *   - Reads all products from the database
 *   - For each product, determines appropriate colors and sizes based on product type
 *   - Replaces the variants array with comprehensive color × size combinations
 *   - Preserves existing product images for each variant
 *   - Preserves base product price
 *   - Assigns realistic stock quantities
 *
 * Safe to run multiple times (idempotent).
 * Does NOT affect production — reads the same .env as the dev server.
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

// ─── Schemas ────────────────────────────────────────────────────────────────

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

// ─── Variant Definitions ────────────────────────────────────────────────────
// Maps product title keywords → { colors, sizes, stockRange }

function classifyProduct(title) {
  const t = title.toLowerCase();

  // ── Shoes ──
  if (t.includes("sneaker") || t.includes("shoe") || t.includes("boot") || t.includes("mule")) {
    return {
      colors: ["Black", "White", "Brown"],
      sizes: ["38", "40", "42", "44"],
    };
  }

  // ── Jeans / Denim ──
  if (t.includes("jean") || t.includes("denim")) {
    return {
      colors: ["Indigo", "Light Blue", "Black", "Grey"],
      sizes: ["28", "30", "32", "34", "36"],
    };
  }

  // ── Trousers / Pants / Chinos / Joggers / Cargo / Palazzo / Culottes ──
  if (
    t.includes("trouser") || t.includes("pant") || t.includes("chino") ||
    t.includes("jogger") || t.includes("cargo") || t.includes("palazzo") ||
    t.includes("culotte") || t.includes("wide leg") || t.includes("wide-leg") ||
    t.includes("jogger") || t.includes("shorts") || t.includes("lounge pant")
  ) {
    return {
      colors: ["Black", "Khaki", "Navy", "Olive", "Grey", "Beige"],
      sizes: ["XS", "S", "M", "L", "XL"],
    };
  }

  // ── Hoodies / Sweatshirts / Crewneck / Pullover ──
  if (
    t.includes("hoodie") || t.includes("sweatshirt") || t.includes("crewneck") ||
    t.includes("pullover") || t.includes("half-zip") || t.includes("terry") ||
    t.includes("track jacket") || t.includes("windbreaker")
  ) {
    return {
      colors: ["Black", "Grey", "Navy", "White", "Olive", "Sand", "Cream"],
      sizes: ["S", "M", "L", "XL", "XXL"],
    };
  }

  // ── Jackets / Coats / Blazers / Overcoat ──
  if (
    t.includes("jacket") || t.includes("coat") || t.includes("blazer") ||
    t.includes("overcoat") || t.includes("puffer") || t.includes("bomber") ||
    t.includes("quilted") || t.includes("liner") || t.includes("teddy")
  ) {
    return {
      colors: ["Black", "Navy", "Brown", "Grey", "Olive", "Camel"],
      sizes: ["S", "M", "L", "XL"],
    };
  }

  // ── Sweaters / Knitwear / Cardigan / Jumper / Vest ──
  if (
    t.includes("sweater") || t.includes("knit") || t.includes("cardigan") ||
    t.includes("jumper") || t.includes("cable") || t.includes("mock neck") ||
    t.includes("roll-neck") || t.includes("turtleneck") || t.includes("boucle") ||
    (t.includes("vest") && !t.includes("puffer"))
  ) {
    return {
      colors: ["Black", "Cream", "Grey", "Navy", "Camel", "Oatmeal", "Burgundy"],
      sizes: ["S", "M", "L", "XL"],
    };
  }

  // ── Dresses ──
  if (t.includes("dress") || t.includes("slip dress") || t.includes("midi dress") || t.includes("maxi dress")) {
    return {
      colors: ["Black", "White", "Navy", "Pink", "Red", "Blue", "Green", "Cream"],
      sizes: ["XS", "S", "M", "L", "XL"],
    };
  }

  // ── Kurtis / Ethnic / Anarkali / Tunic / Kaftan ──
  if (
    t.includes("kurti") || t.includes("anarkali") || t.includes("tunic") ||
    t.includes("kaftan") || t.includes("ethnic")
  ) {
    return {
      colors: ["White", "Navy", "Teal", "Maroon", "Mustard", "Rust", "Green", "Black"],
      sizes: ["S", "M", "L", "XL", "XXL"],
    };
  }

  // ── Skirts ──
  if (t.includes("skirt")) {
    return {
      colors: ["Black", "White", "Navy", "Beige", "Rust"],
      sizes: ["XS", "S", "M", "L"],
    };
  }

  // ── Shirts (men's) ──
  if (
    t.includes("shirt") && !t.includes("t-shirt") && !t.includes("tee") &&
    !t.includes("polo")
  ) {
    return {
      colors: ["White", "Blue", "Black", "Pink", "Green", "Cream", "Striped"],
      sizes: ["S", "M", "L", "XL", "XXL"],
    };
  }

  // ── Polo shirts ──
  if (t.includes("polo")) {
    return {
      colors: ["White", "Navy", "Black", "Green", "Grey"],
      sizes: ["S", "M", "L", "XL", "XXL"],
    };
  }

  // ── T-shirts / Tees / Henley / Tank / Camisole / Blouse / Top ──
  if (
    t.includes("t-shirt") || t.includes("tee") || t.includes("henley") ||
    t.includes("tank") || t.includes("camisole") || t.includes("blouse") ||
    t.includes("top") || t.includes("crop") || t.includes("puff sleeve") ||
    t.includes("wrap-front") || t.includes("mock neck tank") || t.includes("ribbed") ||
    t.includes("waffle")
  ) {
    return {
      colors: ["Black", "White", "Grey", "Navy", "Beige", "Cream", "Olive", "Pink"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    };
  }

  // ── Co-ord sets ──
  if (t.includes("coord") || t.includes("co-ord") || t.includes("set") || t.includes("two-piece") || t.includes("lounge set")) {
    return {
      colors: ["Black", "Beige", "Cream", "Navy", "White", "Grey"],
      sizes: ["XS", "S", "M", "L", "XL"],
    };
  }

  // ── Accessories / Bags / Hats ──
  if (
    t.includes("bag") || t.includes("hat") || t.includes("beanie") ||
    t.includes("bucket") || t.includes("belt") || t.includes("tote") ||
    t.includes("crossbody") || t.includes("mules")
  ) {
    return {
      colors: ["Black", "Brown", "Tan", "White", "Grey", "Natural"],
      sizes: ["Free Size"],
    };
  }

  // ── Default fallback ──
  return {
    colors: ["Black", "White", "Grey", "Navy", "Beige"],
    sizes: ["S", "M", "L", "XL"],
  };
}

function randomStock(min = 8, max = 50) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function updateVariants() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected.\n");

  const products = await Product.find();
  console.log(`📦 Found ${products.length} products.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const { colors, sizes } = classifyProduct(product.title);

    // Use product's existing images (fall back to first image for all variants)
    const productImages = product.images && product.images.length > 0
      ? product.images
      : [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop" }];

    // Generate all color × size combinations
    const newVariants = [];
    for (const color of colors) {
      for (const size of sizes) {
        newVariants.push({
          images: productImages.map(img => ({ url: img.url })),
          stock: randomStock(8, 45),
          attributes: new Map([["color", color], ["size", size]]),
          price: {
            amount: product.price.amount,
            currency: product.price.currency || "INR",
          },
        });
      }
    }

    // Check if product already has comprehensive variants
    const existingColors = new Set();
    const existingSizes = new Set();
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        const attrs = v.attributes instanceof Map ? v.attributes : new Map(Object.entries(v.attributes || {}));
        if (attrs.get("color")) existingColors.add(attrs.get("color"));
        if (attrs.get("size")) existingSizes.add(attrs.get("size"));
      });
    }

    const hasAllColors = colors.every(c => existingColors.has(c));
    const hasAllSizes = sizes.every(s => existingSizes.has(s));
    const expectedCount = colors.length * sizes.length;

    if (hasAllColors && hasAllSizes && product.variants.length >= expectedCount) {
      skipped++;
      continue;
    }

    // Update the product
    product.variants = newVariants;
    await product.save();
    updated++;

    console.log(
      `  ✅ ${product.title} → ${colors.length} colors × ${sizes.length} sizes = ${newVariants.length} variants`
    );
  }

  console.log(`\n🎉 Done!`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (already complete): ${skipped}`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
}

updateVariants().catch((err) => {
  console.error("💥 Update failed:", err);
  process.exit(1);
});
