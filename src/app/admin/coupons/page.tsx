"use client";

import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "../../../redux/store";
import { useAllCouponsQuery, useDeleteCouponMutation } from "../../../redux/api/paymentAPI";
import { CustomError } from "../../../types/api-types";
import { SkeletonLoader } from "../../../components/Loaders/SkeletonLoader";
import CouponTable from "../../../components/admin/Tables/CouponTable";
import { responseToast } from "../../../utils/features";

interface CouponDataType {
    _id: string;
    code: string;
    amount: number;
    action: ReactElement;
}

const Coupons = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { data, isLoading, isError, error } = useAllCouponsQuery(user?._id || "");
    const [deleteCoupon] = useDeleteCouponMutation();

    const [rows, setRows] = useState<CouponDataType[]>([]);

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err.data.message);
        }
        if (data) {
            setRows(
                data.coupons.map((i) => ({
                    _id: i._id,
                    code: i.code,
                    amount: i.amount,
                    action: (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Link href={`/admin/coupon/${i._id}`}>Manage</Link>
                            <button onClick={() => deleteHandler(i._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    ),
                }))
            );
        }
    }, [data, isError, error]);

    const deleteHandler = async (id: string) => {
        const res = await deleteCoupon({ id: user?._id!, couponId: id });
        responseToast(res, null, "");
    };

    if (isLoading) return <SkeletonLoader length={20} />;

    return (
        <>
            <main className="dashboardProductBox">
                <h3>All Coupons</h3>
                {rows.length > 0 ? (
                    <CouponTable data={rows} />
                ) : (
                    <h1 style={{ textAlign: "center" }}>No Coupons Found</h1>
                )}
            </main>
            <Link href="/admin/coupon/new" className="createProductBtn">
                <FaPlus />
            </Link>
        </>
    );
};

export default Coupons;
