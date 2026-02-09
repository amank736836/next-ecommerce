import { ReactElement } from "react";
import { Column } from "react-table";
import TableHOC from "./TableHOC";

export interface CouponDataType {
    _id: string;
    code: string;
    amount: number;
    action: ReactElement;
}

const columns: Column<CouponDataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },
    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const CouponTable = ({ data = [] }: { data: CouponDataType[] }) => {
    return TableHOC<CouponDataType>(
        columns,
        data,
        "dashboardProductBox",
        "Coupons",
        data.length > 6
    )();
};

export default CouponTable;
