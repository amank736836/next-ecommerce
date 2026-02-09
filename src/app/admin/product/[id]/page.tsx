"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation"; // Changed from 'next/router'
import { SkeletonLoader } from "../../../../components/Loaders/SkeletonLoader";
import {
    useDeleteProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
} from "../../../../redux/api/productAPI";
import { RootState } from "../../../../redux/store";
import { responseToast, transformImage } from "../../../../utils/features";

const ProductManagement = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading, isError } = useProductDetailsQuery(id);

    const [product, setProduct] = useState({
        _id: "",
        name: "",
        photo: "",
        category: "",
        stock: 0,
        price: 0,
        description: "",
    });

    const [priceUpdate, setPriceUpdate] = useState<number>(product.price);
    const [stockUpdate, setStockUpdate] = useState<number>(product.stock);
    const [nameUpdate, setNameUpdate] = useState<string>(product.name);
    const [categoryUpdate, setCategoryUpdate] = useState<string>(product.category);
    const [descriptionUpdate, setDescriptionUpdate] = useState<string>(product.description);
    const [photo, setPhoto] = useState<string>("");
    const [photoFile, setPhotoFile] = useState<File>();

    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];

        const reader: FileReader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setPhoto(reader.result);
                    setPhotoFile(file);
                }
            };
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        if (nameUpdate) formData.set("name", nameUpdate);
        if (priceUpdate) formData.set("price", priceUpdate.toString());
        if (stockUpdate !== undefined) formData.set("stock", stockUpdate.toString());
        if (photoFile) formData.set("photo", photoFile);
        if (categoryUpdate) formData.set("category", categoryUpdate);
        if (descriptionUpdate) formData.set("description", descriptionUpdate);

        const res = await updateProduct({
            formData,
            id: user?._id!,
            productId: product._id!,
        });

        responseToast(res, router, "/admin/products");
    };

    const deleteHandler = async () => {
        const res = await deleteProduct({
            id: user?._id!,
            productId: product._id!,
        });

        responseToast(res, router, "/admin/products");
    };

    useEffect(() => {
        if (data) {
            const p = data.product;
            setProduct({
                _id: p._id,
                name: p.name,
                photo: p.photos?.[0]?.url || "",
                category: p.category,
                stock: p.stock,
                price: p.price,
                description: p.description,
            })
            setNameUpdate(p.name);
            setPriceUpdate(p.price);
            setStockUpdate(p.stock);
            setCategoryUpdate(p.category);
            setDescriptionUpdate(p.description);
        }
    }, [data]);

    if (isLoading) return <SkeletonLoader length={20} />;

    return (
        <main className="productManagement">
            <section>
                <strong>ID - {product._id}</strong>
                <img src={transformImage(product.photo, 200)} alt="Product" />
                <p>{nameUpdate}</p>
                {stockUpdate > 0 ? (
                    <span className="green">{stockUpdate} Available</span>
                ) : (
                    <span className="red"> Not Available</span>
                )}
                <h3>₹{priceUpdate}</h3>
            </section>

            <article>
                <button className="productDeleteBtn" onClick={deleteHandler}>
                    <FaTrash />
                </button>
                <form onSubmit={submitHandler}>
                    <h2>Manage</h2>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={nameUpdate}
                            onChange={(e) => setNameUpdate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            required
                            placeholder="Description"
                            value={descriptionUpdate}
                            onChange={(e) => setDescriptionUpdate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            placeholder="Price"
                            value={priceUpdate}
                            onChange={(e) => setPriceUpdate(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>Stock</label>
                        <input
                            type="number"
                            placeholder="Stock"
                            value={stockUpdate}
                            onChange={(e) => setStockUpdate(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>Category</label>
                        <input
                            type="text"
                            placeholder="eg. laptop, camera etc"
                            value={categoryUpdate}
                            onChange={(e) => setCategoryUpdate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Photo</label>
                        <input type="file" onChange={changeImageHandler} />
                    </div>

                    {photo && <img src={photo} alt="New Image" />}

                    <button type="submit">Update</button>
                </form>
            </article>
        </main>
    );
};

export default ProductManagement;
