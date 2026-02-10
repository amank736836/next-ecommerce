
import mongoose from "mongoose";
import { User } from "./src/models/user";
import { Product } from "./src/models/product";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB,
        });

        // 1. Make User Admin
        const userId = "C3ODnFNCqnWsS2Jx9SgNAJGcdc32";
        const user = await User.findById(userId);
        if (user) {
            user.role = "admin";
            await user.save();
            console.log(`SUCCESS: User ${user.name} (${userId}) is now an ADMIN.`);
        } else {
            console.log(`WARNING: User with ID ${userId} not found.`);
        }

        // 2. Count Products
        const productCount = await Product.countDocuments();
        console.log(`INFO: Total products in 'products' collection: ${productCount}`);

        const allProducts = await Product.find({}, { name: 1, _id: 1, price: 1 });
        console.log("INFO: Product list:", JSON.stringify(allProducts, null, 2));

    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
