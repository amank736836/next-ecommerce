"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useNewCouponMutation } from "../../../../redux/api/paymentAPI";
import { RootState } from "../../../../redux/store";
import { responseToast } from "../../../../utils/features";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const allNumbers = "0123456789";
const allSymbols = "!@#$%^&*()_+";

const NewCoupon = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const router = useRouter();

    const [size, setSize] = useState<number>(8);
    const [prefix, setPrefix] = useState<string>("");
    const [postfix, setPostfix] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
    const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const [coupon, setCoupon] = useState<string>("");
    const [generating, setGenerating] = useState<boolean>(false);

    const [newCoupon] = useNewCouponMutation();

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

            setCoupon(result);

            const res = await newCoupon({
                _id: user?._id!,
                code: result,
                amount,
                size,
                prefix,
                postfix,
                includeNumbers,
                includeCharacters,
                includeSymbols,
            });

            responseToast(res, router, "/admin/coupons");

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        setIsCopied(false);
    }, [coupon]);

    return (
        <main className="dashboardAppContainer">
            <h1>New Coupon</h1>
            <section>
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
                            placeholder="Coupon Value"
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
                        Generate
                    </button>
                </form>

                {coupon && (
                    <code>
                        {coupon}
                        <span onClick={() => copyText(coupon)}>
                            {isCopied ? "Copied" : "Copy"}
                        </span>
                    </code>
                )}
            </section>
        </main>
    );
};

export default NewCoupon;
