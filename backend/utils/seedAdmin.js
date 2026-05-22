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
                permissions: ['manage_products', 'manage_orders', 'manage_support']
            });
            console.log('Initial Coadmin account seeded successfully.');
        }

    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

module.exports = seedAdmin;
