"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useNewProductMutation } from "../../../../redux/api/productAPI";
import { RootState } from "../../../../redux/store";
import { responseToast } from "../../../../utils/features";

const NewProduct = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [name, setName] = useState<string>("");
    const [price, setPrice] = useState<number>(1000);
    const [stock, setStock] = useState<number>(1);
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>(""); // Added description

    const [photo, setPhoto] = useState<File>();
    const [photoPrev, setPhotoPrev] = useState<string>("");

    const [newProduct] = useNewProductMutation();
    const router = useRouter();

    const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];

        const reader: FileReader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setPhotoPrev(reader.result);
                    setPhoto(file);
                }
            };
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!name || !price || stock < 0 || !category || !photo || !description)
                return;

            const formData = new FormData();

            formData.set("name", name);
            formData.set("price", price.toString());
            formData.set("stock", stock.toString());
            formData.set("photo", photo);
            formData.set("category", category);
            formData.set("description", description);

            const res = await newProduct({ id: user?._id!, formData });

            responseToast(res, router, "/admin/products");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="productManagement">
            <article>
                <form onSubmit={submitHandler}>
                    <h2>New Product</h2>
                    <div>
                        <label>Name</label>
                        <input
                            required
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            required
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Price</label>
                        <input
                            required
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>Stock</label>
                        <input
                            required
                            type="number"
                            placeholder="Stock"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label>Category</label>
                        <input
                            required
                            type="text"
                            placeholder="eg. laptop, camera etc"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Photo</label>
                        <input required type="file" onChange={changeImageHandler} />
                    </div>

                    {photoPrev && <img src={photoPrev} alt="New Image" />}

                    <button disabled={isLoading} type="submit">
                        Create
                    </button>
                </form>
            </article>
        </main>
    );
};

export default NewProduct;
