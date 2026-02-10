import { connectDB } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Product } from "@/models/product";
import { User } from "@/models/user";
import {
    deleteFromCloudinary,
    invalidateCache,
    uploadToCloudinary,
} from "@/utils/backend-features";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;
        const key = `product-${id}`;

        let product;
        const cachedData = await redis.get(key);

        if (cachedData) {
            product = JSON.parse(cachedData);
        } else {
            product = await Product.findById(id);
            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product not found",
                    },
                    { status: 404 }
                );
            }
            await redis.set(key, JSON.stringify(product));
        }

        return NextResponse.json(
            {
                success: true,
                product,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        const authId = req.nextUrl.searchParams.get("id");
        if (!authId) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }
        const user = await User.findById(authId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = formData.get("price") as string;
        const stock = formData.get("stock") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const photo = formData.get("photo") as File;

        if (name) product.name = name;
        if (price) product.price = Number(price);
        if (stock) product.stock = Number(stock);
        if (category) product.category = category.toLowerCase();
        if (description) product.description = description;

        if (photo) {
            // Upload new photo
            const { public_id, url } = await uploadToCloudinary(photo);

            // Delete old photo(s)
            const oldPublicIds = product.photos.map((p: any) => p.public_id);
            await deleteFromCloudinary(oldPublicIds);

            // Update with new photo (Assuming single photo upload based on frontend likely behavior, 
            // though backend supported multiple. adjusting for simplicity matching current POST)
            product.photos = [{ public_id, url }];
        }

        await product.save();

        await invalidateCache({
            product: true,
            productId: String(product._id),
            admin: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Product Updated Successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        await connectDB();
        const { id } = await params;

        const authId = req.nextUrl.searchParams.get("id");
        if (!authId) {
            return NextResponse.json({ success: false, message: "Please provide admin id" }, { status: 401 });
        }
        const user = await User.findById(authId);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "You are not authorized" }, { status: 403 });
        }

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        const public_ids = product.photos.map((photo: any) => photo.public_id);
        await deleteFromCloudinary(public_ids);
        await product.deleteOne();

        await invalidateCache({
            product: true,
            productId: String(product._id),
            admin: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Product Deleted Successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
};
