"use client";

import { useSelector } from "react-redux";
import AdminSidebar from "../../components/admin/AdminSidebar/AdminSidebar";
import { RootState } from "../../redux/store";
import { redirect } from "next/navigation";
import Loader from "../../components/Loaders/Loader";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useSelector((state: RootState) => state.userReducer);

    if (loading) return <Loader />;

    if (!user || user.role !== "admin") {
        return redirect("/login");
    }

    return (
        <div className="adminContainer">
            <AdminSidebar />
            {children}
        </div>
    );
};

export default AdminLayout;
