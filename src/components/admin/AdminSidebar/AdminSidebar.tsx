"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppItems } from "./Items/AppsItems";
import { ChartItems } from "./Items/ChartsItems";
import { DashboardItems } from "./Items/DashboardItems";

import { RiMenuFold4Fill, RiMenuUnfold4Fill } from "react-icons/ri";
import { AppSidebar } from "./Sidebar/AppSidebar";
import { ChartSidebar } from "./Sidebar/ChartSidebar";
import { DashboardSidebar } from "./Sidebar/DashboardSidebar";

const AdminSidebar = () => {
    // using usePathname to get current path
    const pathname = usePathname();
    // mocking location object for compatibility with Li component
    const location = { pathname };

    const [showModal, setShowModal] = useState<boolean>(false);
    const [phoneActive, setPhoneActive] = useState<boolean>(false);

    const resizeHandler = () => {
        setPhoneActive(window.innerWidth < 1100);
    };

    useEffect(() => {
        // Init phoneActive on mount
        setPhoneActive(window.innerWidth < 1100);

        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    return (
        <>
            {phoneActive && (
                <button
                    type="button"
                    className="hamburger"
                    onClick={() => setShowModal(!showModal)}
                >
                    {showModal ? <RiMenuUnfold4Fill /> : <RiMenuFold4Fill />}
                </button>
            )}

            <aside
                style={
                    phoneActive
                        ? {
                            width: "20rem",
                            height: "100vh",
                            position: "fixed",
                            top: "0",
                            left: showModal ? "0" : "-20rem",
                            transition: "all 0.5s",
                        }
                        : {}
                }
            >
                <Link href="/" className="logo">
                    <h2>Logo.</h2>
                </Link>
                <DashboardSidebar
                    dashboard={DashboardItems}
                    location={location}
                    setShowModal={setShowModal}
                />
                <ChartSidebar
                    charts={ChartItems}
                    location={location}
                    setShowModal={setShowModal}
                />
                <AppSidebar
                    apps={AppItems}
                    location={location}
                    setShowModal={setShowModal}
                />

                {phoneActive && (
                    <button className="closeSidebar" onClick={() => setShowModal(false)}>
                        Close
                    </button>
                )}
            </aside>
        </>
    );
};

export default AdminSidebar;
