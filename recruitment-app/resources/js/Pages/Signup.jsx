import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import styles from "../../css/Signup.module.css";
import logo from "../../images/trualliant-logo.svg";
import check from "../../images/check.svg";
import places from "../../js/philippines";
import { router, useForm } from "@inertiajs/react";
import Modal from "../Components/Modal/Modal";
const Signup = () => {
    const { applicants } = usePage().props;

    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };
    const handleOkayClick = () => {
        setModalOpen(false);
        window.location.reload();
    };
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");

    const regions = Object.keys(places).map((key) => ({
        code: key,
        name: places[key].region_name,
    }));

    const provinces =
        selectedRegion && places[selectedRegion]
            ? Object.keys(places[selectedRegion].province_list)
            : [];

    const municipalities =
        selectedProvince &&
        selectedRegion &&
        places[selectedRegion].province_list[selectedProvince]
            ? Object.keys(
                  places[selectedRegion].province_list[selectedProvince]
                      .municipality_list
              )
            : [];
    const barangays =
        selectedMunicipality &&
        selectedProvince &&
        selectedRegion &&
        places[selectedRegion].province_list[selectedProvince]
            .municipality_list[selectedMunicipality]
            ? places[selectedRegion].province_list[selectedProvince]
                  .municipality_list[selectedMunicipality].barangay_list
            : [];
    const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
        setSelectedProvince("");
        setSelectedMunicipality("");
    };

    const handleProvinceChange = (e) => {
        setSelectedProvince(e.target.value);
        setSelectedMunicipality("");
    };

    const handleMunicipalityChange = (e) => {
        setSelectedMunicipality(e.target.value);
    };

    const [dob, setDob] = useState("");
    const [age, setAge] = useState("");
    const { data, setData, post } = useForm({
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
        application_method: "",
        resume: null,
        skillset: "",
    });
    useEffect(() => {
        if (dob) {
            const calculatedAge = calculateAge(dob);
            setData("age", calculatedAge);
        }
    }, [dob]);
    const calculateAge = (dob) => {
        if (!dob) return;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth - birthDate.getMonth();

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
        setData("dob", selectedDate);
    };
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        region: "",
        province: "",
        municipality: "",
        barangay: "",
        street: "",
        zip: "",
        phoneNumber: "",
        email: "",
        gender: "",
        dob: "",
        age: "",
        educationalAttainment: "",
        institutionName: "",
        course: "",
        startDate: "",
        endDate: "",
        gpa: "",
        source: "",
        otherSource: "",
        sourcer: "",
        otherSourcer: "",
        previousEmployee: "",
        recruiter: "",
        bpoExperience: "",
        applicationMethod: "",
        resume: "",
        skills: "",
        skillset: "",
    });
    const [currentTab, setCurrentTab] = useState(0);
    const [errors, setErrors] = useState({
        firstName: false,
        middleName: false,
        lastName: false,
        suffix: false,
        region: false,
        province: false,
        municipality: false,
        barangay: false,
        street: false,
        zip: false,
        phoneNumber: false,
        email: false,
        gender: false,
        dob: false,
        age: false,
        educationalAttainment: false,
        institutionName: false,
        course: false,
        startDate: false,
        endDate: false,
        gpa: false,
        source: false,
        otherSource: false,
        sourcer: false,
        otherSourcer: false,
        previousEmployee: false,
        recruiter: false,
        bpoExperience: false,
        applicationMethod: false,
        resume: false,
        skills: false,
        skillset: false,
    });
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors({ ...errors, [id]: false });

        if (id === "source" && value === "Other") {
            setErrors({ ...errors, otherSource: !formData.otherSource.trim() });
        }
        if (id === "sourcer" && value === "Other") {
            setErrors({
                ...errors,
                otherSourcer: !formData.otherSourcer.trim(),
            });
        }
        if (id === "applicationMethod" && value === "Online") {
            setErrors({
                ...errors,
                resume: !formData.resume.trim(),
            });
        }
    };
    const addSkill = (e) => {
        e.preventDefault();
        if (formData.skills.trim() === "") {
            setErrors({ ...errors, skills: true });
        } else {
            const updatedSkillset = formData.skillset
                ? `${formData.skillset}, ${formData.skills}`
                : formData.skills;
            setFormData({ ...formData, skillset: updatedSkillset, skills: "" });
            setData("skillset", updatedSkillset);
            setErrors({ ...errors, skills: false });
        }
    };
    const validateCurrentTab = () => {
        const currentErrors = {};
        if (currentTab === 0) {
            currentErrors.firstName = !formData.firstName.trim();
            currentErrors.lastName = !formData.lastName.trim();
            currentErrors.suffix = !formData.suffix.trim();
            currentErrors.region = !formData.region.trim();
            currentErrors.province = !formData.province.trim();
            currentErrors.municipality = !formData.municipality.trim();
            currentErrors.barangay = !formData.barangay.trim();
            currentErrors.zip = !formData.zip.trim();
            currentErrors.phoneNumber = !formData.phoneNumber.trim();
            currentErrors.email =
                !formData.email.trim() || !formData.email.includes("@");
            currentErrors.gender = !formData.gender.trim();
            currentErrors.dob = !formData.dob.trim();
        } else if (currentTab === 1) {
            currentErrors.educationalAttainment =
                !formData.educationalAttainment.trim();
            currentErrors.institutionName = !formData.institutionName.trim();
            currentErrors.course = !formData.course.trim();
            currentErrors.startDate = !formData.startDate.trim();
            currentErrors.endDate = !formData.endDate.trim();
            currentErrors.gpa = !formData.gpa.trim();
            currentErrors.source = !formData.source.trim();
            if (formData.source === "Other") {
                currentErrors.otherSource = !formData.otherSource.trim();
            }
            currentErrors.sourcer = !formData.sourcer.trim();
            if (formData.sourcer === "Other") {
                currentErrors.otherSourcer = !formData.otherSourcer.trim();
            }
            currentErrors.previousEmployee = !formData.previousEmployee.trim();
            currentErrors.recruiter = !formData.recruiter.trim();
            currentErrors.bpoExperience = !formData.bpoExperience.trim();
            currentErrors.applicationMethod =
                !formData.applicationMethod.trim();
            if (formData.applicationMethod === "Online") {
                currentErrors.resume = !formData.resume.trim();
            }
            currentErrors.skillset = !formData.skillset.trim();
        }
        setErrors((prevErrors) => ({ ...prevErrors, ...currentErrors }));
        return Object.values(currentErrors).every((error) => !error);
    };
    const handleNext = () => {
        if (validateCurrentTab()) {
            setCurrentTab((prev) => Math.min(prev + 1, 1));
        } else {
        }
    };
    const handlePrevious = () => {
        setCurrentTab((prev) => Math.max(prev - 1, 0));
    };
    const handleFileChange = (event) => {
        setData("resume", event.target.files[0]);
    };

    const [isModalFieldsOpen, setFieldsModalOpen] = useState(false);

    const checkRequiredFields = (data) => {
        const now = new Date();
        let daysRemaining = 0;
        const matchFound = applicants.some((applicant) => {
            const createdAt = new Date(applicant.created_at);
            const threeMonthsLater = new Date(
                createdAt.getFullYear(),
                createdAt.getMonth() + 3,
                createdAt.getDate()
            );
            if (
                applicant.first_name === data.first_name &&
                applicant.last_name === data.last_name &&
                applicant.phone_number === data.phone_number &&
                applicant.email === data.email
            ) {
                if (threeMonthsLater > now) {
                    daysRemaining = Math.ceil(
                        (threeMonthsLater - now) / (1000 * 60 * 60 * 24)
                    );
                    return true;
                }
            }
            return false;
        });

        return { matchFound, daysRemaining };
    };

    const toggleModalFields = () => {
        setFieldsModalOpen(!isModalFieldsOpen);
    };
    const toggleModalFieldsClose = () => {
        setFieldsModalOpen(false);
    };
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateCurrentTab()) {
            if (currentTab === 1) {
                const { matchFound, daysRemaining } = checkRequiredFields(data);

                if (matchFound) {
                    setModalMessage(
                        `You can reapply in ${daysRemaining} days. Please try again later.`
                    );
                    toggleModalFields();
                } else {
                    toggleModal();
                    post("/signup", data);
                }
            } else {
                setCurrentTab((prev) => Math.min(prev + 1, 1));
            }
        } else {
            console.log("Fix validation errors before proceeding.");
        }
    };

    return (
        <div className={styles.signup}>
            <h1 className={styles["signup-header"]}>APPLY NOW</h1>
            <form className={styles["form-container"]} onSubmit={handleSubmit}>
                <div className={styles["left-side"]}>
                    <div className={styles["logo-container"]}>
                        <img className={styles.logo} src={logo} alt="logo" />
                    </div>
                    <div className={styles["caption-container"]}>
                        <h1 className={styles.caption}>
                            Team Work Makes the Dream Work
                        </h1>
                    </div>
                </div>
                <div className={styles["right-side"]}>
                    {currentTab === 0 && (
                        <div className={styles["form-tab"]}>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["first-name-label"]}`}
                                    htmlFor="firstName"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["first-name"]
                                        } ${
                                            errors.firstName ? styles.error : ""
                                        }`}
                                        type="text"
                                        id="firstName"
                                        value={
                                            formData.firstName ||
                                            data.first_name
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "first_name",
                                                e.target.value
                                            );
                                        }}
                                        required
                                    />
                                    First Name
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["middle-name-label"]}`}
                                    htmlFor="middleName"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["middle-name"]
                                        } ${
                                            errors.middleName
                                                ? styles.error
                                                : ""
                                        }`}
                                        type="text"
                                        id="middleName"
                                        value={
                                            formData.middleName ||
                                            data.middle_name
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "middle_name",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    Middle Name
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["last-name-label"]}`}
                                    htmlFor="lastName"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["last-name"]
                                        } ${
                                            errors.lastName ? styles.error : ""
                                        }`}
                                        type="text"
                                        id="lastName"
                                        value={
                                            formData.lastName || data.last_name
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "last_name",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    Last Name
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["suffix-label"]}`}
                                    htmlFor="suffix"
                                >
                                    <select
                                        className={`${styles["field"]} ${
                                            styles["suffix"]
                                        } ${
                                            errors.suffix ? styles["error"] : ""
                                        }`}
                                        name=""
                                        id="suffix"
                                        value={formData.suffix || data.suffix}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("suffix", e.target.value);
                                        }}
                                    >
                                        <option value="" selected disabled>
                                            Select an Option
                                        </option>
                                        <option value="N/A">N/A</option>
                                        <option value="Sr.">Sr.</option>
                                        <option value="Jr.">Jr.</option>
                                        <option value="II">II</option>
                                        <option value="III">III</option>
                                        <option value="IV">IV</option>
                                        <option value="V">V</option>
                                    </select>
                                    Suffix
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["region-label"]}`}
                                    htmlFor="region"
                                >
                                    <select
                                        className={`${styles["field"]} ${
                                            styles["region"]
                                        } ${
                                            errors.region ? styles["error"] : ""
                                        }`}
                                        name=""
                                        id="region"
                                        value={
                                            selectedRegion ||
                                            formData.region ||
                                            data.region
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleRegionChange(e);
                                            setData("region", e.target.value);
                                        }}
                                        required
                                    >
                                        <option value="" selected disabled>
                                            Select a Region
                                        </option>
                                        {regions.map((region) => (
                                            <option
                                                key={region.code}
                                                value={region.code}
                                            >
                                                {region.name}
                                            </option>
                                        ))}
                                    </select>
                                    Region
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["province-label"]}`}
                                    htmlFor="province"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles.province
                                        } ${
                                            errors.province ? styles.error : ""
                                        }`}
                                        name=""
                                        id="province"
                                        value={
                                            selectedProvince ||
                                            formData.province ||
                                            data.province
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleProvinceChange(e);
                                            setData("province", e.target.value);
                                        }}
                                        required
                                        disabled={!selectedRegion}
                                    >
                                        <option value="" selected disabled>
                                            Select a Province
                                        </option>
                                        {provinces.map((province) => (
                                            <option
                                                key={province}
                                                value={province}
                                            >
                                                {province}
                                            </option>
                                        ))}
                                    </select>
                                    Province
                                </label>
                                <label
                                    className={`${styles[`field-label`]} ${
                                        styles["municipality-label"]
                                    }`}
                                    htmlFor="municipality"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles.municipality
                                        } ${
                                            errors.municipality
                                                ? styles.error
                                                : ""
                                        }`}
                                        name=""
                                        id="municipality"
                                        value={
                                            selectedMunicipality ||
                                            formData.municipality ||
                                            data.municipality
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleMunicipalityChange(e);
                                            setData(
                                                "municipality",
                                                e.target.value
                                            );
                                        }}
                                        disabled={!selectedProvince}
                                    >
                                        <option value="" selected disabled>
                                            Select a Municipality
                                        </option>
                                        {municipalities.map((municipality) => (
                                            <option
                                                key={municipality}
                                                value={municipality}
                                            >
                                                {municipality}
                                            </option>
                                        ))}
                                    </select>
                                    Municipality
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["barangay-label"]} `}
                                    htmlFor="barangay"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles.barangay
                                        } ${
                                            errors.barangay ? styles.error : ""
                                        }`}
                                        name=""
                                        id="barangay"
                                        value={
                                            formData.barangay || data.barangay
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("barangay", e.target.value);
                                        }}
                                        disabled={!selectedMunicipality}
                                    >
                                        <option value="" selected disabled>
                                            Select a Barangay
                                        </option>
                                        {barangays.map((barangay, index) => (
                                            <option
                                                key={index}
                                                value={barangay}
                                            >
                                                {barangay}
                                            </option>
                                        ))}
                                    </select>
                                    Barangay
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${
                                        styles["street-label"]
                                    } ${errors.street ? "error" : ""}`}
                                    htmlFor="street"
                                >
                                    <input
                                        className={`${styles.field} ${styles.street}`}
                                        value={formData.street || data.street}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("street", e.target.value);
                                        }}
                                        id="street"
                                        type="text"
                                    />
                                    Street
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["zip-label"]}`}
                                    htmlFor="zip"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.zip
                                        } ${errors.zip ? styles.error : ""}`}
                                        id="zip"
                                        type="number"
                                        value={formData.zip || data.zip}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("zip", e.target.value);
                                        }}
                                    />
                                    ZIP Code
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["phone-number-label"]}`}
                                    htmlFor="phoneNumber"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["phone-number"]
                                        } ${
                                            errors.phoneNumber
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={
                                            formData.phoneNumber ||
                                            data.phone_number
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "phone_number",
                                                e.target.value
                                            );
                                        }}
                                        id="phoneNumber"
                                        type="telephone"
                                    />
                                    Phone Number
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${[
                                        "email-label",
                                    ]}`}
                                    htmlFor="email"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.email
                                        } ${errors.email ? styles.error : ""}`}
                                        value={formData.email || data.email}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("email", e.target.value);
                                        }}
                                        id="email"
                                        type="email"
                                        required
                                    />
                                    Email
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["gender-label"]}`}
                                    htmlFor="gender"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles.gender
                                        } ${errors.gender ? styles.error : ""}`}
                                        value={formData.gender || data.gender}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("gender", e.target.value);
                                        }}
                                        name=""
                                        id="gender"
                                    >
                                        <option value="" disabled>
                                            Select a Gender
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    Gender
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["dob-label"]}`}
                                    htmlFor="dob"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.dob
                                        } ${errors.dob ? styles.error : ""}`}
                                        id="dob"
                                        type="date"
                                        value={dob || formData.dob || data.dob}
                                        onChange={(e) => {
                                            handleDobChange(e);
                                            handleInputChange(e);
                                            setData("dob", e.target.value);
                                        }}
                                    />
                                    Date of Birth
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["age-label"]}`}
                                    htmlFor="age"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.age
                                        } ${errors.age ? styles.error : ""}`}
                                        id="age"
                                        type="number"
                                        value={age || formData.age || data.age}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("age", e.target.value);
                                        }}
                                    />
                                    Age
                                </label>
                            </div>
                        </div>
                    )}
                    {currentTab === 1 && (
                        <div className={styles["form-tab"]}>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["educational-attaintment-label"]}`}
                                    htmlFor="educationalAttainment"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles["educational-attainment"]
                                        } ${
                                            errors.educationalAttainment
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={
                                            formData.educationalAttainment ||
                                            data.educational_attainment
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "educational_attainment",
                                                e.target.value
                                            );
                                        }}
                                        id="educationalAttainment"
                                    >
                                        <option value="" disabled selected>
                                            Select an Option
                                        </option>
                                        <option value="Elementary">
                                            Elementary
                                        </option>
                                        <option value="Junior Highschool">
                                            Junior Highschool
                                        </option>
                                        <option value="Senior Highschool">
                                            Senior Highschool
                                        </option>
                                        <option value="Technical Vocational">
                                            Technical Vocational
                                        </option>
                                        <option value="College">College</option>
                                    </select>
                                    Educational Attainment
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["institution-name-label"]}`}
                                    htmlFor="institutionName"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["institution-name"]
                                        } ${
                                            errors.institutionName
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={
                                            formData.institutionName ||
                                            data.institution_name
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "institution_name",
                                                e.target.value
                                            );
                                        }}
                                        type="text"
                                        name=""
                                        id="institutionName"
                                    />
                                    Institution Name
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["course-label"]}`}
                                    htmlFor="course"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.course
                                        } ${errors.course ? "error" : ""}`}
                                        value={formData.course || data.course}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("course", e.target.value);
                                        }}
                                        type="text"
                                        name=""
                                        id="course"
                                    />
                                    Course
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["start-date-label"]}`}
                                    htmlFor="startDate"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["start-date"]
                                        } ${errors.startDate ? "error" : ""}`}
                                        value={
                                            formData.startDate ||
                                            data.start_date
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "start_date",
                                                e.target.value
                                            );
                                        }}
                                        type="date"
                                        name=""
                                        id="startDate"
                                    />
                                    Start Date
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["end-date-label"]}`}
                                    htmlFor="endDate"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles["end-date"]
                                        } ${errors.endDate ? "error" : ""}`}
                                        value={
                                            formData.endDate || data.end_date
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("end_date", e.target.value);
                                        }}
                                        type="date"
                                        name=""
                                        id="endDate"
                                    />
                                    End Date
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["gpa-label"]}`}
                                    htmlFor="gpa"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.gpa
                                        } ${errors.gpa ? styles.error : ""}`}
                                        value={formData.gpa || data.gpa}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("gpa", e.target.value);
                                        }}
                                        type="number"
                                        name=""
                                        id="gpa"
                                    />
                                    GPA
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["source-label"]}`}
                                    htmlFor="source"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles.source
                                        } ${errors.source ? styles.error : ""}`}
                                        value={formData.source || data.source}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("source", e.target.value);
                                        }}
                                        name=""
                                        id="source"
                                    >
                                        <option value="" disabled selected>
                                            Select a Source
                                        </option>
                                        <option value="Facebook">
                                            Facebook
                                        </option>
                                        <option value="Referral">
                                            Referral
                                        </option>
                                        <option value="Walk-in">Walk-in</option>
                                        <option value="Jobstreet">
                                            Jobstreet
                                        </option>
                                        <option value="Job Fair">
                                            Job Fair
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formData.source === "Other" && (
                                        <input
                                            className={`${styles.field} ${
                                                styles["other-source"]
                                            } ${
                                                errors.otherSource
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={
                                                formData.otherSource ||
                                                data.other_source
                                            }
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setData(
                                                    "other_source",
                                                    e.target.value
                                                );
                                            }}
                                            placeholder="Other Source"
                                            type="text"
                                            name=""
                                            id="otherSource"
                                            style={{
                                                display:
                                                    formData.source === "Other"
                                                        ? "block"
                                                        : "none",
                                            }}
                                        />
                                    )}
                                    Source
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["sourcer-label"]}`}
                                    htmlFor="sourcer"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles.sourcer
                                        } ${
                                            errors.sourcer ? styles.error : ""
                                        }`}
                                        value={formData.sourcer || data.sourcer}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("sourcer", e.target.value);
                                        }}
                                        name=""
                                        id="sourcer"
                                    >
                                        <option value="" disabled selected>
                                            Select a Sourcer
                                        </option>
                                        <option value="Cristiel">
                                            Cristiel
                                        </option>
                                        <option value="Joeneliza">
                                            Joeneliza
                                        </option>
                                        <option value="Jonelyn">Jonelyn</option>
                                        <option value="Francis">Francis</option>
                                        <option value="Jelliane">
                                            Jelliane
                                        </option>
                                        <option value="Mave">Mave</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formData.sourcer === "Other" && (
                                        <input
                                            className={`${styles.field} ${
                                                styles["other-sourcer"]
                                            } ${
                                                errors.otherSourcer
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={
                                                formData.otherSourcer ||
                                                data.other_sourcer
                                            }
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setData(
                                                    "other_sourcer",
                                                    e.target.value
                                                );
                                            }}
                                            placeholder="Other Sourcer"
                                            type="text"
                                            name=""
                                            id="otherSourcer"
                                            style={{
                                                display:
                                                    formData.sourcer === "Other"
                                                        ? "block"
                                                        : "none",
                                            }}
                                        />
                                    )}
                                    Source
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["previous-employee-label"]}`}
                                    htmlFor="previousEmployee"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles["previous-employee"]
                                        } ${
                                            errors.previousEmployee
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={
                                            formData.previousEmployee ||
                                            data.previous_employee
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "previous_employee",
                                                e.target.value
                                            );
                                        }}
                                        name=""
                                        id="previousEmployee"
                                    >
                                        <option value="" disabled selected>
                                            Select an Option
                                        </option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    Previous TA Employee?
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["recruiter-label"]}`}
                                    htmlFor="recruiter"
                                >
                                    <input
                                        className={`${styles.field} ${
                                            styles.recuirter
                                        } ${
                                            errors.recruiter ? styles.error : ""
                                        }`}
                                        value={
                                            formData.recruiter || data.recruiter
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "recruiter",
                                                e.target.value
                                            );
                                        }}
                                        type="text"
                                        id="recruiter"
                                    />
                                    Recruiter
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["bpo-experience-label"]}`}
                                    htmlFor="bpoExperience"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles["bpo-experience"]
                                        } ${
                                            errors.bpoExperience
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={
                                            formData.bpoExperience ||
                                            data.bpo_experience
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "bpo_experience",
                                                e.target.value
                                            );
                                        }}
                                        name=""
                                        id="bpoExperience"
                                    >
                                        <option value="" disabled selected>
                                            Select an Option
                                        </option>
                                        <option value="No Experience">
                                            No Experience
                                        </option>
                                        <option value="6 months - 1 year">
                                            6 months - 1 year
                                        </option>
                                        <option value="1 year - 2 years">
                                            1 year - 2 years
                                        </option>
                                        <option value="2 years - 3 years">
                                            2 years - 3 years
                                        </option>
                                        <option value="3 years up">
                                            3 years up
                                        </option>
                                    </select>
                                    BPO Experience
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["application-method-label"]}`}
                                    htmlFor="applicationMethod"
                                >
                                    <select
                                        className={`${styles.field} ${
                                            styles["application-method"]
                                        } ${
                                            errors.applicationMethod
                                                ? styles.error
                                                : ""
                                        }`}
                                        value={
                                            formData.applicationMethod ||
                                            data.application_method
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData(
                                                "application_method",
                                                e.target.value
                                            );
                                        }}
                                        name=""
                                        id="applicationMethod"
                                    >
                                        <option value="" selected disabled>
                                            Select a Method
                                        </option>
                                        <option value="Walk-in">Walk-in</option>
                                        <option value="Online">Online</option>
                                    </select>
                                    {formData.applicationMethod ===
                                        "Online" && (
                                        <input
                                            className={`${styles.field} ${
                                                styles.resume
                                            } ${
                                                errors.resume
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={
                                                formData.resume || data.resume
                                            }
                                            onChange={(e) => {
                                                handleFileChange(e);
                                                handleInputChange(e);
                                            }}
                                            type="file"
                                            id="resume"
                                            accept=".pdf,.doc,.docx"
                                        />
                                    )}
                                    Application Method
                                </label>
                                <label
                                    className={`${styles["field-label"]} ${styles["skills-label"]}`}
                                    htmlFor="skills"
                                >
                                    <span className={styles["skills-wrapper"]}>
                                        <input
                                            className={`${styles.field} ${
                                                styles.skills
                                            } ${
                                                errors.skills
                                                    ? styles.error
                                                    : ""
                                            }`}
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                            type="text"
                                            id="skills"
                                        />
                                        <button
                                            className={styles["skills-button"]}
                                            onClick={addSkill}
                                        >
                                            Add
                                        </button>
                                    </span>
                                    Skills
                                </label>
                            </div>
                            <div className={styles.row}>
                                <label
                                    className={`${styles["field-label"]} ${styles["skillset-label"]}`}
                                    htmlFor="skillset"
                                >
                                    <textarea
                                        className={`${styles.field} ${
                                            styles.skillset
                                        } ${
                                            errors.skillset ? styles.error : ""
                                        }`}
                                        value={
                                            formData.skillset || data.skillset
                                        }
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            setData("skillset", e.target.value);
                                        }}
                                        name=""
                                        id="skillset"
                                        rows="3"
                                        readOnly
                                    ></textarea>
                                    Skillset/s
                                </label>
                            </div>
                        </div>
                    )}
                    <div className={styles["button-tab"]}>
                        <div className={styles["button-row"]}>
                            <div
                                className={styles["previous-button-container"]}
                            >
                                {currentTab > 0 && (
                                    <button
                                        type="button"
                                        className={styles["previous-button"]}
                                        onClick={handlePrevious}
                                    >
                                        Prev
                                    </button>
                                )}
                            </div>
                            <div className={styles["next-button-container"]}>
                                <div
                                    className={styles["next-button-container"]}
                                >
                                    <button
                                        type={
                                            currentTab === 1
                                                ? "submit"
                                                : "button"
                                        }
                                        className={styles["next-button"]}
                                        onClick={() => {
                                            handleNext();
                                            if (
                                                currentTab === 1 &&
                                                validateCurrentTab()
                                            ) {
                                            } else {
                                                handleNext();
                                            }
                                        }}
                                    >
                                        {currentTab === 1 ? "Submit" : "Next"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={isModalOpen}>
                        <div className={styles["modal-container"]}>
                            <div className={styles["modal-content"]}>
                                <div className={styles["check-container"]}>
                                    <img
                                        className={styles.check}
                                        src={check}
                                        alt="check"
                                    />
                                </div>
                                <h1 className={styles["modal-message"]}>
                                    Application Submitted
                                </h1>
                                <div
                                    className={styles["modal-button-container"]}
                                >
                                    <button
                                        className={
                                            styles["modal-confirm-button"]
                                        }
                                        onClick={handleOkayClick}
                                    >
                                        Okay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal isOpen={isModalFieldsOpen}>
                        <div className={styles["modal-container"]}>
                            <div className={styles["modal-content"]}>
                                <h1 className={styles["modal-message"]}>
                                    {modalMessage ||
                                        "You cannot proceed at this time."}
                                </h1>
                                <div
                                    className={styles["modal-button-container"]}
                                >
                                    <button
                                        className={
                                            styles["modal-confirm-button"]
                                        }
                                        onClick={toggleModalFieldsClose}
                                    >
                                        Okay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </form>
        </div>
    );
};

export default Signup;
