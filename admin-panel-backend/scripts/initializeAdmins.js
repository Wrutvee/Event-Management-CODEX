require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const InviteCode = require('../models/InviteCode');

async function createSuperAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Create invite code
        const inviteCode = new InviteCode({
            code: "ADMIN1234",
            expiresAt: new Date(Date.now() + (4 * 60 * 60 * 1000)),
            roleAssigned: "superadmin"
        });
        await inviteCode.save();

        // // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash("password123", salt);

        // // Create admin
        // const admin = new Admin({
        //     email: "superadmin@example.com",
        //     password: hashedPassword,
        //     role: "superadmin",
        //     inviteCodes: [inviteCode._id]
        // });
        // await admin.save();

        // // Update invite code
        // inviteCode.createdBy = admin._id;
        // inviteCode.used = true;
        // inviteCode.usedBy = admin._id;
        // await inviteCode.save();

        // console.log('Superadmin created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createSuperAdmin();