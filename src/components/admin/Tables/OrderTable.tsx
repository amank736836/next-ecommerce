"use client";

import { ReactElement } from "react";
import { Column } from "react-table";
import TableHOC from "./TableHOC";

export interface OrderDataType {
    _id: string;
    quantity: number;
    discount: number;
    amount: number;
    status: ReactElement;
    action: ReactElement;
}

const columns: Column<OrderDataType>[] = [
    {
        Header: "Order ID",
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
    {
        Header: "Action",
        accessor: "action",
    },
];

const OrderTable = ({
    data = [],
    title,
}: {
    data: OrderDataType[];
    title: string;
}) => {
    return (
        <TableHOC<OrderDataType>
            columns={columns}
            data={data}
            containerClassName="dashboardProductBox"
            heading={title}
            showPagination={data.length > 10}
            pageSize={10}
        />
    );
};

export default OrderTable;
