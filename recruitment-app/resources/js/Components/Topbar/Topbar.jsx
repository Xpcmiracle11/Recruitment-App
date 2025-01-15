import React, { useState } from "react";
import styles from "../../../css/Topbar.module.css";
import { Inertia } from "@inertiajs/inertia";
import more from "../../../images/more.svg";
import Modal from "../Modal/Modal";
import sad from "../../../images/sad.svg";
import { usePage } from "@inertiajs/react";

const Topbar = () => {
    const { props } = usePage();
    const admin = props.admin;
    const handleLogout = () => {
        Inertia.post("/logout");
    };
    const handleDecline = () => {
        setModalOpen(false);
    };
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };
    return (
        <div className={styles.topbar}>
            <div className={styles["topbar-container"]}>
                <div className={styles["admin-container"]}>
                    <h1 className={styles["admin-first-name"]}>
                        {admin.first_name} {admin.last_name}
                    </h1>
                    <h1 className={styles["admin-role"]}>
                        {admin.department} {admin.role}
                    </h1>
                </div>
                <div className={styles["dropdown-container"]}>
                    <button
                        className={styles.dropdown}
                        onClick={toggleDropdown}
                    >
                        <img
                            className={styles.more}
                            src={more}
                            alt="More options"
                        />
                    </button>
                </div>
                {isOpen && (
                    <div className={styles["logout-container"]}>
                        <button
                            className={styles["logout-button"]}
                            onClick={toggleModal}
                        >
                            Log-out
                        </button>
                    </div>
                )}
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    <div className={styles["modal-container"]}>
                        <div className={styles["modal-content"]}>
                            <div className={styles["image-container"]}>
                                <img
                                    className={styles.image}
                                    src={sad}
                                    alt={sad}
                                />
                            </div>
                            <h1 className={styles["modal-message"]}>
                                Are you sure you want to log out?
                            </h1>
                            <div className={styles["button-container"]}>
                                <button
                                    type="button"
                                    className={`${styles.decline} ${styles.button}`}
                                    onClick={handleDecline}
                                >
                                    Decline
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.confirm} ${styles.button}`}
                                    onClick={handleLogout}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Topbar;
