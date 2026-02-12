"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SkeletonLoader } from "../../../../components/Loaders/SkeletonLoader";
import {
    useDeleteOrderMutation,
    useOrderDetailsQuery,
    useUpdateOrderMutation,
} from "../../../../redux/api/orderAPI";
import { RootState } from "../../../../redux/store";
import { CustomError } from "../../../../types/api-types";
import { Order, OrderItem } from "../../../../types/types";
import { responseToast, transformImage } from "../../../../utils/features";

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
    orderItems: [],
};

const OrderManagement = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading, isError, error } = useOrderDetailsQuery(id);

    const [order, setOrder] = useState<Order>(defaultOrder);

    const [updateOrder] = useUpdateOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err.data.message);
        }
        if (data) {
            setOrder(data.order);
        }
    }, [data, isError, error]);

    const updateHandler = async () => {
        const res = await updateOrder({
            orderId: order._id,
            id: user?._id!,
        });
        responseToast(res, null, "");
    };

    const deleteHandler = async () => {
        const res = await deleteOrder({
            orderId: order._id,
            id: user?._id!,
        });
        responseToast(res, router, "/admin/transaction");
    };

    if (isLoading) return <SkeletonLoader length={20} />;

    if (!data && !isLoading) return <h1 style={{ textAlign: "center" }}>Order Not Found</h1>;

    return (
        <main className="productManagement">
            <section style={{ padding: "2rem" }}>
                <h2>Order Items</h2>
                {order.orderItems.map((i) => (
                    <div
                        key={i._id}
                        className="orderProductCard"
                    >
                        <img src={transformImage(i.photos?.[0]?.url, 64)} alt={i.name} />
                        <Link href={`/product/${i.productId}`}>
                            {i.name}
                        </Link>
                        <span>
                            ₹{i.price} X {i.quantity} = ₹{i.price * i.quantity}
                        </span>
                    </div>
                ))}
            </section>

            <article className="shippingInfoCard">
                <h1>Order Info</h1>
                <h5>User Info</h5>
                <p>Name: {order.user.name}</p>
                <p>
                    Address: {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country} ${order.shippingInfo.pinCode}`}
                </p>
                <h5>Amount Info</h5>
                <p>Subtotal: {order.subtotal}</p>
                <p>Shipping Charges: {order.shippingCharges}</p>
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

                <button className="productDeleteBtn" onClick={deleteHandler}>
                    <FaTrash />
                </button>

                {/* Only show Process Status button if not Delivered */}
                {order.status !== "Delivered" && (
                    <button onClick={updateHandler}>Process Status</button>
                )}
            </article>
        </main>
    );
};

export default OrderManagement;
