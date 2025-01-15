import React, { useState, useEffect } from "react";
import styles from "../../../css/Sidebar.module.css";
import logo from "../../../images/trualliant-logo.svg";
import links from "../../Components/Sidebar/links.json";
import { useLocation } from "react-router-dom";
import dashboardIcon from "../../../images/dashboard.svg";
import reportsIcon from "../../../images/reports.svg";
import analyticsIcon from "../../../images/analytics.svg";
import moderatorIcon from "../../../images/moderator.svg";
import { usePage } from "@inertiajs/react";

const icons = {
    dashboard: dashboardIcon,
    reports: reportsIcon,
    analytics: analyticsIcon,
    moderator: moderatorIcon,
};

const Sidebar = () => {
    const { props } = usePage();
    const admin = props.admin;

    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div
            className={`${styles.sidebar} ${
                isCollapsed ? styles.collapsed : ""
            }`}
        >
            <div className={styles["logo-container"]}>
                <img className={styles.logo} src={logo} alt="Logo" />
            </div>
            <div className={styles["links-container"]}>
                {links.map((link) => (
                    <li
                        className={`${styles.links} ${
                            location.pathname === link.path
                                ? styles["active-link"]
                                : ""
                        }`}
                        key={link.name}
                    >
                        <div className={styles["icon-container"]}>
                            <a href={link.path}>
                                <img
                                    src={icons[link.icon]}
                                    alt={`${link.name} icon`}
                                    className={styles.icon}
                                />
                            </a>
                            {!isCollapsed && (
                                <a
                                    className={styles["collapsed-link"]}
                                    href={link.path}
                                >
                                    {link.name}
                                </a>
                            )}
                        </div>
                    </li>
                ))}
                {admin.role === "Admin" && admin.department === "IT" && (
                    <li
                        className={`${styles.links} ${
                            location.pathname === "/moderator"
                                ? styles["active-link"]
                                : ""
                        }`}
                    >
                        <div className={styles["icon-container"]}>
                            <a href="/moderator">
                                <img
                                    src={moderatorIcon}
                                    alt="Moderator icon"
                                    className={styles.icon}
                                />
                            </a>
                            {!isCollapsed && (
                                <a
                                    className={styles["collapsed-link"]}
                                    href="/moderator"
                                >
                                    Moderator
                                </a>
                            )}
                        </div>
                    </li>
                )}
            </div>
            <div className={styles["collapse-button-container"]}>
                <button
                    onClick={toggleCollapse}
                    className={styles["collapse-button"]}
                >
                    {isCollapsed ? ">" : "<"}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
