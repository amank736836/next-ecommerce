"use client";

import { Column } from "react-table";
import TableHOC from "./TableHOC";
import { LatestOrder } from "../../../types/types";

const columns: Column<LatestOrder>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
];

const DashboardTable = ({ data = [] }: { data: any[] }) => {
    // Robust data mapping to handle potentially raw or transformed data
    const tableData = data.map(item => ({
        _id: item._id,
        quantity: item.quantity ?? item.orderItems?.length ?? 0,
        discount: item.discount,
        amount: item.amount ?? item.total ?? 0,
        status: item.status,
    }));

    return (
        <TableHOC<LatestOrder>
            columns={columns}
            data={tableData}
            containerClassName="orderBox"
            heading="Top Orders"
        />
    );
};

export default DashboardTable;
