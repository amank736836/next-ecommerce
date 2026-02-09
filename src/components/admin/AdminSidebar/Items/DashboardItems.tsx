import { IoIosPeople } from "react-icons/io";
import { MdDiscount } from "react-icons/md";
import { RiDatabaseFill, RiShoppingBag3Fill } from "react-icons/ri";

export const DashboardItems = [
    {
        name: "Dashboard",
        icon: RiDatabaseFill,
        url: "/admin/dashboard",
    },
    {
        name: "Customers",
        icon: IoIosPeople,
        url: "/admin/customers",
    },
    {
        name: "Products",
        icon: RiShoppingBag3Fill,
        url: "/admin/products",
    },
    {
        name: "Transactions",
        icon: RiDatabaseFill, // Using placeholder icon as original file didn't have it, verifying from list
        url: "/admin/transaction",
    },
    {
        name: "Coupons",
        icon: MdDiscount,
        url: "/admin/coupons",
    }
];
