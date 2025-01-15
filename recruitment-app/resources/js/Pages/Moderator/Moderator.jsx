import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { usePage, Link, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import styles from "../../../css/Moderator.module.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Topbar from "../../Components/Topbar/Topbar";
import Modal from "../../Components/Modal/Modal";
import searchIcon from "../../../images/searchIcon.svg";

const Moderator = () => {
    const {
        admin,
        moderators,
        search: initialSearch,
        sort: initialSort,
    } = usePage().props;

    const [errors, setErrors] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [search, setSearch] = useState(initialSearch || "");
    const [sort, setSort] = useState(initialSort || "Default");
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [search]);
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);

        router.get(
            "/moderator",
            { search, sort: value },
            { preserveState: true, replace: true }
        );
    };
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            router.get(
                "/moderator",
                { search: value },
                { preserveState: true }
            );
        }, 400);
    };
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };
    const closeModal = () => {
        setErrors(false);
        setModalOpen(false);
    };
    const toggleEditModal = (id) => {
        setSelectedAdminId(id);
        setEditModalOpen(!isEditModalOpen);
    };
    const closeEditModal = () => {
        setSelectedAdminId(null);
        setEditModalOpen(false);
    };
    const selectedAdmin = (moderators?.data || []).find(
        (moderator) => moderator.id === selectedAdminId
    );
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        role: "",
        password: "",
        repeat_password: "",
    });

    useEffect(() => {
        if (selectedAdmin) {
            setFormData({
                first_name: selectedAdmin.first_name,
                last_name: selectedAdmin.last_name,
                email: selectedAdmin.email,
                department: selectedAdmin.department,
                role: selectedAdmin.role,
            });
        }
    }, [selectedAdmin]);
    const { data, setData, post, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        role: "Select Role",
        department: "Select Department",
        password: "",
        repeat_password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setErrors(false);
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const validateForm = () => {
        const newErrors = {};

        if (!data.first_name) newErrors.first_name = "First name is required.";
        if (!data.last_name) newErrors.last_name = "Last name is required.";
        if (!data.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (data.role === "Select Role") {
            newErrors.role = "Please select a valid role.";
        }

        if (data.department === "Select Department") {
            newErrors.department = "Please select a valid department.";
        }

        if (!data.password) {
            newErrors.password = "Password is required.";
        } else if (data.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        }

        if (!data.repeat_password) {
            newErrors.repeat_password = "Repeat password is required.";
        } else if (data.password !== data.repeat_password) {
            newErrors.repeat_password = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setModalOpen(false);
            reset();
            post("/moderator");
        }
    };

    const validateEditForm = () => {
        const newErrors = {};

        if (!formData.first_name)
            newErrors.first_name = "First name is required.";
        if (!formData.last_name) newErrors.last_name = "Last name is required.";
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (formData.role === "Select Role") {
            newErrors.role = "Please select a valid role.";
        }

        if (formData.department === "Select Department") {
            newErrors.department = "Please select a valid department.";
        }
        if (formData.password) {
            if (formData.password.length < 8) {
                newErrors.password =
                    "Password must be at least 8 characters long.";
            }
            if (formData.password !== formData.repeat_password) {
                newErrors.repeat_password = "Passwords do not match.";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = () => {
        if (validateEditForm()) {
            setEditModalOpen(false);
            router.put(`/moderator/${selectedAdminId}`, formData, {
                onSuccess: () => {},
                onError: (error) => {
                    console.error("Submission error:", error);
                },
            });
        }
    };
    const toggleDeleteModal = (id) => {
        setSelectedAdminId(id);
        setDeleteModalOpen(!isDeleteModalOpen);
    };
    const closeDeleteModal = () => {
        setSelectedAdminId(null);
        setDeleteModalOpen(false);
    };
    const handleDelete = () => {
        if (selectedAdminId) {
            router.delete(`/moderator/${selectedAdminId}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedAdminId(null);
                },
                onError: () => {},
            });
        }
    };
    return (
        <BrowserRouter>
            <div className={styles.moderator}>
                <Sidebar />
                <div className={styles["moderator-container"]}>
                    <Topbar />
                    <div className={styles["table-container"]}>
                        <table className={styles.table}>
                            <div className={styles["filtering-container"]}>
                                <div className={styles["search-container"]}>
                                    <input
                                        className={styles.search}
                                        ref={searchInputRef}
                                        value={search}
                                        onChange={handleSearchChange}
                                        placeholder="Search here..."
                                    />
                                    <div className={styles["icon-container"]}>
                                        <img
                                            className={styles.icon}
                                            src={searchIcon}
                                            alt={searchIcon}
                                        />
                                    </div>
                                </div>
                                <div className={styles["sort-container"]}>
                                    <select
                                        className={styles.sort}
                                        value={sort}
                                        onChange={handleSortChange}
                                    >
                                        <option value="Default">Default</option>
                                        <option value="IT">IT</option>
                                        <option value="QA">QA</option>
                                        <option value="RT">RT</option>
                                        <option value="TR">TR</option>
                                    </select>
                                    <div
                                        className={
                                            styles["add-modal-container"]
                                        }
                                    >
                                        <button
                                            className={styles["add-modal"]}
                                            onClick={toggleModal}
                                        >
                                            Add Admin
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <thead className={styles.thead}>
                                <tr className={styles.hrow}>
                                    <th className={styles.theader}>Name</th>
                                    <th className={styles.theader}>Email</th>
                                    <th className={styles.theader}>Role</th>
                                    <th className={styles.theader}>
                                        Department
                                    </th>
                                    <th className={styles.theader}>Action</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {moderators.data.map((moderator) => (
                                    <tr
                                        className={styles.trow}
                                        key={moderator.id}
                                    >
                                        <td
                                            className={styles.tdata}
                                            data-label="Name"
                                        >
                                            {moderator.first_name}{" "}
                                            {moderator.last_name}
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Email"
                                        >
                                            {moderator.email}
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Role"
                                        >
                                            {moderator.role}
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Department"
                                        >
                                            {moderator.department}
                                        </td>
                                        <td className={styles.tdata}>
                                            <div
                                                className={
                                                    styles["button-container"]
                                                }
                                            >
                                                <button
                                                    className={styles.edit}
                                                    onClick={() =>
                                                        toggleEditModal(
                                                            moderator.id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={styles.delete}
                                                    onClick={() =>
                                                        toggleDeleteModal(
                                                            moderator.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <div className={styles.pagination}>
                                <div className={styles["pagination-container"]}>
                                    {moderators.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || ""}
                                            className={`${
                                                styles["pagination-link"]
                                            } ${
                                                link.active ? styles.active : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        ></Link>
                                    ))}
                                </div>
                            </div>
                            {isModalOpen && (
                                <Modal isOpen={isModalOpen}>
                                    <div className={styles["modal-container"]}>
                                        <div
                                            className={styles["modal-content"]}
                                        >
                                            <div
                                                className={
                                                    styles["heading-container"]
                                                }
                                            >
                                                <h1
                                                    className={
                                                        styles["modal-header"]
                                                    }
                                                >
                                                    Add Admin
                                                </h1>
                                                <div
                                                    className={
                                                        styles[
                                                            "close-modal-container"
                                                        ]
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "close-modal"
                                                            ]
                                                        }
                                                        onClick={closeModal}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={styles.row}>
                                                <form
                                                    className={styles.form}
                                                    onSubmit={handleSubmit}
                                                >
                                                    <div
                                                        className={
                                                            styles[
                                                                "label-input-container"
                                                            ]
                                                        }
                                                    >
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="firstName"
                                                        >
                                                            First Name
                                                            <input
                                                                name="first_name"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.first_name
                                                                }
                                                                id="firstName"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="text"
                                                            />
                                                            {errors.first_name && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.first_name
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="lastName"
                                                        >
                                                            Last Name
                                                            <input
                                                                name="last_name"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.last_name
                                                                }
                                                                id="lastName"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="text"
                                                            />
                                                            {errors.last_name && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.last_name
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="email"
                                                        >
                                                            Email
                                                            <input
                                                                name="email"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.email
                                                                }
                                                                id="email"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="email"
                                                            />
                                                            {errors.email && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.email
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="department"
                                                        >
                                                            Department
                                                            <select
                                                                name="department"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.department
                                                                }
                                                                id="department"
                                                                className={
                                                                    styles.input
                                                                }
                                                            >
                                                                <option
                                                                    selected
                                                                    disabled
                                                                >
                                                                    Select
                                                                    Department
                                                                </option>
                                                                <option value="IT">
                                                                    IT
                                                                </option>
                                                                <option value="QA">
                                                                    QA
                                                                </option>
                                                                <option value="RT">
                                                                    RT
                                                                </option>
                                                                <option value="TR">
                                                                    TR
                                                                </option>
                                                            </select>
                                                            {errors.department && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.department
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="role"
                                                        >
                                                            Role
                                                            <select
                                                                name="role"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.role
                                                                }
                                                                id="role"
                                                                className={
                                                                    styles.input
                                                                }
                                                            >
                                                                <option
                                                                    selected
                                                                    disabled
                                                                >
                                                                    Select Role
                                                                </option>
                                                                <option value="Admin">
                                                                    Admin
                                                                </option>
                                                                <option value="Specialist">
                                                                    Specialist
                                                                </option>
                                                            </select>
                                                            {errors.role && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.role
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="password"
                                                        >
                                                            Password
                                                            <input
                                                                name="password"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.password
                                                                }
                                                                id="password"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="password"
                                                            />
                                                            {errors.password && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.password
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="repeatPassword"
                                                        >
                                                            Repeat Password
                                                            <input
                                                                name="repeat_password"
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                value={
                                                                    data.repeat_password
                                                                }
                                                                id="repeatPassword"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="password"
                                                            />
                                                            {errors.repeat_password && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.repeat_password
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles[
                                                                "button-container"
                                                            ]
                                                        }
                                                    >
                                                        <button
                                                            className={
                                                                styles.button
                                                            }
                                                            type="submit"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                            {isDeleteModalOpen && selectedAdmin && (
                                <Modal
                                    isOpen={isDeleteModalOpen}
                                    adminId={selectedAdminId}
                                >
                                    <div
                                        className={`${styles["modal-container"]} ${styles["delete-container"]}`}
                                    >
                                        <div
                                            className={styles["modal-content"]}
                                        >
                                            <div
                                                className={
                                                    styles["heading-container"]
                                                }
                                            >
                                                <h1
                                                    className={`${styles["modal-header"]} ${styles["delete-header"]}`}
                                                >
                                                    Are you sure you want to
                                                    delete admin "
                                                    {selectedAdmin.first_name}"?
                                                </h1>
                                            </div>
                                            <div
                                                className={`${styles["button-container"]} ${styles["delete-button-container"]}`}
                                            >
                                                <button
                                                    className={styles.cancel}
                                                    onClick={closeDeleteModal}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.confirm}
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                            {isEditModalOpen && selectedAdmin && (
                                <Modal
                                    isOpen={isEditModalOpen}
                                    adminId={selectedAdminId}
                                >
                                    <div className={styles["modal-container"]}>
                                        <div
                                            className={styles["modal-content"]}
                                        >
                                            <div
                                                className={
                                                    styles["heading-container"]
                                                }
                                            >
                                                <h1
                                                    className={
                                                        styles["modal-header"]
                                                    }
                                                >
                                                    Edit Admin
                                                </h1>
                                                <div
                                                    className={
                                                        styles[
                                                            "close-modal-container"
                                                        ]
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "close-modal"
                                                            ]
                                                        }
                                                        onClick={closeEditModal}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={styles.row}>
                                                <form className={styles.form}>
                                                    <div
                                                        className={
                                                            styles[
                                                                "label-input-container"
                                                            ]
                                                        }
                                                    >
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="firstName"
                                                        >
                                                            First Name
                                                            <input
                                                                name="first_name"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.first_name
                                                                }
                                                                id="firstName"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="text"
                                                            />
                                                            {errors.first_name && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.first_name
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="lastName"
                                                        >
                                                            Last Name
                                                            <input
                                                                name="last_name"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.last_name
                                                                }
                                                                id="lastName"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="text"
                                                            />
                                                            {errors.last_name && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.last_name
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="email"
                                                        >
                                                            Email
                                                            <input
                                                                name="email"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.email
                                                                }
                                                                id="email"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="email"
                                                            />
                                                            {errors.email && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.email
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="department"
                                                        >
                                                            Department
                                                            <select
                                                                name="department"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.department
                                                                }
                                                                id="department"
                                                                className={
                                                                    styles.input
                                                                }
                                                            >
                                                                <option
                                                                    selected
                                                                    disabled
                                                                >
                                                                    Select
                                                                    Department
                                                                </option>
                                                                <option value="IT">
                                                                    IT
                                                                </option>
                                                                <option value="QA">
                                                                    QA
                                                                </option>
                                                                <option value="RT">
                                                                    RT
                                                                </option>
                                                                <option value="TR">
                                                                    TR
                                                                </option>
                                                            </select>
                                                            {errors.department && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.department
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="role"
                                                        >
                                                            Role
                                                            <select
                                                                name="role"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.role
                                                                }
                                                                id="role"
                                                                className={
                                                                    styles.input
                                                                }
                                                            >
                                                                <option
                                                                    selected
                                                                    disabled
                                                                >
                                                                    Select Role
                                                                </option>
                                                                <option value="Admin">
                                                                    Admin
                                                                </option>
                                                                <option value="Specialist">
                                                                    Specialist
                                                                </option>
                                                            </select>
                                                            {errors.role && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.role
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="password"
                                                        >
                                                            Password
                                                            <input
                                                                name="password"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.password ||
                                                                    ""
                                                                }
                                                                id="password"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="password"
                                                            />
                                                            {errors.password && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.password
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                        <label
                                                            className={
                                                                styles[
                                                                    "input-label"
                                                                ]
                                                            }
                                                            htmlFor="repeatPassword"
                                                        >
                                                            Repeat Password
                                                            <input
                                                                name="repeat_password"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    formData.repeat_password ||
                                                                    ""
                                                                }
                                                                id="repeatPassword"
                                                                className={
                                                                    styles.input
                                                                }
                                                                type="password"
                                                            />
                                                            {errors.repeat_password && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.repeat_password
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles[
                                                                "button-container"
                                                            ]
                                                        }
                                                    >
                                                        <button
                                                            className={
                                                                styles.button
                                                            }
                                                            type="button"
                                                            onClick={handleEdit}
                                                        >
                                                            Update
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Moderator;
