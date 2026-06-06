const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const generateSlug = (name) => name.toLowerCase().replace(/[\s_]/g, '-').replace(/[^\w-]+/g, '');

const products = [
  // CATEGORY 1: Men's Oversized Tees
  {
    name: "Redsee Signature Oversized Tee - Onyx Black",
    slug: generateSlug("Redsee Signature Oversized Tee - Onyx Black"),
    description: "Premium heavy-weight cotton oversized t-shirt. Features a minimalist Redsee logo across the chest with a seamless drop-shoulder design. Perfect for a luxury streetwear aesthetic.",
    category: "Men's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1299, discountPercentage: 23, finalPrice: 999 },
    variants: [
      { size: "M", color: "Onyx Black", stock: 15 },
      { size: "L", color: "Onyx Black", stock: 20 },
      { size: "XL", color: "Onyx Black", stock: 15 }
    ],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["oversized", "tee", "black", "signature"],
    featured: true,
    published: true
  },
  {
    name: "Cyberpunk Edition Drop-Shoulder Tee",
    slug: generateSlug("Cyberpunk Edition Drop-Shoulder Tee"),
    description: "Futuristic matte black tee with subtle reflective red accents. Designed for ultimate breathability and an imposing silhouette.",
    category: "Men's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1499, discountPercentage: 20, finalPrice: 1199 },
    variants: [
      { size: "M", color: "Matte Black", stock: 10 },
      { size: "L", color: "Matte Black", stock: 15 },
      { size: "XL", color: "Matte Black", stock: 5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["cyberpunk", "drop-shoulder", "tee", "matte"],
    featured: false,
    published: true
  },
  {
    name: "Crimson Ghost Graphic Oversized Tee",
    slug: generateSlug("Crimson Ghost Graphic Oversized Tee"),
    description: "A dark luxury aesthetic featuring an abstract blood-red graphic on the back. Crafted from 240 GSM French Terry cotton.",
    category: "Men's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1599, discountPercentage: 18, finalPrice: 1299 },
    variants: [
      { size: "S", color: "Ghost White", stock: 10 },
      { size: "M", color: "Ghost White", stock: 15 },
      { size: "L", color: "Onyx Black", stock: 20 }
    ],
    images: [
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["crimson", "graphic", "tee", "oversized"],
    featured: false,
    published: true
  },
  {
    name: "Minimalist Essential Boxy Tee",
    slug: generateSlug("Minimalist Essential Boxy Tee"),
    description: "The core Redsee boxy fit. Wide body, cropped length, and structured collar for a high-end fashion profile.",
    category: "Men's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1199, discountPercentage: 25, finalPrice: 899 },
    variants: [
      { size: "S", color: "Charcoal Grey", stock: 20 },
      { size: "M", color: "Charcoal Grey", stock: 20 },
      { size: "L", color: "Pure White", stock: 20 }
    ],
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["minimalist", "essential", "boxy", "tee"],
    featured: false,
    published: true
  },
  {
    name: "Acid Wash Vintage Street Tee",
    slug: generateSlug("Acid Wash Vintage Street Tee"),
    description: "A heavily washed, distressed oversized tee giving a post-apocalyptic, rugged fashion vibe. Softened for extreme comfort.",
    category: "Men's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1799, discountPercentage: 16, finalPrice: 1499 },
    variants: [
      { size: "M", color: "Acid Grey", stock: 10 },
      { size: "L", color: "Acid Grey", stock: 10 },
      { size: "XL", color: "Acid Grey", stock: 5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["acid-wash", "vintage", "street", "tee"],
    featured: false,
    published: true
  },

  // CATEGORY 2: Men's Hoodies
  {
    name: "Redsee Velvet-Lined Heavyweight Hoodie",
    slug: generateSlug("Redsee Velvet-Lined Heavyweight Hoodie"),
    description: "A 400 GSM luxury hoodie. Velvet-lined interior with a matte black exterior and deep red silicone logo emblem.",
    category: "Men's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 2999, discountPercentage: 16, finalPrice: 2499 },
    variants: [
      { size: "M", color: "Onyx Black", stock: 15 },
      { size: "L", color: "Onyx Black", stock: 15 },
      { size: "XL", color: "Onyx Black", stock: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["velvet", "heavyweight", "hoodie", "black"],
    featured: true,
    published: true
  },
  {
    name: "Phantom Cropped Zip-Up Hoodie",
    slug: generateSlug("Phantom Cropped Zip-Up Hoodie"),
    description: "A modern cropped silhouette with a metallic dual-zipper. Engineered for layering over oversized tees.",
    category: "Men's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 2799, discountPercentage: 21, finalPrice: 2199 },
    variants: [
      { size: "S", color: "Charcoal", stock: 10 },
      { size: "M", color: "Charcoal", stock: 15 },
      { size: "L", color: "Crimson", stock: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["phantom", "cropped", "zip-up", "hoodie"],
    featured: false,
    published: true
  },
  {
    name: "Techwear Tactical Pullover Hoodie",
    slug: generateSlug("Techwear Tactical Pullover Hoodie"),
    description: "Features hidden zipper pockets, water-resistant paneling, and an articulated hood for a stealthy urban look.",
    category: "Men's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 3499, discountPercentage: 14, finalPrice: 2999 },
    variants: [
      { size: "M", color: "Matte Black", stock: 5 },
      { size: "L", color: "Matte Black", stock: 10 },
      { size: "XL", color: "Matte Black", stock: 5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["techwear", "tactical", "pullover", "hoodie"],
    featured: false,
    published: true
  },
  {
    name: "The 'Bloodline' Heavy Knit Hoodie",
    slug: generateSlug("The 'Bloodline' Heavy Knit Hoodie"),
    description: "Intricate heavy knit construction with subtle red thread woven into a dark grey base. Ultimate winter luxury.",
    category: "Men's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 3999, discountPercentage: 20, finalPrice: 3199 },
    variants: [
      { size: "L", color: "Bloodline Grey", stock: 5 },
      { size: "XL", color: "Bloodline Grey", stock: 5 },
      { size: "XXL", color: "Bloodline Grey", stock: 5 }
    ],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["bloodline", "knit", "hoodie", "luxury"],
    featured: true,
    published: true
  },
  {
    name: "Essential Drop-Shoulder Lounge Hoodie",
    slug: generateSlug("Essential Drop-Shoulder Lounge Hoodie"),
    description: "Designed for supreme comfort without compromising the sharp, angular aesthetic of Redsee's dark fashion.",
    category: "Men's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 2499, discountPercentage: 20, finalPrice: 1999 },
    variants: [
      { size: "S", color: "Onyx Black", stock: 15 },
      { size: "M", color: "Pure White", stock: 20 },
      { size: "L", color: "Onyx Black", stock: 20 }
    ],
    images: [
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["essential", "lounge", "hoodie", "drop-shoulder"],
    featured: false,
    published: true
  },

  // CATEGORY 3: Men's Streetwear Jackets
  {
    name: "Redsee X-1 Varsity Bomber Jacket",
    slug: generateSlug("Redsee X-1 Varsity Bomber Jacket"),
    description: "A stunning vegan leather bomber jacket with deep red embroidery. Cinched waist and extreme drop shoulders.",
    category: "Men's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 5999, discountPercentage: 16, finalPrice: 4999 },
    variants: [
      { size: "M", color: "Onyx Black / Crimson", stock: 5 },
      { size: "L", color: "Onyx Black / Crimson", stock: 3 },
      { size: "XL", color: "Onyx Black / Crimson", stock: 2 }
    ],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["varsity", "bomber", "jacket", "leather"],
    featured: true,
    published: true
  },
  {
    name: "Neo-Tokyo Denim Jacket",
    slug: generateSlug("Neo-Tokyo Denim Jacket"),
    description: "Over-dyed black denim with distressed edges and metallic gunmetal hardware. Built for the modern renegade.",
    category: "Men's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 4599, discountPercentage: 15, finalPrice: 3899 },
    variants: [
      { size: "S", color: "Washed Black", stock: 5 },
      { size: "M", color: "Washed Black", stock: 10 },
      { size: "L", color: "Washed Black", stock: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["denim", "jacket", "neo-tokyo", "washed"],
    featured: false,
    published: true
  },
  {
    name: "Stealth Puffer Utility Jacket",
    slug: generateSlug("Stealth Puffer Utility Jacket"),
    description: "Matte-finish lightweight puffer. Completely windproof and water-resistant, featuring an aggressively tall collar.",
    category: "Men's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 5499, discountPercentage: 21, finalPrice: 4299 },
    variants: [
      { size: "M", color: "Matte Black", stock: 10 },
      { size: "L", color: "Matte Black", stock: 10 },
      { size: "XL", color: "Matte Black", stock: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1545042746-ec9e5a59ea0b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["puffer", "utility", "jacket", "stealth"],
    featured: false,
    published: true
  },
  {
    name: "Vanguard Windbreaker Shell",
    slug: generateSlug("Vanguard Windbreaker Shell"),
    description: "An ultra-light, semi-translucent dark shell jacket. Features reflective Redsee logos that glow blood-red under flash.",
    category: "Men's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 3299, discountPercentage: 18, finalPrice: 2699 },
    variants: [
      { size: "S", color: "Translucent Black", stock: 15 },
      { size: "M", color: "Translucent Black", stock: 15 },
      { size: "L", color: "Translucent Black", stock: 15 }
    ],
    images: [
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["windbreaker", "shell", "jacket", "reflective"],
    featured: false,
    published: true
  },
  {
    name: "The 'Enforcer' Trench Coat",
    slug: generateSlug("The 'Enforcer' Trench Coat"),
    description: "A cinematic, floor-sweeping dark fashion trench coat. Structured shoulders with a fluid, elegant drape.",
    category: "Men's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 7999, discountPercentage: 18, finalPrice: 6499 },
    variants: [
      { size: "M", color: "Onyx Black", stock: 4 },
      { size: "L", color: "Onyx Black", stock: 4 },
      { size: "XL", color: "Onyx Black", stock: 4 }
    ],
    images: [
      "https://images.unsplash.com/photo-1545042746-ec9e5a59ea0b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["trench", "coat", "enforcer", "dark"],
    featured: true,
    published: true
  },
  // CATEGORY 4: Women's Oversized Tees & Crop Tops
  {
    name: "Redsee Women's Signature Crop Tee - Crimson Red",
    slug: generateSlug("Redsee Women's Signature Crop Tee - Crimson Red"),
    description: "Premium heavy-weight crop tee featuring a minimalist red logo on luxury black cotton. Designed for a high-end streetwear silhouette.",
    category: "Women's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1199, discountPercentage: 20, finalPrice: 959 },
    variants: [
      { size: "S", color: "Onyx Black", stock: 15 },
      { size: "M", color: "Onyx Black", stock: 20 },
      { size: "L", color: "Onyx Black", stock: 15 }
    ],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "crop-top", "signature", "crimson"],
    featured: true,
    published: true
  },
  {
    name: "Cyberpunk Techwear Women's Tee",
    slug: generateSlug("Cyberpunk Techwear Women's Tee"),
    description: "Futuristic dark aesthetics crop tee with reflective red design. Crafted from highly breathable micro-poly cotton.",
    category: "Women's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1399, discountPercentage: 15, finalPrice: 1189 },
    variants: [
      { size: "S", color: "Matte Black", stock: 10 },
      { size: "M", color: "Matte Black", stock: 12 },
      { size: "L", color: "Matte Black", stock: 8 }
    ],
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "cyberpunk", "techwear", "black"],
    featured: false,
    published: true
  },
  {
    name: "Acid Wash Distressed Crop Tee",
    slug: generateSlug("Acid Wash Distressed Crop Tee"),
    description: "Distressed vintage-look washed crop tee. Features frayed hem details and pre-shrunk heavyweight cotton construction.",
    category: "Women's Oversized Tees",
    brand: "Redsee",
    pricing: { originalPrice: 1299, discountPercentage: 18, finalPrice: 1065 },
    variants: [
      { size: "S", color: "Acid Grey", stock: 15 },
      { size: "M", color: "Acid Grey", stock: 15 }
    ],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "acid-wash", "vintage", "distressed"],
    featured: false,
    published: true
  },

  // CATEGORY 5: Women's Hoodies
  {
    name: "Redsee Velvet-Lined Women's Heavy Hoodie",
    slug: generateSlug("Redsee Velvet-Lined Women's Heavy Hoodie"),
    description: "400 GSM luxury cropped hoodie. Features a velvet-lined hood interior and deep red glossy emblem embroidery.",
    category: "Women's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 2899, discountPercentage: 20, finalPrice: 2319 },
    variants: [
      { size: "S", color: "Onyx Black", stock: 15 },
      { size: "M", color: "Onyx Black", stock: 15 },
      { size: "L", color: "Onyx Black", stock: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "hoodie", "velvet", "heavyweight"],
    featured: true,
    published: true
  },
  {
    name: "Phantom Cropped Zip-Up Women's Hoodie",
    slug: generateSlug("Phantom Cropped Zip-Up Women's Hoodie"),
    description: "A cropped zip-up hoodie featuring dual gunmetal zippers and raw edge details. Perfect for urban cyberpunk layering.",
    category: "Women's Hoodies",
    brand: "Redsee",
    pricing: { originalPrice: 2599, discountPercentage: 15, finalPrice: 2209 },
    variants: [
      { size: "S", color: "Charcoal", stock: 10 },
      { size: "M", color: "Charcoal", stock: 15 }
    ],
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "hoodie", "zip-up", "cropped"],
    featured: false,
    published: true
  },

  // CATEGORY 6: Women's Jackets
  {
    name: "Redsee X-1 Varsity Bomber Jacket - Women's Edition",
    slug: generateSlug("Redsee X-1 Varsity Bomber Jacket - Women's Edition"),
    description: "A tailored-fit luxury varsity bomber jacket. Crafted from high-grade vegan leather and featuring crimson embroidery details.",
    category: "Women's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 5799, discountPercentage: 15, finalPrice: 4929 },
    variants: [
      { size: "S", color: "Onyx Black / Crimson", stock: 5 },
      { size: "M", color: "Onyx Black / Crimson", stock: 5 },
      { size: "L", color: "Onyx Black / Crimson", stock: 3 }
    ],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "bomber", "varsity", "leather"],
    featured: true,
    published: true
  },
  {
    name: "Stealth Women's Puffer Jacket",
    slug: generateSlug("Stealth Women's Puffer Jacket"),
    description: "Lightweight windproof crop puffer jacket with thermal insulation and water-resistant finish.",
    category: "Women's Streetwear Jackets",
    brand: "Redsee",
    pricing: { originalPrice: 5299, discountPercentage: 20, finalPrice: 4239 },
    variants: [
      { size: "S", color: "Matte Black", stock: 10 },
      { size: "M", color: "Matte Black", stock: 10 }
    ],
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
    ],
    tags: ["women", "puffer", "jacket", "stealth"],
    featured: false,
    published: true
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Clearing old schema products...');
    await Product.deleteMany();

    console.log('Inserting new variant-based products...');
    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} products to Redsee!`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();
