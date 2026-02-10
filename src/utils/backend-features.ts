import { redis } from "@/lib/redis";
import { Document } from "mongoose";

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
    review?: boolean;
    coupon?: boolean;
    couponId?: string;
};

export const invalidateCache = async ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
    review,
    coupon,
    couponId,
}: InvalidateCacheProps) => {
    if (product) {
        const productKeys: string[] = [
            "latest-products",
            "categories",
            "all-products",
        ];

        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
            if (review) {
                productKeys.push(`reviews-${productId}`);
            }
        }

        if (Array.isArray(productId)) {
            productId.forEach((i) => {
                productKeys.push(`product-${i}`);
                if (review) {
                    productKeys.push(`reviews-${i}`);
                }
            });
        }

        await redis.del(productKeys);
    }
    if (order) {
        const orderKeys: string[] = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];

        await redis.del(orderKeys);
    }
    if (admin) {
        const adminKeys: string[] = [
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ];

        await redis.del(adminKeys);
    }
    if (userId) {
        const userKeys: string[] = [`user-${userId}`, "all-users"];
        await redis.del(userKeys);
    }
    if (coupon) {
        const couponKeys: string[] = ["all-coupons", `coupon-${couponId}`];
        await redis.del(couponKeys);
    }
};

export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
    // Avoid circular dependency by importing Product dynamically or assuming it's used where Product is available
    // Better to import it here.
    const { Product } = await import("@/models/product");

    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < order.quantity) {
            throw new Error(`${product.name} is out of stock`);
        }
        product.stock = product.stock - order.quantity;
        await product.save();
    }
};

import { cloudinary } from "@/lib/cloud";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = async (
    file: File | Blob
): Promise<{ public_id: string; url: string }> => {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "ecommerce",
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) return resolve(result);
                }
            );
            uploadStream.end(buffer);
        })

        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const deleteFromCloudinary = async (publicIds: string[]) => {
    try {
        const deletePromises = publicIds.map((id) => {
            return new Promise<void>((resolve, reject) => {
                cloudinary.uploader.destroy(id, (error, result) => {
                    if (error) return reject(error);
                    resolve();
                });
            });
        });

        await Promise.all(deletePromises);
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(2));
};

export const getCategoriesCount = async ({
    categories,
    productCount,
}: {
    categories: string[];
    productCount: number;
}) => {
    const { Product } = await import("@/models/product");

    const categoriesCountPromise = categories.map((category) =>
        Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];
    categories.forEach((category, index) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[index] / productCount) * 100),
        });
    });

    return categoryCount;
};

export interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
    status?: string;
}

type FuncProps = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: "discount" | "total" | "count";
};

export const getChartData = ({
    length,
    docArr,
    today,
    property = "count",
}: FuncProps) => {
    const data: number[] = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        let monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property == "count") {
                data[length - 1 - monthDiff]++;
            } else {
                if (i.status === "Delivered") {
                    data[length - 1 - monthDiff] += i[property]!;
                }
            }
        }
    });

    return data;
};
