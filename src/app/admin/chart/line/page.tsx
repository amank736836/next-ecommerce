"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { LineChart } from "../../../../components/admin/Charts/Charts";
import { SkeletonLoader } from "../../../../components/Loaders/SkeletonLoader";
import { useLineQuery } from "../../../../redux/api/dashboardAPI";
import { RootState } from "../../../../redux/store";
import { CustomError } from "../../../../types/api-types";
import { getLastMonths } from "../../../../utils/features";

const { last12Months: months } = getLastMonths();

const LineCharts = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { data, isLoading, isError, error } = useLineQuery(user?._id || "");

    const Users = data?.charts.users || [];
    const Products = data?.charts.products || [];
    const Revenue = data?.charts.revenue || [];
    const Discount = data?.charts.discount || [];

    useEffect(() => {
        if (isError) {
            const err = error as CustomError;
            toast.error(err?.data?.message || "Failed to fetch line charts data");
        }
    }, [isError, error]);

    return (
        <main className="chartContainer">
            <h1>Line Charts</h1>
            {isLoading ? (
                <SkeletonLoader length={20} />
            ) : (
                <>
                    <section>
                        <div>
                            <LineChart
                                data={Users}
                                label="Users"
                                backgroundColor="rgba(53, 162, 255, 0.5)"
                                borderColor="rgb(53, 162, 255)"
                                labels={months}
                            />
                        </div>
                        <h2>Active Users</h2>
                    </section>

                    <section>
                        <div>
                            <LineChart
                                data={Products}
                                label="Products"
                                backgroundColor="hsla(269, 80%, 40%, 0.4)"
                                borderColor="hsl(269, 80%, 40%)"
                                labels={months}
                            />
                        </div>
                        <h2>Total Products (SKU)</h2>
                    </section>

                    <section>
                        <div>
                            <LineChart
                                data={Revenue}
                                label="Revenue"
                                backgroundColor="hsla(129, 80%, 40%, 0.4)"
                                borderColor="hsl(129, 80%, 40%)"
                                labels={months}
                            />
                        </div>
                        <h2>Total Revenue</h2>
                    </section>

                    <section>
                        <div>
                            <LineChart
                                data={Discount}
                                label="Discount"
                                backgroundColor="hsla(29, 80%, 40%, 0.4)"
                                borderColor="hsl(29, 80%, 40%)"
                                labels={months}
                            />
                        </div>
                        <h2>Discount Allotted</h2>
                    </section>
                </>
            )}
        </main>
    );
};

export default LineCharts;
