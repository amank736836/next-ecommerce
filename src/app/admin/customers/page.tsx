"use client";

import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { SkeletonLoader } from "../../../components/Loaders/SkeletonLoader";
import CustomerTable, {
    CustomerDataType,
} from "../../../components/admin/Tables/CustomerTable";
import {
    useAllUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
} from "../../../redux/api/userAPI";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { responseToast, transformImage } from "../../../utils/features";

const Customers = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { data, isLoading, isError, error } = useAllUsersQuery(user?._id!);
    const [rows, setRows] = useState<CustomerDataType[]>([]);

    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const deleteHandler = (userId: string) => async () => {
        const res = await deleteUser({ userId, id: user?._id! });
        responseToast(res, null, "");
    };

    const changeRoleHandler = async (userId: string, role: string) => {
        const res = await updateUser({ userId, id: user?._id!, role });
        responseToast(res, null, "");
    };

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err.data.message);
        }

        if (data) {
            setRows(
                data.users.map((i) => ({
                    avatar: (
                        <img
                            style={{
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                objectFit: "cover"
                            }}
                            src={transformImage(i.photo, 50)}
                            alt={i.name}
                        />
                    ),
                    name: i.name,
                    email: i.email,
                    gender: i.gender,
                    role: (
                        <select
                            value={i.role}
                            onChange={(e) => changeRoleHandler(i._id, e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    ),
                    action: (
                        <button onClick={deleteHandler(i._id)}>
                            <FaTrash />
                        </button>
                    ),
                }))
            );
        }
    }, [data, isError, error, user]); // Added user to dependency array

    if (isLoading) return <SkeletonLoader length={20} />;

    return (
        <main>
            <CustomerTable data={rows} />
        </main>
    );
};

export default Customers;
