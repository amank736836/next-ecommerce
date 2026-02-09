"use client";

import { useEffect, useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
    useDeleteCouponMutation,
    useGetCouponQuery,
    useUpdateCouponMutation,
} from "../../../../redux/api/paymentAPI";
import { RootState } from "../../../../redux/store";
import { responseToast } from "../../../../utils/features";
import { SkeletonLoader } from "../../../../components/Loaders/SkeletonLoader";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const allNumbers = "0123456789";
const allSymbols = "!@#$%^&*()_+";

const ManageCoupon = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading, isError } = useGetCouponQuery({
        id: user?._id!,
        couponId: id,
    });

    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const [size, setSize] = useState<number>(8);
    const [prefix, setPrefix] = useState<string>("");
    const [postfix, setPostfix] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [couponCode, setCouponCode] = useState<string>("");

    const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
    const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [generating, setGenerating] = useState<boolean>(false);

    useEffect(() => {
        if (data && data.coupon) {
            setCouponCode(data.coupon.code);
            setAmount(data.coupon.amount!); // Use non-null assertion or default. Legacy used amount.
            // Legacy didn't store prefix/postfix/etc in DB for update? 
            // Wait, legacy update handles prefix/postfix?
            // "const { code, amount, size, prefix, postfix, includeNumbers... } = data?.coupon || defaultCoupon"
            // Yes, legacy stores these.

            // Wait, does the backend store them?
            // "src/models/coupon.ts" should have these fields if they are stored.
            // Let's assume they are returned in data.coupon.
            // I'll update state if they exist.
            if (data.coupon.prefix) setPrefix(data.coupon.prefix);
            if (data.coupon.postfix) setPostfix(data.coupon.postfix);
            if (data.coupon.size) setSize(data.coupon.size);
            if (data.coupon.includeNumbers) setIncludeNumbers(data.coupon.includeNumbers);
            if (data.coupon.includeCharacters) setIncludeCharacters(data.coupon.includeCharacters);
            if (data.coupon.includeSymbols) setIncludeSymbols(data.coupon.includeSymbols);
        }
    }, [data]);

    const copyText = async (coupon: string) => {
        await navigator.clipboard.writeText(coupon);
        setIsCopied(true);
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!includeNumbers && !includeCharacters && !includeSymbols) {
            return toast.error("Please select at least one character set");
        }

        if (amount <= 0) {
            return toast.error("Amount must be greater than 0");
        }

        setGenerating(true);

        try {
            let entireString: string = "";
            if (includeNumbers) entireString += allNumbers;
            if (includeCharacters) entireString += allLetters;
            if (includeSymbols) entireString += allSymbols;

            let result: string = prefix;
            const loopLength: number = size - prefix.length - postfix.length;

            for (let i = 0; i < loopLength; i++) {
                const randomNum: number = Math.floor(Math.random() * entireString.length);
                result += entireString[randomNum];
            }
            result += postfix;

            setCouponCode(result);

            const res = await updateCoupon({
                id: user?._id!,
                couponId: id,
                code: result,
                amount,
                prefix,
                postfix,
                includeNumbers,
                includeCharacters,
                includeSymbols,
                size
            });

            responseToast(res, router, "/admin/coupons");

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setGenerating(false);
        }
    };

    const deleteHandler = async () => {
        const res = await deleteCoupon({
            id: user?._id!,
            couponId: id,
        });
        responseToast(res, router, "/admin/coupons");
    };

    if (isLoading) return <SkeletonLoader length={20} />;

    return (
        <main className="dashboardAppContainer">
            <section>
                <button className="productDeleteBtn" onClick={deleteHandler}>
                    <FaTrash />
                </button>
                <h2>Manage Coupon</h2>
                <form className="couponForm" onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="prefix">Coupon Prefix</label>
                        <input
                            id="prefix"
                            type="text"
                            placeholder="Text for prefix"
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)}
                            maxLength={size - postfix.length}
                        />
                    </div>

                    <div>
                        <label htmlFor="postfix">Coupon Postfix</label>
                        <input
                            id="postfix"
                            type="text"
                            placeholder="Text for postfix"
                            value={postfix}
                            onChange={(e) => setPostfix(e.target.value)}
                            maxLength={size - prefix.length}
                        />
                    </div>

                    <div>
                        <label htmlFor="size">Coupon Length (Minimum 8, Maximum 25)</label>
                        <input
                            id="size"
                            type="number"
                            placeholder="Coupon Length"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            min={8}
                            max={25}
                        />
                    </div>

                    <div>
                        <label htmlFor="amount">Coupon Value</label>
                        <input
                            id="amount"
                            type="number"
                            placeholder="Coupon Amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>

                    <fieldset>
                        <legend>Include</legend>
                        <input
                            type="checkbox"
                            id="numbers"
                            checked={includeNumbers}
                            onChange={() => setIncludeNumbers((prev) => !prev)}
                        />
                        <label htmlFor="numbers">Numbers</label>

                        <input
                            type="checkbox"
                            id="characters"
                            checked={includeCharacters}
                            onChange={() => setIncludeCharacters((prev) => !prev)}
                        />
                        <label htmlFor="characters">Characters</label>

                        <input
                            type="checkbox"
                            id="symbols"
                            checked={includeSymbols}
                            onChange={() => setIncludeSymbols((prev) => !prev)}
                        />
                        <label htmlFor="symbols">Symbols</label>
                    </fieldset>

                    <button disabled={generating} type="submit">
                        Update
                    </button>
                </form>

                {couponCode && (
                    <code>
                        {couponCode}
                        <span onClick={() => copyText(couponCode)}>
                            {isCopied ? "Copied" : "Copy"}
                        </span>
                    </code>
                )}
            </section>
        </main>
    );
};

export default ManageCoupon;
