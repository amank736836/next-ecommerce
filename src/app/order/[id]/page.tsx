"use client";

import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loaders/Loader";
import { SkeletonLoader } from "@/components/Loaders/SkeletonLoader";
import {
    useCancelOrderMutation,
    useDeleteOrderMutation,
    useOrderDetailsQuery,
    useUpdateOrderMutation,
} from "@/redux/api/orderAPI";
import { RootState } from "@/redux/store";
import { CustomError } from "@/types/api-types";
import { Order, OrderItem } from "@/types/types";
import { responseToast, transformImage } from "@/utils/features";

const orderItems: OrderItem[] = [
    {
        name: "",
        photos: [],
        price: 0,
        quantity: 0,
        productId: "",
        _id: "",
    },
];

const defaultOrder: Order = {
    _id: "",
    user: {
        _id: "",
        name: "",
    },
    shippingInfo: {
        address: "",
        city: "",
        country: "",
        state: "",
        pinCode: "",
    },
    status: "Processing",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: orderItems,
};

const OrderDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    // In Next.js 15+, params is a Promise. We can use React.use() to unwrap it.
    const { id } = use(params);

    const { data, isLoading, isError, error } = useOrderDetailsQuery(id);

    const [loading, setLoading] = useState<boolean>(false);

    const [updateOrder] = useUpdateOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const [cancelOrder] = useCancelOrderMutation();

    const router = useRouter();

    const [order, setOrder] = useState<Order>(data?.order || defaultOrder);

    useEffect(() => {
        if (isError || error) {
            const err = error as CustomError;
            err.data?.message
                ? toast.error(err.data.message)
                : toast.error("Failed to fetch order details");
        }
        if (data) {
            console.log("Order Data:", data.order);
            console.log("Order Items:", data.order.orderItems);
            setOrder(data.order);
        }
    }, [data, isError, error]);

    if (isError || error) {
        // router.push("/orders"); // Better to handle redirect in useEffect or let user see error
        // return null;
    }

    const updateHandler = async () => {
        setLoading(true);
        const toastId = toast.loading("Updating Order Status...");
        try {
            const res = await updateOrder({
                orderId: order._id,
                id: user?._id!,
            });

            responseToast(res, router, "/orders");
        } catch (error) {
            toast.error("Failed to update order status");
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    const deleteHandler = async () => {
        setLoading(true);
        const toastId = toast.loading("Deleting Order...");
        try {
            const res = await deleteOrder({
                orderId: order._id,
                id: user?._id!,
            });

            responseToast(res, router, "/orders");
        } catch (error) {
            toast.error("Failed to delete order");
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    const cancelHandler = async () => {
        setLoading(true);
        const toastId = toast.loading("Cancelling Order...");
        try {
            const res = await cancelOrder({
                orderId: order._id,
                id: user?._id!,
            });

            responseToast(res, router, "/orders");
        } catch (error) {
            toast.error("Failed to cancel order");
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container">
            <main className="productManagement">
                {isLoading ? (
                    <>
                        <SkeletonLoader length={1} width="500px" height="85vh" />
                        <SkeletonLoader length={1} width="400px" height="85vh" />
                    </>
                ) : (
                    <>
                        {user?.role === "admin" &&
                            (order.status === "Delivered" ||
                                order.status === "Cancelled") && (
                                <button
                                    className="productDeleteBtn"
                                    disabled={loading}
                                    onClick={deleteHandler}
                                >
                                    <FaTrash />
                                </button>
                            )}
                        <section
                            style={{
                                padding: "2rem",
                            }}
                        >
                            <h2>Order Items</h2>
                            {order &&
                                order.orderItems.length !== 0 &&
                                order.orderItems.map((item: OrderItem) => (
                                    <div
                                        className="orderProductCard"
                                        key={item.productId}
                                        onClick={() => router.push(`/product/${item.productId}`)}
                                    >
                                        {item.photos?.[0]?.url && (
                                            <img
                                                src={transformImage(item.photos[0].url, 64)}
                                                alt={item.name}
                                            />
                                        )}
                                        {user?.role === "admin" ? (
                                            <Link href={`/admin/product/${item.productId}`}>
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <h5>{item.name}</h5>
                                        )}
                                        <span>
                                            ₹{item.price} X {item.quantity} = ₹
                                            {item.price * item.quantity}
                                        </span>
                                        {order.status === "Delivered" && (
                                            <Link
                                                className="reviewBtn"
                                                onClick={(e) => e.stopPropagation()}
                                                href={`/product/${item.productId}`}
                                            >
                                                Review
                                            </Link>
                                        )}
                                    </div>
                                ))}
                        </section>
                        <article className="shippingInfoCard">
                            <h1>Order Info</h1>
                            <h5>User Info</h5>
                            <p>Name : {order.user.name}</p>
                            <p>
                                Address:{" "}
                                {`
                ${order.shippingInfo.address},
            ${order.shippingInfo.city},
            ${order.shippingInfo.state},
            ${order.shippingInfo.country} -
            ${order.shippingInfo.pinCode}
            `}
                            </p>
                            <h5>Amount Info</h5>
                            <p>Subtotal: {order.subtotal}</p>
                            <p>ShippingCharges: {order.shippingCharges}</p>
                            <p>Tax: {order.tax}</p>
                            <p>Discount: {order.discount}</p>
                            <p>Total: {order.total}</p>

                            <h5>Status Info</h5>
                            <p>
                                Status:{" "}
                                <span
                                    className={
                                        order.status === "Delivered"
                                            ? "green"
                                            : order.status === "Shipped"
                                                ? "purple"
                                                : "red"
                                    }
                                >
                                    {order.status}
                                </span>
                            </p>

                            {order.status !== "Delivered" &&
                                order.status !== "Cancelled" &&
                                user?.role === "admin" && (
                                    <button onClick={updateHandler} disabled={loading}>
                                        Process Status{" "}
                                    </button>
                                )}
                            {(((order.status === "Processing" ||
                                order.status === "Shipped") &&
                                user?.role === "user") ||
                                (order.status === "Processing" && user?.role === "admin")) && (
                                    <button
                                        style={{ backgroundColor: "red" }}
                                        onClick={cancelHandler}
                                        disabled={loading}
                                    >
                                        Cancel Order{" "}
                                    </button>
                                )}
                        </article>
                    </>
                )}
            </main>
        </div>
    );
};

export default OrderDetails;
