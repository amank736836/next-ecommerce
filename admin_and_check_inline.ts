
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

// Define schemas inline to avoid import issues
const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: [true, "Please enter ID"] },
        name: { type: String, required: [true, "Please enter Name"] },
        email: { type: String, unique: [true, "Email already exists"], required: [true, "Please enter Email"] },
        photo: { type: String, required: [true, "Please add Photo"] },
        role: { type: String, enum: ["admin", "user"], default: "user" },
        gender: { type: String, enum: ["male", "female"], required: [true, "Please enter Gender"] },
        dob: { type: Date, required: [true, "Please enter Date of birth"] },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Please enter product name"] },
        price: { type: Number, required: [true, "Please enter product price"] },
        stock: { type: Number, required: [true, "Please enter product stock"] },
        category: { type: String, required: [true, "Please enter product category"], trim: true },
        description: { type: String, required: [true, "Please enter product description"] },
        photos: [{ public_id: String, url: String }],
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

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
            console.log(`WARNING: User with ID ${userId} not found directly.`);
            // Try updating anyway
            const res = await User.updateOne({ _id: userId }, { role: "admin" });
            console.log("Update result:", res);
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
