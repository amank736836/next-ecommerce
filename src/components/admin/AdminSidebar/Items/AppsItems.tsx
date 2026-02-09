import { BiSolidCoupon } from "react-icons/bi";
import { FaGamepad, FaProductHunt, FaStopwatch } from "react-icons/fa";

export const AppItems = [
    {
        name: "New Coupon",
        icon: BiSolidCoupon,
        url: "/admin/coupon/new",
    },
    {
        name: "New Product",
        icon: FaProductHunt,
        url: "/admin/product/new",
    },
    {
        name: "Stopwatch",
        icon: FaStopwatch,
        url: "/admin/stopwatch",
    },
    {
        name: "Toss",
        icon: FaGamepad,
        url: "/admin/toss",
    },
];
