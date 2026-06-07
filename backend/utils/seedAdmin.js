const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'himanshu4admin9@redsee.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('6Meow#ghop#ghop9', salt);
            
            await User.create({
                name: 'Himanshu Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                hasPassword: true,
                isVerified: true
            });
            console.log('Super Admin account seeded successfully.');
        }

        const coadminEmail = 'sudhanshu4coadmin9@redsee.com';
        const existingCoadmin = await User.findOne({ email: coadminEmail });

        if (!existingCoadmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('6Yele9Password#', salt);
            
            await User.create({
                name: 'Sudhanshu Staff',
                email: coadminEmail,
                password: hashedPassword,
                role: 'coadmin',
                hasPassword: true,
                isVerified: true,
                permissions: ['manage_products', 'manage_orders', 'manage_support', 'manage_categories', 'manage_banners', 'manage_events', 'manage_discounts', 'manage_inventory', 'manage_studio']
            });
            console.log('Initial Coadmin account seeded successfully.');
        } else {
            if (!existingCoadmin.permissions.includes('manage_studio')) {
                existingCoadmin.permissions.push('manage_studio');
                await existingCoadmin.save();
                console.log('Updated existing co-admin permissions with manage_studio.');
            }
        }

        // Seed default categories
        const Category = require('../models/Category');
        const defaultCategories = [
            { name: 'Oversized', slug: 'oversized', imageUrl: '/overts.png', order: 1, isActive: true },
            { name: 'Hoodies', slug: 'hoodies', imageUrl: '/hoodie.png', order: 2, isActive: true },
            { name: 'Cargo', slug: 'cargo', imageUrl: '/cargo.png', order: 3, isActive: true },
            { name: 'Lower', slug: 'lower', imageUrl: '/lower.png', order: 4, isActive: true },
            { name: 'Shirts', slug: 'shirts', imageUrl: '/shirt.png', order: 5, isActive: true },
            { name: 'Jackets', slug: 'jacket', imageUrl: '/jacket.png', order: 6, isActive: true },
        ];

        for (const cat of defaultCategories) {
            try {
                const exists = await Category.findOne({ $or: [{ slug: cat.slug }, { name: cat.name }] });
                if (!exists) {
                    await Category.create(cat);
                    console.log(`Seeded category: ${cat.name}`);
                }
            } catch (catErr) {
                console.warn(`Category seeding skipped for ${cat.name}:`, catErr.message);
            }
        }

        // Seed default lookbook items
        const Lookbook = require('../models/Lookbook');
        const lookbookCount = await Lookbook.countDocuments();
        if (lookbookCount === 0) {
            const defaultLookbook = [
                {
                    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
                    chapter: "CHAPTER 01",
                    title: "THE VOID",
                    span: "col-span-2 row-span-2 md:h-[450px]",
                    order: 1,
                    isActive: true
                },
                {
                    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
                    chapter: "CHAPTER 02",
                    title: "EARTH BOUND",
                    span: "col-span-1 row-span-1 md:h-[217px]",
                    order: 2,
                    isActive: true
                },
                {
                    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
                    chapter: "CHAPTER 03",
                    title: "SHIMMER",
                    span: "col-span-1 row-span-1 md:h-[217px]",
                    order: 3,
                    isActive: true
                },
                {
                    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
                    chapter: "CHAPTER 04",
                    title: "ELECTRIC BLUE",
                    span: "col-span-1 row-span-1 md:h-[217px]",
                    order: 4,
                    isActive: true
                },
                {
                    imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
                    chapter: "CHAPTER 05",
                    title: "WATCHMAN",
                    span: "col-span-1 row-span-1 md:h-[217px]",
                    order: 5,
                    isActive: true
                }
            ];
            await Lookbook.insertMany(defaultLookbook);
            console.log('Seeded default Redsee Studios Lookbook chapters.');
        }

    } catch (error) {
        console.error('Error seeding admin/categories:', error);
    }
};

module.exports = seedAdmin;
