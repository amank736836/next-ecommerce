"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { BarChart } from "../../../../components/admin/Charts/Charts";
import { SkeletonLoader } from "../../../../components/Loaders/SkeletonLoader";
import { useBarQuery } from "../../../../redux/api/dashboardAPI";
import { RootState } from "../../../../redux/store";
import { CustomError } from "../../../../types/api-types";
import { getLastMonths } from "../../../../utils/features";

const { last6Months, last12Months } = getLastMonths();

const BarCharts = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { data, isLoading, isError, error } = useBarQuery(user?._id || "");

    const Products = data?.charts.products || [];
    const Users = data?.charts.users || [];
    const Orders = data?.charts.orders || [];

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err?.data?.message || "Failed to fetch bar charts data");
        }
    }, [isError, error]);

    return (
        <main className="chartContainer">
            <h1>Bar Charts</h1>
            {isLoading ? (
                <SkeletonLoader length={20} />
            ) : (
                <>
                    <section>
                        <div>
                            <BarChart
                                data_1={Products}
                                data_2={Users}
                                title_1="Products"
                                title_2="Users"
                                bgColor_1="hsl(260, 50%, 30%)"
                                bgColor_2="hsl(360, 90%, 90%)"
                                labels={last6Months}
                            />
                        </div>
                        <h2>Top Selling Products & Top Customers</h2>
                    </section>
                    <section>
                        <div>
                            <BarChart
                                data_1={Orders}
                                data_2={[]}
                                title_1="Orders"
                                title_2=""
                                bgColor_1="hsl(180, 40%, 50%)"
                                bgColor_2=""
                                labels={last12Months}
                                horizontal={true}
                            />
                        </div>
                        <h2>Orders throughout the year</h2>
                    </section>
                </>
            )}
        </main>
    );
};

export default BarCharts;
