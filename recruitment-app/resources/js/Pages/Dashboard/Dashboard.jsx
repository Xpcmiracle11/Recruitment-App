import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import styles from "../../../css/Dashboard.module.css";
import exportIcon from "../../../images/export.svg";
import searchIcon from "../../../images/searchIcon.svg";
import places from "../../../js/philippines";
import Modal from "../../Components/Modal/Modal";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Topbar from "../../Components/Topbar/Topbar";
import excelIcon from "../../../images/excel-icon.svg";
import pdfIcon from "../../../images/pdf-icon.svg";
const Dashboard = () => {
    const {
        admin,
        applicants,
        years,
        months,
        search: initialSearch,
        sort: initialSort,
    } = usePage().props;

    const [isModalOpen, setModalOpen] = useState(false);
    const [isDownloadModalOpen, setDownlaodModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [search, setSearch] = useState(initialSearch || "");
    const [sort, setSort] = useState(initialSort || "Default");
    const searchInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [year, setYear] = useState("Select Year");
    const [month, setMonth] = useState("Select Month");
    const [status, setStatus] = useState("Select Status");
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");

    const [editFormData, setEditFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        region: "",
        province: "",
        municipality: "",
        barangay: "",
        street: "",
        zip: "",
        phone_number: "",
        email: "",
        gender: "",
        dob: "",
        age: "",
        educational_attainment: "",
        institution_name: "",
        course: "",
        start_date: "",
        end_date: "",
        gpa: "",
        source: "",
        other_source: "",
        sourcer: "",
        other_sourcer: "",
        previous_employee: "",
        recruiter: "",
        bpo_experience: "",
    });

    const regions = Object.keys(places).map((key) => ({
        code: key,
        name: places[key].region_name,
    }));

    const provinces =
        (editFormData.region || selectedRegion) &&
        places[editFormData.region || selectedRegion]
            ? Object.keys(
                  places[editFormData.region || selectedRegion].province_list
              )
            : [];

    const municipalities =
        (editFormData.province || selectedProvince) &&
        (editFormData.region || selectedRegion) &&
        places[editFormData.region || selectedRegion]?.province_list[
            editFormData.province || selectedProvince
        ]
            ? Object.keys(
                  places[editFormData.region || selectedRegion].province_list[
                      editFormData.province || selectedProvince
                  ].municipality_list
              )
            : [];

    const barangays =
        (editFormData.municipality || selectedMunicipality) &&
        (editFormData.province || selectedProvince) &&
        (editFormData.region || selectedRegion) &&
        places[editFormData.region || selectedRegion]?.province_list[
            editFormData.province || selectedProvince
        ]?.municipality_list[editFormData.municipality || selectedMunicipality]
            ? places[editFormData.region || selectedRegion].province_list[
                  editFormData.province || selectedProvince
              ].municipality_list[
                  editFormData.municipality || selectedMunicipality
              ].barangay_list
            : [];

    const handleRegionChange = (e) => {
        const regionValue = e.target.value;
        setSelectedRegion(regionValue);
        setEditFormData((prevData) => ({
            ...prevData,
            region: regionValue,
            province: "",
            municipality: "",
            barangay: "",
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceValue = e.target.value;
        setSelectedProvince(provinceValue);
        setEditFormData((prevData) => ({
            ...prevData,
            province: provinceValue,
            municipality: "",
            barangay: "",
        }));
    };

    const handleMunicipalityChange = (e) => {
        const municipalityValue = e.target.value;
        setSelectedMunicipality(municipalityValue);
        setEditFormData((prevData) => ({
            ...prevData,
            municipality: municipalityValue,
            barangay: "",
        }));
    };

    const [dob, setDob] = useState("");

    useEffect(() => {
        if (dob) {
            const calculatedAge = calculateAge(dob);
            setEditFormData((prevData) => ({
                ...prevData,
                age: calculatedAge,
            }));
        }
    }, [dob]);

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const handleDobChange = (e) => {
        const selectedDate = e.target.value;
        setDob(selectedDate);
        setEditFormData((prevData) => ({
            ...prevData,
            dob: selectedDate,
        }));
    };

    const handleDownloadPDF = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post("/dashboard/export", {
                year,
                month,
                status,
            });

            if (response.status === 200) {
                const params = new URLSearchParams({
                    year,
                    month,
                    status,
                }).toString();
                window.open(
                    `/dashboard/export/downloadPDF?${params}`,
                    "_blank"
                );
                setDownlaodModalOpen(false);
                setYear("Select Year");
                setMonth("Select Month");
                setStatus("Select Status");
            }
        } catch (error) {
            console.error("Export preparation failed", error);
            alert(
                "An error occurred while preparing the export. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadExcel = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post("/dashboard/export", {
                year,
                month,
                status,
            });

            if (response.status === 200) {
                const params = new URLSearchParams({
                    year,
                    month,
                    status,
                }).toString();
                window.open(
                    `/dashboard/export/downloadExcel?${params}`,
                    "_blank"
                );
                setDownlaodModalOpen(false);
                setYear("Select Year");
                setMonth("Select Month");
                setStatus("Select Status");
            }
        } catch (error) {
            console.error("Export preparation failed", error);
            alert(
                "An error occurred while preparing the export. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [search]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value);

        router.get(
            "/dashboard",
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
                "/dashboard",
                { search: value },
                { preserveState: true }
            );
        }, 400);
    };
    const toggleModal = (id) => {
        setSelectedApplicationId(id);
        setModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setSelectedApplicationId(null);
        setModalOpen(false);
    };

    const toggleModalDownload = () => {
        setDownlaodModalOpen(!isDownloadModalOpen);
    };

    const closeDownlaodModal = () => {
        setDownlaodModalOpen(false);
        setYear("Select Year");
        setMonth("Select Month");
        setStatus("Select Status");
    };

    const toggleEditModal = (id) => {
        setSelectedApplicationId(id);
        setEditModalOpen(!isEditModalOpen);
    };
    const closeEditModal = () => {
        setSelectedApplicationId(null);
        setEditModalOpen(false);
    };

    const toggleDeleteModal = (id) => {
        setSelectedApplicationId(id);
        setDeleteModalOpen(!isDeleteModalOpen);
    };

    const closeDeleteModal = () => {
        setSelectedApplicationId(null);
        setDeleteModalOpen(false);
    };

    const selectedApplicant = (applicants?.data || []).find(
        (applicant) => applicant.application_status_id === selectedApplicationId
    );
    useEffect(() => {
        if (selectedApplicant) {
            setEditFormData({
                first_name: selectedApplicant.first_name,
                middle_name: selectedApplicant.middle_name,
                last_name: selectedApplicant.last_name,
                suffix: selectedApplicant.suffix,
                region: selectedApplicant.region,
                province: selectedApplicant.province,
                municipality: selectedApplicant.municipality,
                barangay: selectedApplicant.barangay,
                street: selectedApplicant.street,
                zip: selectedApplicant.zip,
                phone_number: selectedApplicant.phone_number,
                email: selectedApplicant.email,
                gender: selectedApplicant.gender,
                dob: selectedApplicant.dob,
                age: selectedApplicant.age,
                educational_attainment:
                    selectedApplicant.educational_attainment,
                institution_name: selectedApplicant.institution_name,
                course: selectedApplicant.course,
                start_date: selectedApplicant.start_date,
                end_date: selectedApplicant.end_date,
                gpa: selectedApplicant.gpa,
                source: selectedApplicant.source,
                other_source: selectedApplicant.other_source,
                sourcer: selectedApplicant.sourcer,
                other_sourcer: selectedApplicant.other_sourcer,
                previous_employee: selectedApplicant.previous_employee,
                recruiter: selectedApplicant.recruiter,
                bpo_experience: selectedApplicant.bpo_experience,
            });
        }
    }, [selectedApplicant]);

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateEditForm = () => {
        const newErrors = {};
        if (!editFormData.first_name)
            newErrors.first_name = "First name is required.";
        if (!editFormData.last_name)
            newErrors.last_name = "Last name is required.";
        if (!editFormData.zip) newErrors.zip = "Zip is required.";
        if (!editFormData.phone_number)
            newErrors.phone_number = "Phone number is required.";
        if (!editFormData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = () => {
        if (validateEditForm()) {
            setEditModalOpen(false);
            router.put(
                `/dashboard/application/${selectedApplicant.id}/personal-info`,
                editFormData,
                {
                    onSuccess: () => {},
                    onError: (error) => {
                        console.error("Submission error:", error);
                    },
                }
            );
        }
    };

    const handleDelete = () => {
        if (selectedApplicant.id) {
            router.delete(`/dashboard/${selectedApplicant.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedApplicationId(null);
                },
                onError: () => {},
            });
        }
    };

    const [formData, setFormData] = useState({
        firstCall: "Select an Option",
        secondCall: "Select an Option",
        thirdCall: "Select an Option",
        communication: "Select an Option",
        reading: "Select an Option",
        typing: "Select an Option",
        problemSolving: "Select an Option",
        workEthics: "Select an Option",
        budgetIssues: "Select an Option",
        status: "Select an Option",
        remarks: "Select an Option",
    });
    const [errors, setErrors] = useState({});

    const [visibility, setVisibility] = useState({
        secondCallVisible: false,
        thirdCallVisible: false,
        otherFieldsVisible: false,
    });

    useEffect(() => {
        if (selectedApplicant) {
            setVisibility({
                secondCallVisible: selectedApplicant.first_call === "No Answer",
                thirdCallVisible: selectedApplicant.second_call === "No Answer",
                otherFieldsVisible:
                    selectedApplicant.first_call === "Answered" ||
                    selectedApplicant.second_call === "Answered" ||
                    selectedApplicant.third_call === "Answered",
            });
            setFormData({
                firstCall: selectedApplicant.first_call || "Select an Option",
                secondCall: selectedApplicant.second_call || "Select an Option",
                thirdCall: selectedApplicant.third_call || "Select an Option",
                communication:
                    selectedApplicant.communication || "Select an Option",
                reading: selectedApplicant.reading || "Select an Option",
                typing: selectedApplicant.typing || "Select an Option",
                problemSolving:
                    selectedApplicant.problem_solving || "Select an Option",
                workEthics: selectedApplicant.work_ethics || "Select an Option",
                budgetIssues:
                    selectedApplicant.budget_issues || "Select an Option",
                status:
                    selectedApplicant.status === "Pending"
                        ? "Select an Option"
                        : selectedApplicant.status || "",
                remarks: selectedApplicant.remarks || "",
            });

            if (selectedApplicant.first_call === "No Answer") {
                setVisibility((prev) => ({
                    ...prev,
                    secondCallVisible: true,
                    thirdCallVisible: false,
                }));
            } else if (selectedApplicant.first_call === "Answered") {
                setVisibility((prev) => ({
                    ...prev,
                    secondCallVisible: false,
                    thirdCallVisible: false,
                    otherFieldsVisible: true,
                }));
            }

            if (selectedApplicant.second_call === "No Answer") {
                setVisibility((prev) => ({
                    ...prev,
                    thirdCallVisible: true,
                }));
            } else if (selectedApplicant.second_call === "Answered") {
                setVisibility((prev) => ({
                    ...prev,
                    thirdCallVisible: false,
                }));
            }
        }
    }, [selectedApplicant]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveClick = () => {
        const newErrors = {};

        if (
            formData["firstCall"] === "Select an Option" ||
            formData["firstCall"] === null ||
            formData["firstCall"].trim() === ""
        ) {
            newErrors["firstCall"] = "This field is required";
        }
        if (visibility.secondCallVisible) {
            if (
                formData["secondCall"] === "Select an Option" ||
                formData["secondCall"] === null ||
                formData["secondCall"].trim() === ""
            ) {
                newErrors["secondCall"] = "This field is required";
            }
        }

        if (visibility.thirdCallVisible) {
            if (
                formData["thirdCall"] === "Select an Option" ||
                formData["thirdCall"] === null ||
                formData["thirdCall"].trim() === ""
            ) {
                newErrors["thirdCall"] = "This field is required";
            }
        }

        if (visibility.otherFieldsVisible) {
            const requiredFields = [
                "reading",
                "typing",
                "problemSolving",
                "workEthics",
                "budgetIssues",
                "status",
                "remarks",
            ];

            requiredFields.forEach((field) => {
                if (
                    formData[field] === "Select an Option" ||
                    formData[field] === null ||
                    formData[field].trim() === ""
                ) {
                    newErrors[field] = "This field is required";
                }
            });
        }
        const transformedFormData = {
            ...formData,
            firstCall:
                formData.firstCall === "Select an Option"
                    ? null
                    : formData.firstCall,
            secondCall:
                formData.secondCall === "Select an Option"
                    ? null
                    : formData.secondCall,
            thirdCall:
                formData.thirdCall === "Select an Option"
                    ? null
                    : formData.thirdCall,
            communication:
                formData.communication === "Select an Option"
                    ? null
                    : formData.communication,
            reading:
                formData.reading === "Select an Option"
                    ? null
                    : formData.reading,
            typing:
                formData.typing === "Select an Option" ? null : formData.typing,
            problemSolving:
                formData.problemSolving === "Select an Option"
                    ? null
                    : formData.problemSolving,
            workEthics:
                formData.workEthics === "Select an Option"
                    ? null
                    : formData.workEthics,
            budgetIssues:
                formData.budgetIssues === "Select an Option"
                    ? null
                    : formData.budgetIssues,
            status:
                formData.status === "Select an Option"
                    ? "Pending"
                    : formData.status,
            remarks: formData.remarks,
        };
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        router.put(
            `/dashboard/application/${selectedApplicationId}/status`,
            transformedFormData,
            {
                onSuccess: () => {},
                onError: (error) => {
                    console.error("Submission error:", error);
                },
            }
        );
    };

    const isInputsValid =
        year !== "Select Year" &&
        month !== "Select Month" &&
        status !== "Select Status" &&
        year &&
        month &&
        status;

    return (
        <BrowserRouter>
            <div className={styles.dashboard}>
                <Sidebar />
                <div className={styles["dashboard-container"]}>
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
                                        <option value="Passed">Passed</option>
                                        <option value="Failed">Failed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Answered">
                                            Answered
                                        </option>
                                        <option value="No Answer">
                                            No Answer
                                        </option>
                                    </select>
                                    {(admin.department === "IT" &&
                                        (admin.role === "Specialist" ||
                                            admin.role === "Admin")) ||
                                    (admin.department === "Recruitment" &&
                                        admin.role === "Admin") ||
                                    (admin.department === "RT" &&
                                        admin.role === "Admin") ? (
                                        <div
                                            className={
                                                styles["export-icon-container"]
                                            }
                                        >
                                            <button
                                                className={styles.export}
                                                onClick={toggleModalDownload}
                                            >
                                                <img
                                                    className={
                                                        styles["export-icon"]
                                                    }
                                                    src={exportIcon}
                                                    alt="Export Icon"
                                                />
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <thead className={styles.thead}>
                                <tr className={styles.hrow}>
                                    <th className={styles.theader}>Name</th>
                                    <th className={styles.theader}>Status</th>
                                    <th className={styles.theader}>Phone</th>
                                    <th className={styles.theader}>Email</th>
                                    <th className={styles.theader}>Date</th>
                                    <th
                                        className={`${styles.theader} ${styles["action-theader"]}`}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tbody}>
                                {applicants.data.map((applicant) => (
                                    <tr
                                        className={styles.trow}
                                        key={applicant.id}
                                    >
                                        <td
                                            className={styles.tdata}
                                            data-label="Name"
                                        >
                                            {applicant.first_name}{" "}
                                            {applicant.last_name}
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Status"
                                        >
                                            <h1
                                                className={(() => {
                                                    if (
                                                        applicant.status ===
                                                            "Failed" ||
                                                        applicant.status ===
                                                            "Passed"
                                                    ) {
                                                        return styles[
                                                            applicant.status ===
                                                            "Failed"
                                                                ? "status-tdata-failed"
                                                                : "status-tdata-passed"
                                                        ];
                                                    }
                                                    if (
                                                        applicant.third_call ===
                                                        "Answered"
                                                    ) {
                                                        return styles[
                                                            "status-tdata-answered"
                                                        ];
                                                    } else if (
                                                        applicant.third_call ===
                                                        "No Answer"
                                                    ) {
                                                        return styles[
                                                            "status-tdata-no-answer"
                                                        ];
                                                    }

                                                    if (
                                                        applicant.second_call ===
                                                        "Answered"
                                                    ) {
                                                        return styles[
                                                            "status-tdata-answered"
                                                        ];
                                                    } else if (
                                                        applicant.second_call ===
                                                        "No Answer"
                                                    ) {
                                                        return styles[
                                                            "status-tdata-no-answer"
                                                        ];
                                                    }

                                                    if (
                                                        applicant.first_call ===
                                                        "Answered"
                                                    ) {
                                                        return styles[
                                                            "status-tdata-answered"
                                                        ];
                                                    } else if (
                                                        applicant.first_call ===
                                                        "No Answer"
                                                    ) {
                                                        return styles[
                                                            "status-tdata-no-answer"
                                                        ];
                                                    }

                                                    return styles[
                                                        "status-tdata-pending"
                                                    ];
                                                })()}
                                            >
                                                {(() => {
                                                    if (
                                                        applicant.status ===
                                                            "Failed" ||
                                                        applicant.status ===
                                                            "Passed"
                                                    ) {
                                                        return `${applicant.status}`;
                                                    }

                                                    if (
                                                        applicant.third_call ===
                                                            "Answered" ||
                                                        applicant.third_call ===
                                                            "No Answer"
                                                    ) {
                                                        return `3rd Call ${applicant.third_call}`;
                                                    }

                                                    if (
                                                        applicant.second_call ===
                                                            "Answered" ||
                                                        applicant.second_call ===
                                                            "No Answer"
                                                    ) {
                                                        return `2nd Call ${applicant.second_call}`;
                                                    }

                                                    if (
                                                        applicant.first_call ===
                                                            "Answered" ||
                                                        applicant.first_call ===
                                                            "No Answer"
                                                    ) {
                                                        return `1st Call ${applicant.first_call}`;
                                                    }

                                                    return "Pending";
                                                })()}
                                            </h1>
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Phone Number"
                                        >
                                            {applicant.phone_number}
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Email"
                                        >
                                            {applicant.email}
                                        </td>
                                        <td
                                            className={styles.tdata}
                                            data-label="Date"
                                        >
                                            {new Date(
                                                applicant.date
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className={styles.tdata}>
                                            <div
                                                className={
                                                    styles[
                                                        "view-button-container"
                                                    ]
                                                }
                                            >
                                                <button
                                                    className={styles.view}
                                                    onClick={() =>
                                                        toggleModal(
                                                            applicant.application_status_id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {((admin.department === "RT" &&
                                                    admin.role === "Admin") ||
                                                    (admin.department ===
                                                        "IT" &&
                                                        (admin.role ===
                                                            "Admin" ||
                                                            admin.role ===
                                                                "Specialist"))) && (
                                                    <>
                                                        <button
                                                            className={
                                                                styles.edit
                                                            }
                                                            onClick={() =>
                                                                toggleEditModal(
                                                                    applicant.application_status_id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className={
                                                                styles.delete
                                                            }
                                                            onClick={() =>
                                                                toggleDeleteModal(
                                                                    applicant.application_status_id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <div className={styles.pagination}>
                                <div className={styles["pagination-container"]}>
                                    {applicants.links.map((link, index) => (
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
                        </table>
                        {isModalOpen && selectedApplicant && (
                            <Modal
                                isOpen={isModalOpen}
                                applicationStatusId={selectedApplicationId}
                            >
                                <div className={styles["modal-container"]}>
                                    <div
                                        className={styles["modal-content"]}
                                        key={selectedApplicant.id}
                                    >
                                        <div
                                            className={
                                                styles["heading-container"]
                                            }
                                        >
                                            <h1
                                                className={(() => {
                                                    if (
                                                        selectedApplicant.status ===
                                                            "Failed" ||
                                                        selectedApplicant.status ===
                                                            "Passed"
                                                    ) {
                                                        return styles[
                                                            selectedApplicant.status ===
                                                            "Failed"
                                                                ? "modal-header-failed"
                                                                : "modal-header-passed"
                                                        ];
                                                    }
                                                    if (
                                                        selectedApplicant.third_call ===
                                                        "Answered"
                                                    ) {
                                                        return styles[
                                                            "modal-header-answered"
                                                        ];
                                                    } else if (
                                                        selectedApplicant.third_call ===
                                                        "No Answer"
                                                    ) {
                                                        return styles[
                                                            "modal-header-no-answer"
                                                        ];
                                                    }

                                                    if (
                                                        selectedApplicant.second_call ===
                                                        "Answered"
                                                    ) {
                                                        return styles[
                                                            "modal-header-answered"
                                                        ];
                                                    } else if (
                                                        selectedApplicant.second_call ===
                                                        "No Answer"
                                                    ) {
                                                        return styles[
                                                            "modal-header-no-answer"
                                                        ];
                                                    }
                                                    if (
                                                        selectedApplicant.first_call ===
                                                        "Answered"
                                                    ) {
                                                        return styles[
                                                            "modal-header-answered"
                                                        ];
                                                    } else if (
                                                        selectedApplicant.first_call ===
                                                        "No Answer"
                                                    ) {
                                                        return styles[
                                                            "modal-header-no-answer"
                                                        ];
                                                    }
                                                    return styles[
                                                        "modal-header-pending"
                                                    ];
                                                })()}
                                            >
                                                {(() => {
                                                    if (
                                                        selectedApplicant.status ===
                                                            "Failed" ||
                                                        selectedApplicant.status ===
                                                            "Passed"
                                                    ) {
                                                        return `${selectedApplicant.status}`;
                                                    }
                                                    if (
                                                        selectedApplicant.third_call ===
                                                            "Answered" ||
                                                        selectedApplicant.third_call ===
                                                            "No Answer"
                                                    ) {
                                                        return `3rd Call ${selectedApplicant.third_call}`;
                                                    }

                                                    if (
                                                        selectedApplicant.second_call ===
                                                            "Answered" ||
                                                        selectedApplicant.second_call ===
                                                            "No Answer"
                                                    ) {
                                                        return `2nd Call ${selectedApplicant.second_call}`;
                                                    }

                                                    if (
                                                        selectedApplicant.first_call ===
                                                            "Answered" ||
                                                        selectedApplicant.first_call ===
                                                            "No Answer"
                                                    ) {
                                                        return `1st Call ${selectedApplicant.first_call}`;
                                                    }
                                                    return "Pending";
                                                })()}
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
                                                        styles["close-modal"]
                                                    }
                                                    onClick={closeModal}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.row}>
                                            <h1
                                                className={
                                                    styles["content-header"]
                                                }
                                            >
                                                Personal Information
                                            </h1>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Name:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.first_name
                                                    }{" "}
                                                    {
                                                        selectedApplicant.last_name
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Address:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.province}
                                                    {", "}
                                                    {
                                                        selectedApplicant.municipality
                                                    }
                                                    {", "}
                                                    {selectedApplicant.barangay}
                                                    {", "}
                                                    {selectedApplicant.zip}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Phone Number:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.phone_number
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Email:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.email}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Gender:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.gender}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Date of Birth:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {new Date(
                                                        selectedApplicant.dob
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Age:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.age}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <h1
                                                className={
                                                    styles["content-header"]
                                                }
                                            >
                                                Educational Background
                                            </h1>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Educational Attainment:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.educational_attainment
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Institution Name:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.institution_name
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Course:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.course}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Start and End Date:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {new Date(
                                                        selectedApplicant.start_date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}{" "}
                                                    {" to "}
                                                    {new Date(
                                                        selectedApplicant.end_date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    GPA:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.gpa}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <h1
                                                className={
                                                    styles["content-header"]
                                                }
                                            >
                                                Application Information
                                            </h1>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Source:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.source ??
                                                        selectedApplicant.other_source}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Sourcer:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.sourcer ??
                                                        selectedApplicant.other_sourcer}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Previous Employee:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.previous_employee
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Recruiter:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.recruiter
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    BPO Experience:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.bpo_experience
                                                    }
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Application Method:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {
                                                        selectedApplicant.application_method
                                                    }
                                                </p>
                                            </div>
                                            {selectedApplicant.application_method !==
                                                "Walk-in" && (
                                                <div
                                                    className={
                                                        styles[
                                                            "label-description-container"
                                                        ]
                                                    }
                                                >
                                                    <p className={styles.label}>
                                                        Resume:
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.description
                                                        }
                                                    >
                                                        {
                                                            selectedApplicant.resume
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Skills:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {selectedApplicant.skillset}
                                                </p>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "label-description-container"
                                                    ]
                                                }
                                            >
                                                <p className={styles.label}>
                                                    Date of Application:
                                                </p>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {new Date(
                                                        selectedApplicant.created_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.row}>
                                            <form className={styles.form}>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="firstCall"
                                                    >
                                                        First Call
                                                        <select
                                                            className={
                                                                styles.input
                                                            }
                                                            id="firstCall"
                                                            name="firstCall"
                                                            value={
                                                                formData.firstCall
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            disabled={
                                                                selectedApplicant.first_call ===
                                                                    "Answered" ||
                                                                selectedApplicant.first_call ===
                                                                    "No Answer" ||
                                                                admin.department !==
                                                                    "RT"
                                                            }
                                                        >
                                                            <option
                                                                disabled
                                                                selected
                                                            >
                                                                Select an Option
                                                            </option>
                                                            <option value="Answered">
                                                                Answered
                                                            </option>
                                                            <option value="No Answer">
                                                                No Answer
                                                            </option>
                                                        </select>
                                                        {errors.firstCall && (
                                                            <p
                                                                className={
                                                                    styles[
                                                                        "error-message"
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    errors.firstCall
                                                                }
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>
                                                {visibility.secondCallVisible && (
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
                                                            htmlFor="secondCall"
                                                        >
                                                            Second Call
                                                            <select
                                                                className={
                                                                    styles.input
                                                                }
                                                                id="secondCall"
                                                                name="secondCall"
                                                                value={
                                                                    formData.secondCall
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                disabled={
                                                                    selectedApplicant.second_call ===
                                                                        "Answered" ||
                                                                    selectedApplicant.second_call ===
                                                                        "No Answer" ||
                                                                    admin.department !==
                                                                        "RT"
                                                                }
                                                            >
                                                                <option
                                                                    disabled
                                                                    selected
                                                                >
                                                                    Select an
                                                                    Option
                                                                </option>
                                                                <option value="Answered">
                                                                    Answered
                                                                </option>
                                                                <option value="No Answer">
                                                                    No Answer
                                                                </option>
                                                            </select>
                                                            {errors.secondCall && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.secondCall
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                )}
                                                {visibility.thirdCallVisible && (
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
                                                            htmlFor="thirdCall"
                                                        >
                                                            Third Call
                                                            <select
                                                                className={
                                                                    styles.input
                                                                }
                                                                id="thirdCall"
                                                                name="thirdCall"
                                                                value={
                                                                    formData.thirdCall
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                disabled={
                                                                    selectedApplicant.third_call ===
                                                                        "Answered" ||
                                                                    selectedApplicant.third_call ===
                                                                        "No Answer" ||
                                                                    admin.department !==
                                                                        "RT"
                                                                }
                                                            >
                                                                <option
                                                                    disabled
                                                                    selected
                                                                >
                                                                    Select an
                                                                    Option
                                                                </option>
                                                                <option value="Answered">
                                                                    Answered
                                                                </option>
                                                                <option value="No Answer">
                                                                    No Answer
                                                                </option>
                                                            </select>
                                                            {errors.thirdCall && (
                                                                <p
                                                                    className={
                                                                        styles[
                                                                            "error-message"
                                                                        ]
                                                                    }
                                                                >
                                                                    {
                                                                        errors.thirdCall
                                                                    }
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                )}
                                                {visibility.otherFieldsVisible && (
                                                    <div
                                                        className={
                                                            styles[
                                                                "other-fields"
                                                            ]
                                                        }
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
                                                                htmlFor="communication"
                                                            >
                                                                Communication
                                                                <select
                                                                    className={
                                                                        styles.input
                                                                    }
                                                                    id="communication"
                                                                    name="communication"
                                                                    value={
                                                                        formData.communication
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    disabled={
                                                                        selectedApplicant.communication ===
                                                                            "Yes" ||
                                                                        selectedApplicant.communication ===
                                                                            "No" ||
                                                                        admin.department !==
                                                                            "RT"
                                                                    }
                                                                >
                                                                    <option
                                                                        disabled
                                                                        selected
                                                                    >
                                                                        Select
                                                                        an
                                                                        Option
                                                                    </option>
                                                                    <option value="Yes">
                                                                        Yes
                                                                    </option>
                                                                    <option value="No">
                                                                        No
                                                                    </option>
                                                                </select>
                                                                {errors.communication && (
                                                                    <p
                                                                        className={
                                                                            styles[
                                                                                "error-message"
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            errors.communication
                                                                        }
                                                                    </p>
                                                                )}
                                                            </label>
                                                        </div>
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
                                                                htmlFor="reading"
                                                            >
                                                                Reading
                                                                <select
                                                                    className={
                                                                        styles.input
                                                                    }
                                                                    id="reading"
                                                                    name="reading"
                                                                    value={
                                                                        formData.reading
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    disabled={
                                                                        selectedApplicant.reading ===
                                                                            "Yes" ||
                                                                        selectedApplicant.reading ===
                                                                            "No" ||
                                                                        admin.department !==
                                                                            "RT"
                                                                    }
                                                                >
                                                                    <option
                                                                        disabled
                                                                        selected
                                                                    >
                                                                        Select
                                                                        an
                                                                        Option
                                                                    </option>
                                                                    <option value="Yes">
                                                                        Yes
                                                                    </option>
                                                                    <option value="No">
                                                                        No
                                                                    </option>
                                                                </select>
                                                                {errors.reading && (
                                                                    <p
                                                                        className={
                                                                            styles[
                                                                                "error-message"
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            errors.reading
                                                                        }
                                                                    </p>
                                                                )}
                                                            </label>
                                                        </div>
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
                                                                htmlFor="typing"
                                                            >
                                                                Typing
                                                                <select
                                                                    className={
                                                                        styles.input
                                                                    }
                                                                    id="typing"
                                                                    name="typing"
                                                                    value={
                                                                        formData.typing
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    disabled={
                                                                        selectedApplicant.typing ===
                                                                            "Yes" ||
                                                                        selectedApplicant.typing ===
                                                                            "No" ||
                                                                        admin.department !==
                                                                            "RT"
                                                                    }
                                                                >
                                                                    <option
                                                                        disabled
                                                                        selected
                                                                    >
                                                                        Select
                                                                        an
                                                                        Option
                                                                    </option>
                                                                    <option value="Yes">
                                                                        Yes
                                                                    </option>
                                                                    <option value="No">
                                                                        No
                                                                    </option>
                                                                </select>
                                                                {errors.typing && (
                                                                    <p
                                                                        className={
                                                                            styles[
                                                                                "error-message"
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            errors.typing
                                                                        }
                                                                    </p>
                                                                )}
                                                            </label>
                                                        </div>
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
                                                                htmlFor="problemSolving"
                                                            >
                                                                Problem Solving
                                                                <select
                                                                    className={
                                                                        styles.input
                                                                    }
                                                                    id="problemSolving"
                                                                    name="problemSolving"
                                                                    value={
                                                                        formData.problemSolving
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    disabled={
                                                                        selectedApplicant.problem_solving ===
                                                                            "Yes" ||
                                                                        selectedApplicant.problem_solving ===
                                                                            "No" ||
                                                                        admin.department !==
                                                                            "RT"
                                                                    }
                                                                >
                                                                    <option
                                                                        disabled
                                                                        selected
                                                                    >
                                                                        Select
                                                                        an
                                                                        Option
                                                                    </option>
                                                                    <option value="Yes">
                                                                        Yes
                                                                    </option>
                                                                    <option value="No">
                                                                        No
                                                                    </option>
                                                                </select>
                                                                {errors.problemSolving && (
                                                                    <p
                                                                        className={
                                                                            styles[
                                                                                "error-message"
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            errors.problemSolving
                                                                        }
                                                                    </p>
                                                                )}
                                                            </label>
                                                        </div>
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
                                                                htmlFor="workEthics"
                                                            >
                                                                Work Ethics
                                                                <select
                                                                    className={
                                                                        styles.input
                                                                    }
                                                                    id="workEthics"
                                                                    name="workEthics"
                                                                    value={
                                                                        formData.workEthics
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    disabled={
                                                                        selectedApplicant.work_ethics ===
                                                                            "Yes" ||
                                                                        selectedApplicant.work_ethics ===
                                                                            "No" ||
                                                                        admin.department !==
                                                                            "RT"
                                                                    }
                                                                >
                                                                    <option
                                                                        disabled
                                                                        selected
                                                                    >
                                                                        Select
                                                                        an
                                                                        Option
                                                                    </option>
                                                                    <option value="Yes">
                                                                        Yes
                                                                    </option>
                                                                    <option value="No">
                                                                        No
                                                                    </option>
                                                                </select>
                                                                {errors.workEthics && (
                                                                    <p
                                                                        className={
                                                                            styles[
                                                                                "error-message"
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            errors.workEthics
                                                                        }
                                                                    </p>
                                                                )}
                                                            </label>
                                                        </div>
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
                                                                htmlFor="budgetIssues"
                                                            >
                                                                Budget Issues
                                                                <select
                                                                    className={
                                                                        styles.input
                                                                    }
                                                                    id="budgetIssues"
                                                                    name="budgetIssues"
                                                                    value={
                                                                        formData.budgetIssues
                                                                    }
                                                                    onChange={
                                                                        handleInputChange
                                                                    }
                                                                    disabled={
                                                                        selectedApplicant.budget_issues ===
                                                                            "Yes" ||
                                                                        selectedApplicant.budget_issues ===
                                                                            "No" ||
                                                                        admin.department !==
                                                                            "RT"
                                                                    }
                                                                >
                                                                    <option
                                                                        disabled
                                                                        selected
                                                                    >
                                                                        Select
                                                                        an
                                                                        Option
                                                                    </option>
                                                                    <option value="Yes">
                                                                        Yes
                                                                    </option>
                                                                    <option value="No">
                                                                        No
                                                                    </option>
                                                                </select>
                                                                {errors.budgetIssues && (
                                                                    <p
                                                                        className={
                                                                            styles[
                                                                                "error-message"
                                                                            ]
                                                                        }
                                                                    >
                                                                        {
                                                                            errors.budgetIssues
                                                                        }
                                                                    </p>
                                                                )}
                                                            </label>
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
                                                                    htmlFor="status"
                                                                >
                                                                    Status
                                                                    <select
                                                                        className={
                                                                            styles.input
                                                                        }
                                                                        id="status"
                                                                        name="status"
                                                                        value={
                                                                            formData.status
                                                                        }
                                                                        onChange={
                                                                            handleInputChange
                                                                        }
                                                                        disabled={
                                                                            selectedApplicant.status ===
                                                                                "Passed" ||
                                                                            selectedApplicant.status ===
                                                                                "Failed" ||
                                                                            admin.department !==
                                                                                "RT"
                                                                        }
                                                                    >
                                                                        <option
                                                                            disabled
                                                                            selected
                                                                        >
                                                                            Select
                                                                            an
                                                                            Option
                                                                        </option>
                                                                        <option value="Passed">
                                                                            Passed
                                                                        </option>
                                                                        <option value="Failed">
                                                                            Failed
                                                                        </option>
                                                                    </select>
                                                                    {errors.status && (
                                                                        <p
                                                                            className={
                                                                                styles[
                                                                                    "error-message"
                                                                                ]
                                                                            }
                                                                        >
                                                                            {
                                                                                errors.status
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </label>
                                                            </div>
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
                                                                    htmlFor="remarks"
                                                                >
                                                                    Remarks
                                                                    <textarea
                                                                        className={
                                                                            styles.input
                                                                        }
                                                                        id="remarks"
                                                                        name="remarks"
                                                                        value={
                                                                            formData.remarks
                                                                        }
                                                                        onChange={
                                                                            handleInputChange
                                                                        }
                                                                        disabled={
                                                                            admin.department !==
                                                                            "RT"
                                                                        }
                                                                        rows="5 "
                                                                        placeholder="Leave some remarks..."
                                                                    ></textarea>
                                                                    {errors.remarks && (
                                                                        <p
                                                                            className={
                                                                                styles[
                                                                                    "error-message"
                                                                                ]
                                                                            }
                                                                        >
                                                                            {
                                                                                errors.remarks
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={styles.row}>
                                                    <div
                                                        className={
                                                            styles[
                                                                "button-container"
                                                            ]
                                                        }
                                                    >
                                                        {!(
                                                            (selectedApplicant?.third_call &&
                                                                selectedApplicant.third_call ===
                                                                    "No Answer") ||
                                                            (selectedApplicant?.reading &&
                                                                selectedApplicant.reading !==
                                                                    "Select an Option") ||
                                                            (selectedApplicant?.typing &&
                                                                selectedApplicant.typing !==
                                                                    "Select an Option") ||
                                                            (selectedApplicant?.problem_solving &&
                                                                selectedApplicant.problem_solving !==
                                                                    "Select an Option") ||
                                                            (selectedApplicant?.work_ethics &&
                                                                selectedApplicant.work_ethics !==
                                                                    "Select an Option") ||
                                                            (selectedApplicant?.budget_issues &&
                                                                selectedApplicant.budget_issues !==
                                                                    "Select an Option") ||
                                                            (selectedApplicant?.remarks &&
                                                                selectedApplicant.remarks !==
                                                                    "Select an Option") ||
                                                            admin.department !==
                                                                "RT"
                                                        ) && (
                                                            <button
                                                                className={
                                                                    styles[
                                                                        "submit-button"
                                                                    ]
                                                                }
                                                                type="button"
                                                                onClick={
                                                                    handleSaveClick
                                                                }
                                                            >
                                                                Submit
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        {isDownloadModalOpen && (
                            <Modal isOpen={isDownloadModalOpen}>
                                <div
                                    className={`${styles["modal-container"]} ${styles["modal-export"]}`}
                                >
                                    <div className={styles["modal-content"]}>
                                        <div
                                            className={
                                                styles["heading-container"]
                                            }
                                        >
                                            <h1
                                                className={
                                                    styles["export-header"]
                                                }
                                            >
                                                Export Settings
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
                                                        styles["close-modal"]
                                                    }
                                                    onClick={closeDownlaodModal}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                styles["export-container"]
                                            }
                                        >
                                            <div className={styles.row}>
                                                <label
                                                    className={
                                                        styles["input-label"]
                                                    }
                                                >
                                                    <select
                                                        className={styles.input}
                                                        name="year"
                                                        value={year}
                                                        onChange={(e) =>
                                                            setYear(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option
                                                            disabled
                                                            selected
                                                        >
                                                            Select Year
                                                        </option>
                                                        {years.map(
                                                            (yearOption) => (
                                                                <option
                                                                    key={
                                                                        yearOption
                                                                    }
                                                                    value={
                                                                        yearOption
                                                                    }
                                                                >
                                                                    {yearOption}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    Year
                                                </label>
                                                <label
                                                    className={
                                                        styles["input-label"]
                                                    }
                                                >
                                                    <select
                                                        className={styles.input}
                                                        name="month"
                                                        value={month}
                                                        onChange={(e) =>
                                                            setMonth(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option
                                                            disabled
                                                            selected
                                                        >
                                                            Select Month
                                                        </option>
                                                        {months.map(
                                                            (monthOption) => (
                                                                <option
                                                                    key={
                                                                        monthOption
                                                                    }
                                                                    value={
                                                                        monthOption
                                                                    }
                                                                >
                                                                    {
                                                                        monthOption
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    Month
                                                </label>
                                                <label
                                                    className={
                                                        styles["input-label"]
                                                    }
                                                >
                                                    <select
                                                        className={styles.input}
                                                        name="status"
                                                        value={status}
                                                        onChange={(e) =>
                                                            setStatus(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option
                                                            disabled
                                                            selected
                                                        >
                                                            Select Status
                                                        </option>
                                                        <option value="All">
                                                            All
                                                        </option>
                                                        <option value="Passed">
                                                            Passed
                                                        </option>
                                                        <option value="Failed">
                                                            Failed
                                                        </option>
                                                        <option value="Pending">
                                                            Pending
                                                        </option>
                                                    </select>
                                                    Status
                                                </label>
                                            </div>
                                            <div className={styles.row}>
                                                <div
                                                    className={
                                                        styles[
                                                            "download-button-container"
                                                        ]
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "excel-button"
                                                            ]
                                                        }
                                                        onClick={
                                                            handleDownloadExcel
                                                        }
                                                        disabled={
                                                            !isInputsValid ||
                                                            isProcessing
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? "Processing..."
                                                            : "Download Excel"}
                                                        <img
                                                            className={
                                                                styles[
                                                                    "downloads-icon"
                                                                ]
                                                            }
                                                            src={excelIcon}
                                                            alt={excelIcon}
                                                        />
                                                    </button>
                                                    <button
                                                        className={
                                                            styles["pdf-button"]
                                                        }
                                                        onClick={
                                                            handleDownloadPDF
                                                        }
                                                        disabled={
                                                            !isInputsValid ||
                                                            isProcessing
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? "Processing..."
                                                            : "Download PDF"}
                                                        <img
                                                            className={
                                                                styles[
                                                                    "downloads-icon"
                                                                ]
                                                            }
                                                            src={pdfIcon}
                                                            alt={pdfIcon}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        {isDeleteModalOpen && selectedApplicant && (
                            <Modal
                                isOpen={isDeleteModalOpen}
                                applicantId={selectedApplicationId}
                            >
                                <div
                                    className={`${styles["modal-container"]} ${styles["delete-container"]}`}
                                >
                                    <div className={styles["modal-content"]}>
                                        <div
                                            className={
                                                styles["heading-container"]
                                            }
                                        >
                                            <h1
                                                className={`${styles["modal-header"]} ${styles["delete-header"]}`}
                                            >
                                                Are you sure you want to delete
                                                applicant "
                                                {selectedApplicant.first_name}"?
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
                        {isEditModalOpen && selectedApplicant && (
                            <Modal
                                isOpen={isEditModalOpen}
                                applicantId={selectedApplicationId}
                            >
                                <div className={styles["modal-container"]}>
                                    <div className={styles["modal-content"]}>
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
                                                Edit Applicant
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
                                                        styles["close-modal"]
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
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
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
                                                            type="text"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.first_name ||
                                                                ""
                                                            }
                                                            id="firstName"
                                                            className={
                                                                styles.input
                                                            }
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
                                                        htmlFor="middleName"
                                                    >
                                                        Middle Name
                                                        <input
                                                            name="middleName"
                                                            type="text"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.middle_name ||
                                                                ""
                                                            }
                                                            id="middleName"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="lastName"
                                                    >
                                                        First Name
                                                        <input
                                                            name="last_name"
                                                            type="text"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.last_name ||
                                                                ""
                                                            }
                                                            id="lastName"
                                                            className={
                                                                styles.input
                                                            }
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
                                                        htmlFor="suffix"
                                                    >
                                                        Suffix
                                                        <select
                                                            name="suffix"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.suffix ||
                                                                ""
                                                            }
                                                            id="suffix"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            <option value="N/A">
                                                                N/A
                                                            </option>
                                                            <option value="Sr.">
                                                                Sr.
                                                            </option>
                                                            <option value="Jr.">
                                                                Jr.
                                                            </option>
                                                            <option value="II">
                                                                II
                                                            </option>
                                                            <option value="III">
                                                                III
                                                            </option>
                                                            <option value="IV">
                                                                IV
                                                            </option>
                                                            <option value="V">
                                                                V
                                                            </option>
                                                        </select>
                                                    </label>
                                                </div>

                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="region"
                                                    >
                                                        Region
                                                        <select
                                                            name="region"
                                                            onChange={(e) => {
                                                                handleUpdateChange(
                                                                    e
                                                                );
                                                                handleRegionChange(
                                                                    e
                                                                );
                                                            }}
                                                            value={
                                                                editFormData.region ||
                                                                selectedRegion ||
                                                                ""
                                                            }
                                                            id="region"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            {regions.map(
                                                                (region) => (
                                                                    <option
                                                                        key={
                                                                            region.code
                                                                        }
                                                                        value={
                                                                            region.code
                                                                        }
                                                                    >
                                                                        {
                                                                            region.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="province"
                                                    >
                                                        Province
                                                        <select
                                                            name="province"
                                                            onChange={(e) => {
                                                                handleUpdateChange(
                                                                    e
                                                                );
                                                                handleProvinceChange(
                                                                    e
                                                                );
                                                            }}
                                                            value={
                                                                editFormData.province ||
                                                                selectedProvince ||
                                                                ""
                                                            }
                                                            id="province"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            {provinces.map(
                                                                (province) => (
                                                                    <option
                                                                        key={
                                                                            province
                                                                        }
                                                                        value={
                                                                            province
                                                                        }
                                                                    >
                                                                        {
                                                                            province
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="municipality"
                                                    >
                                                        Municipality
                                                        <select
                                                            name="municipality"
                                                            onChange={(e) => {
                                                                handleUpdateChange(
                                                                    e
                                                                );
                                                                handleMunicipalityChange(
                                                                    e
                                                                );
                                                            }}
                                                            value={
                                                                editFormData.municipality ||
                                                                selectedProvince ||
                                                                ""
                                                            }
                                                            id="municipality"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            {municipalities.map(
                                                                (
                                                                    municipality
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            municipality
                                                                        }
                                                                        value={
                                                                            municipality
                                                                        }
                                                                    >
                                                                        {
                                                                            municipality
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="barangay"
                                                    >
                                                        Barangay
                                                        <select
                                                            name="barangay"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.barangay ||
                                                                selectedProvince ||
                                                                ""
                                                            }
                                                            id="barangay"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            {barangays.map(
                                                                (barangay) => (
                                                                    <option
                                                                        key={
                                                                            barangay
                                                                        }
                                                                        value={
                                                                            barangay
                                                                        }
                                                                    >
                                                                        {
                                                                            barangay
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="street"
                                                    >
                                                        Street
                                                        <input
                                                            type="text"
                                                            name="street"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.street ||
                                                                ""
                                                            }
                                                            id="street"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="zip"
                                                    >
                                                        Zip
                                                        <input
                                                            type="number"
                                                            name="zip"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.zip ||
                                                                ""
                                                            }
                                                            id="zip"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="phone_number"
                                                    >
                                                        Phone Number
                                                        <input
                                                            type="tel"
                                                            name="phone_number"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.phone_number ||
                                                                ""
                                                            }
                                                            id="phone_number"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
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
                                                            type="tel"
                                                            name="email"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.email ||
                                                                ""
                                                            }
                                                            id="email"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="gender"
                                                    >
                                                        Gender
                                                        <select
                                                            name="gender"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.gender ||
                                                                ""
                                                            }
                                                            id="gender"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select a Gender
                                                            </option>
                                                            <option value="Male">
                                                                Male
                                                            </option>
                                                            <option value="Female">
                                                                Female
                                                            </option>
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="dob"
                                                    >
                                                        Date of Birth
                                                        <input
                                                            type="date"
                                                            name="dob"
                                                            onChange={(e) => {
                                                                handleDobChange(
                                                                    e
                                                                );
                                                                handleUpdateChange(
                                                                    e
                                                                );
                                                            }}
                                                            value={
                                                                editFormData.dob ||
                                                                ""
                                                            }
                                                            id="dob"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="age"
                                                    >
                                                        Age
                                                        <input
                                                            type="number"
                                                            name="age"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.age ||
                                                                ""
                                                            }
                                                            id="age"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="educational_attainment"
                                                    >
                                                        Educational Attainment
                                                        <select
                                                            name="educational_attainment"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.educational_attainment ||
                                                                ""
                                                            }
                                                            id="educational_attainment"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            <option value="Elementary">
                                                                Elementary
                                                            </option>
                                                            <option value="Junior Highschool">
                                                                Junior
                                                                Highschool
                                                            </option>
                                                            <option value="Senior Highschool">
                                                                Senior
                                                                Highschool
                                                            </option>
                                                            <option value="Technical Vocational">
                                                                Technical
                                                                Vocational
                                                            </option>
                                                            <option value="College">
                                                                College
                                                            </option>
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="institution_name"
                                                    >
                                                        Institution Name
                                                        <input
                                                            type="text"
                                                            name="institution_name"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.institution_name ||
                                                                ""
                                                            }
                                                            id="institution_name"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="course"
                                                    >
                                                        Course
                                                        <input
                                                            type="text"
                                                            name="course"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.course ||
                                                                ""
                                                            }
                                                            id="course"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="start_date"
                                                    >
                                                        Start Date
                                                        <input
                                                            type="date"
                                                            name="start_date"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.start_date ||
                                                                ""
                                                            }
                                                            id="start_date"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="end_date"
                                                    >
                                                        End Date
                                                        <input
                                                            type="date"
                                                            name="end_date"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.end_date ||
                                                                ""
                                                            }
                                                            id="end_date"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="gpa"
                                                    >
                                                        GPA
                                                        <input
                                                            type="number"
                                                            name="gpa"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.gpa ||
                                                                ""
                                                            }
                                                            id="gpa"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="source"
                                                    >
                                                        Source
                                                        <select
                                                            name="source"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.source ||
                                                                ""
                                                            }
                                                            id="source"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select a Source
                                                            </option>
                                                            <option value="Facebook">
                                                                Facebook
                                                            </option>
                                                            <option value="Referral">
                                                                Referral
                                                            </option>
                                                            <option value="Walk-in">
                                                                Walk-in
                                                            </option>
                                                            <option value="Jobstreet">
                                                                Jobstreet
                                                            </option>
                                                            <option value="Job Fair">
                                                                Job Fair
                                                            </option>
                                                            <option value="Other">
                                                                Other
                                                            </option>
                                                        </select>
                                                        {editFormData.source ===
                                                            "Other" && (
                                                            <input
                                                                type="text"
                                                                name="other_source"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    editFormData.other_source ||
                                                                    ""
                                                                }
                                                                id="other_source"
                                                                className={`${styles.input} ${styles["other-source"]}`}
                                                                placeholder="Other Source"
                                                            />
                                                        )}
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="sourcer"
                                                    >
                                                        Sourcer
                                                        <select
                                                            name="sourcer"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.sourcer ||
                                                                ""
                                                            }
                                                            id="sourcer"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select a Sourcer
                                                            </option>
                                                            <option value="Cristiel">
                                                                Cristiel
                                                            </option>
                                                            <option value="Joeneliza">
                                                                Joeneliza
                                                            </option>
                                                            <option value="Jonelyn">
                                                                Jonelyn
                                                            </option>
                                                            <option value="Francis">
                                                                Francis
                                                            </option>
                                                            <option value="Jelliane">
                                                                Jelliane
                                                            </option>
                                                            <option value="Mave">
                                                                Mave
                                                            </option>
                                                            <option value="Other">
                                                                Other
                                                            </option>
                                                        </select>
                                                        {editFormData.sourcer ===
                                                            "Other" && (
                                                            <input
                                                                type="text"
                                                                name="other_sourcer"
                                                                onChange={
                                                                    handleUpdateChange
                                                                }
                                                                value={
                                                                    editFormData.other_sourcer ||
                                                                    ""
                                                                }
                                                                id="other_sourcer"
                                                                className={`${styles.input} ${styles["other-sourcer"]}`}
                                                                placeholder="Other Sourcer"
                                                            />
                                                        )}
                                                    </label>
                                                </div>
                                                <div
                                                    className={`${styles["label-input-container"]} ${styles["edit-label-input-container"]}`}
                                                >
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="previous_employee"
                                                    >
                                                        Previous TA Employee?
                                                        <select
                                                            name="previous_employee"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.previous_employee ||
                                                                ""
                                                            }
                                                            id="previous_employee"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            <option value="Yes">
                                                                Yes
                                                            </option>
                                                            <option value="No">
                                                                No
                                                            </option>
                                                        </select>
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="recruiter"
                                                    >
                                                        Recruiter
                                                        <input
                                                            type="text"
                                                            name="recruiter"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.recruiter ||
                                                                ""
                                                            }
                                                            id="recruiter"
                                                            className={
                                                                styles.input
                                                            }
                                                        />
                                                    </label>
                                                    <label
                                                        className={
                                                            styles[
                                                                "input-label"
                                                            ]
                                                        }
                                                        htmlFor="bpo_experience"
                                                    >
                                                        BPO Experience
                                                        <select
                                                            name="bpo_experience"
                                                            onChange={
                                                                handleUpdateChange
                                                            }
                                                            value={
                                                                editFormData.bpo_experience ||
                                                                ""
                                                            }
                                                            id="bpo_experience"
                                                            className={
                                                                styles.input
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select an Option
                                                            </option>
                                                            <option value="No Experience">
                                                                No Experience
                                                            </option>
                                                            <option value="6 months - 1 year">
                                                                6 months - 1
                                                                year
                                                            </option>
                                                            <option value="1 year - 2 years">
                                                                1 year - 2 years
                                                            </option>
                                                            <option value="2 years - 3 years">
                                                                2 years - 3
                                                                years
                                                            </option>
                                                            <option value="3 years up">
                                                                3 years up
                                                            </option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div
                                                    className={
                                                        styles[
                                                            "submit-button-container"
                                                        ]
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "update-button"
                                                            ]
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
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Dashboard;
