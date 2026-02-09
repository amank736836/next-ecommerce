import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type ResType =
    | {
        data: MessageResponse;
    }
    | {
        error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
    res: ResType,
    navigate: AppRouterInstance | null,
    url: string
) => {
    if ("data" in res) {
        toast.success(res.data.message);
        navigate?.push(url);
    } else {
        const error = res.error as FetchBaseQueryError;
        console.log(error);
        const data = error.data as MessageResponse;
        data ? toast.error(data.message) : toast.error("Failed to perform action");
    }
};

export const transformImage = (url: string = "", width = 300) => {
    // Return placeholder for missing/invalid images
    if (!url || url.trim() === "") {
        return `https://via.placeholder.com/${width}x${width}?text=No+Image`;
    }

    // Transform Cloudinary URL with width parameter
    const newUrl = url.replace("/upload/", `/upload/w_${width}/`);
    return newUrl;
};

export const getLastMonths = () => {
    const date = new Date();
    date.setDate(1);

    const last6Months: string[] = [];
    const last12Months: string[] = [];

    for (let i = 0; i < 6; i++) {
        const monthDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const monthName = monthDate.toLocaleString("default", { month: "long" });
        last6Months.unshift(monthName);
    }

    for (let i = 0; i < 12; i++) {
        const monthDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const monthName = monthDate.toLocaleString("default", { month: "long" });
        last12Months.unshift(monthName);
    }

    return {
        last6Months,
        last12Months,
    };
};
