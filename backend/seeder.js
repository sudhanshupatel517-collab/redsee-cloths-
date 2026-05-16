const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/redsee');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@redsee.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Staff Member',
        email: 'staff@redsee.com',
        password: adminPassword,
        role: 'coadmin',
      },
      {
        name: 'Regular Customer',
        email: 'user@redsee.com',
        password: adminPassword,
        role: 'user',
      }
    ];

    await User.insertMany(users);

    const dummyProducts = [
      {
        title: 'Redsee Signature Oversized Hoodie',
        description: 'Premium dark red oversized hoodie with custom glassmorphism inspired prints. Luxury streetwear essential.',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000'],
        price: 89.99,
        discountedPrice: 75.00,
        category: 'Hoodies',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Dark Red', 'Black'],
        stock: 50,
        ratings: 4.8,
        numReviews: 12
      },
      {
        title: 'Cyberpunk Aesthetic Sneakers',
        description: 'Black and red futuristic sneakers designed for comfort and urban exploration.',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000'],
        price: 120.00,
        category: 'Sneakers',
        sizes: ['8', '9', '10', '11'],
        colors: ['Black/Red'],
        stock: 20,
        ratings: 4.9,
        numReviews: 24
      },
      {
        title: 'Midnight Stealth Cargo Pants',
        description: 'Utility meets luxury. Multi-pocket design with a sleek dark aesthetic.',
        images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000'],
        price: 65.00,
        category: 'Men',
        sizes: ['28', '30', '32', '34'],
        colors: ['Black'],
        stock: 100,
        ratings: 4.5,
        numReviews: 8
      }
    ];

    await Product.insertMany(dummyProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
