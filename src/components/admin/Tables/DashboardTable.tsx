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

const DashboardTable = ({ data = [] }: { data: LatestOrder[] }) => {
    return (
        <TableHOC<LatestOrder>
            columns={columns}
            data={data}
            containerClassName="orderBox"
            heading="Top Orders"
        />
    );
};

export default DashboardTable;
