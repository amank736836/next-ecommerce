"use client";

import { ReactElement, useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../../../components/Loaders/SkeletonLoader";
import ProductTable, {
    ProductDataType,
} from "../../../components/admin/Tables/ProductTable";
import {
    useAllProductsQuery,
    useDeleteProductMutation,
} from "../../../redux/api/productAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { responseToast, transformImage } from "../../../utils/features";

const Products = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { data, isLoading, isError, error } = useAllProductsQuery(user?._id!);
    const [rows, setRows] = useState<ProductDataType[]>([]);

    const [deleteProduct] = useDeleteProductMutation();

    const deleteHandler = async (productId: string) => {
        const res = await deleteProduct({
            id: user?._id!,
            productId,
        });
        responseToast(res, null, "");
    };

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err.data.message);
        }

        if (data) {
            setRows(
                data.products.map((i) => ({
                    photo: <img src={transformImage(i.photos?.[0]?.url, 40)} alt={i.name} />,
                    name: i.name,
                    price: i.price,
                    stock: i.stock,
                    action: (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <Link href={`/admin/product/${i._id}`}>Manage</Link>
                            <button onClick={() => deleteHandler(i._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    ),
                }))
            );
        }
    }, [data, isError, error]);

    if (isLoading) return <SkeletonLoader length={20} />;

    return (
        <>
            <main>
                <ProductTable data={rows} />
            </main>
            <Link href="/admin/product/new" className="createProductBtn">
                <FaPlus />
            </Link>
        </>
    );
};

export default Products;
