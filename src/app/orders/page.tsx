"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OrderTable, {
    OrderDataType,
} from "@/components/admin/Tables/OrderTable";
import { SkeletonLoader } from "@/components/Loaders/SkeletonLoader";
import { useAllOrdersQuery, useMyOrdersQuery } from "@/redux/api/orderAPI";
import { RootState } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import { FaBoxOpen } from "react-icons/fa";

const Orders = () => {
    const [orders, setOrders] = useState<OrderDataType[]>([]);

    const { user } = useSelector((state: RootState) => state.userReducer);

    // Conditional hook call is generally bad practice in React, 
    // but since user role shouldn't change during component lifecycle typically, 
    // we'll adapt it to be safe or keep it if it works in Next.js CSR.
    // Better approach: use a skip condition or separate components.
    // For now, mirroring existing logic but handling null user safely.

    const { data, isLoading, isError, error } = useMyOrdersQuery(user?._id || "", {
        skip: !user
    });

    // Admin check for "all orders" vs "my orders" is a bit tricky with hooks.
    // The original code toggled the hook based on role. 
    // In RTK Query, we can't conditionally call hooks. 
    // I'll fetch "my orders" for now as that's the primary user-facing feature requested
    // If user is admin, they should ideally go to the admin dashboard for all orders, 
    // but if this page serves both, we need 2 hooks.

    const { data: adminData, isLoading: adminLoading, isError: adminError, error: adminErr } = useAllOrdersQuery(user?._id || "", {
        skip: !user || user.role !== "admin"
    });

    const finalData = user?.role === "admin" ? adminData : data;
    const finalLoading = user?.role === "admin" ? adminLoading : isLoading;
    const finalError = user?.role === "admin" ? adminError : isError;
    const finalErr = user?.role === "admin" ? adminErr : error;

    useEffect(() => {
        if (finalError || finalErr) {
            const err = finalErr as CustomError;
            err?.data?.message
                ? toast.error(err.data.message)
                : toast.error("Failed to fetch orders");
        }
        if (finalData) {
            setOrders(
                finalData.orders.map((order) => ({
                    _id: order._id,
                    quantity: order.orderItems.length,
                    discount: order.discount,
                    amount: order.total,
                    status: (
                        <span
                            className={
                                order.status === "Delivered"
                                    ? "green"
                                    : order.status === "Cancelled"
                                        ? "red"
                                        : order.status === "Shipped"
                                            ? "purple"
                                            : ""
                            }
                        >
                            {order.status}
                        </span>
                    ),
                    action: (
                        <Link href={`/order/${order._id}`}>
                            {user?.role === "admin" ? "Manage" : "View"}
                        </Link>
                    ),
                }))
            );
        }
    }, [finalData, finalError, finalErr, user?.role]);

    if (finalError || finalErr) {
        // return <Navigate to="/" />; // Using router.push in effect is better for Next.js
    }

    return (
        <div className="container">
            <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <FaBoxOpen /> My Orders
            </h1>
            <main>
                {finalLoading ? (
                    <SkeletonLoader
                        length={12}
                        width="100%"
                    />
                ) : orders.length === 0 ? (
                    <center>
                        <h2 className="noData">No Order Done Yet</h2>
                    </center>
                ) : (
                    <OrderTable data={orders} title="Orders" />
                )}
            </main>
        </div>
    );
};

export default Orders;
