
import mongoose from "mongoose";
import { Product } from "./src/models/product";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const countProducts = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB,
        });

        const count = await Product.countDocuments();
        console.log(`Total products in DB: ${count}`);

        const products = await Product.find({});
        console.log("Products found:", JSON.stringify(products, null, 2));

    } catch (error) {
        console.error("Error counting products:", error);
    } finally {
        await mongoose.disconnect();
    }
};

countProducts();
