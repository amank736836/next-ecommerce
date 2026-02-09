"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Link from "next/link";
import { SkeletonLoader } from "../../../components/Loaders/SkeletonLoader";
import OrderTable, {
    OrderDataType,
} from "../../../components/admin/Tables/OrderTable";
import { useAllOrdersQuery } from "../../../redux/api/orderAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";

const Transaction = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { data, isLoading, isError, error } = useAllOrdersQuery(user?._id!);

    const [rows, setRows] = useState<OrderDataType[]>([]);

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err.data.message);
        }

        if (data) {
            setRows(
                data.orders.map((i) => ({
                    _id: i._id,
                    amount: i.total,
                    discount: i.discount,
                    quantity: i.orderItems.length,
                    status: (
                        <span
                            className={
                                i.status === "Delivered"
                                    ? "green"
                                    : i.status === "Shipped"
                                        ? "purple"
                                        : "red"
                            }
                        >
                            {i.status}
                        </span>
                    ),
                    action: <Link href={`/admin/transaction/${i._id}`}>Manage</Link>,
                }))
            );
        }
    }, [data, isError, error]);

    if (isLoading) return <SkeletonLoader length={20} />;

    return (
        <main>
            <OrderTable data={rows} title="Transactions" />
        </main>
    );
};

export default Transaction;
