import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Topbar from "../../Components/Topbar/Topbar";
import styles from "../../../css/analytics.module.css";
import { usePage, router } from "@inertiajs/react";
import person from "../../../images/person.svg";
import pending from "../../../images/person-pending.svg";
import passed from "../../../images/person-passed.svg";
import failed from "../../../images/person-failed.svg";
import Chart from "react-apexcharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import downloadIcon from "../../../images/download-icon.svg";
import loadingIcon from "../../../images/loading-icon.svg";

const Analytics = () => {
    const {
        admin,
        years,
        total_applicants,
        pending_applicants,
        passed_applicants,
        failed_applicants,
        applicants_progression,
        age_success,
        applicants_status_progression,
        status_count,
    } = usePage().props;

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );

    useEffect(() => {
        router.visit("/analytics", {
            method: "get",
            data: { year: selectedYear },
            preserveState: true,
        });
    }, [selectedYear]);

    const statusCount = {
        series: [
            {
                name: "Passed",
                data: [status_count.Passed || 0],
            },
            {
                name: "Failed",
                data: [status_count.Failed || 0],
            },
            {
                name: "Pending",
                data: [status_count.Pending || 0],
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    barHeight: "100%",
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val;
                },
                style: {
                    colors: ["#ffffff"],
                    fontSize: "14px",
                    fontFamily: "'Hind Madurai', serif",
                    fontWeight: "bold",
                },
            },
            xaxis: {
                categories: [" "],
                labels: {
                    show: false,
                },
            },
            yaxis: {
                show: false,
            },
            colors: ["#132349", "#FD6804", "#FF9B37"],
            legend: {
                show: true,
                position: "top",
            },
        },
    };

    const applicantsStatusProgression = {
        series: ["Pending", "Failed", "Passed"].map((status) => {
            const currentYearData = Array(12).fill(0);

            Object.entries(
                applicants_status_progression[status]?.currentYear || {}
            ).forEach(([month, count]) => {
                currentYearData[parseInt(month, 10) - 1] = count;
            });

            return {
                name: status,
                data: currentYearData,
            };
        }),
        options: {
            chart: {
                type: "line",
                stacked: true,
                toolbar: { show: false },
                zoom: { enabled: false },
            },
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                labels: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        colors: "#FD6804",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        colors: "#132349",
                    },
                },
            },
            stroke: {
                curve: "smooth",
                width: 2,
            },
            colors: ["#FF9B37", "#FD6804", "#132349"],
            dataLabels: {
                enabled: false,
            },
            legend: {
                position: "top",
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
        },
    };

    const ageSuccessRateChart = (() => {
        const allCategories = ["18-25", "26-35", "36-45", "46-55", "56+"];
        const categoryData = allCategories.map((category) => {
            const group = age_success.find((g) => g.age_group === category);
            return {
                age_group: category,
                passed: group ? group.passed : 0,
                failed: group ? group.failed : 0,
            };
        });

        const passedData = categoryData.map((group) => group.passed);
        const failedData = categoryData.map((group) => group.failed);

        const maxYValue = Math.max(...passedData, ...failedData) + 4;

        return {
            series: [
                {
                    name: "Passed",
                    data: passedData,
                },
                {
                    name: "Failed",
                    data: failedData,
                },
            ],
            options: {
                chart: {
                    type: "bar",
                    stacked: false,
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "50%",
                    },
                },
                xaxis: {
                    categories: allCategories,
                    labels: {
                        style: {
                            fontFamily: "'Hind Madurai', serif",
                            fontSize: "12px",
                            fontWeight: "bold",
                            colors: "#FD6804",
                        },
                    },
                },
                yaxis: {
                    max: maxYValue,
                    labels: {
                        style: {
                            fontFamily: "'Hind Madurai', serif",
                            fontSize: "12px",
                            fontWeight: "bold",
                            colors: "#132349",
                        },
                    },
                },
                colors: ["#132349", "#FD6804"],
                legend: {
                    position: "top",
                },
            },
        };
    })();

    const applicantsProgressionChart = (() => {
        const currentYearData = Array(12)
            .fill(0)
            .map((_, i) => applicants_progression.currentYear[i + 1] || 0);
        const previousYearData = Array(12)
            .fill(0)
            .map((_, i) => applicants_progression.previousYear[i + 1] || 0);

        const maxYValue = Math.max(...currentYearData, ...previousYearData) + 4;

        return {
            series: [
                {
                    name: "Current Year",
                    data: currentYearData,
                },
                {
                    name: "Previous Year",
                    data: previousYearData,
                },
            ],
            options: {
                chart: {
                    type: "line",
                    stacked: false,
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                },
                xaxis: {
                    categories: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ],
                    labels: {
                        style: {
                            fontFamily: "'Hind Madurai', serif",
                            fontSize: "12px",
                            fontWeight: "bold",
                            colors: "#FD6804",
                        },
                    },
                },
                stroke: {
                    curve: "smooth",
                    width: [3, 2],
                },
                yaxis: {
                    max: maxYValue,
                    labels: {
                        style: {
                            fontFamily: "'Hind Madurai', serif",
                            fontSize: "14px",
                            fontWeight: "bold",
                            colors: "#132349",
                        },
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                colors: ["#132349", "#FD6804"],
                legend: {
                    position: "top",
                },
            },
        };
    })();

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const handleDownloadAllGraphs = async () => {
        setIsProcessing(true);
        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const graphs = document.querySelectorAll(
                `.${styles["graph-card"]}`
            );
            let pageHeight = pdf.internal.pageSize.height;

            for (let i = 0; i < graphs.length; i++) {
                const graph = graphs[i];

                const canvas = await html2canvas(graph, { scale: 2 });
                const imgData = canvas.toDataURL("image/png");

                const imgWidth = pdf.internal.pageSize.width;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);

                if (i < graphs.length - 1) {
                    pdf.addPage();
                }
            }

            pdf.save("graphs.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(
                "An error occurred while generating the PDF. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <BrowserRouter>
            <div className={styles.analytics}>
                <Sidebar />
                <div className={styles["analytics-container"]}>
                    <Topbar />
                    <div className={styles["graph-container"]}>
                        <div className={styles["filter-container"]}>
                            <select
                                className={styles.filter}
                                value={selectedYear}
                                onChange={handleYearChange}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={styles["download-button"]}
                                onClick={handleDownloadAllGraphs}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <img
                                        className={`${styles["download-icon"]} ${styles["loading-icon"]}`}
                                        src={loadingIcon}
                                        alt="Loading..."
                                    />
                                ) : (
                                    <img
                                        className={styles["download-icon"]}
                                        src={downloadIcon}
                                        alt="Download"
                                    />
                                )}
                            </button>
                        </div>
                        <div className={`${styles.row} ${styles["first-row"]}`}>
                            <div
                                className={`${styles["graph-card"]} ${styles["first-row-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Total Number of Applicants
                                        </h1>
                                        <h2 className={styles["sub-header"]}>
                                            {total_applicants}
                                        </h2>
                                    </div>
                                    <div className={styles["icon-container"]}>
                                        <img
                                            className={styles.icon}
                                            src={person}
                                            alt={person}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`${styles["graph-card"]} ${styles["first-row-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Total Pending Applicants
                                        </h1>
                                        <h2 className={styles["sub-header"]}>
                                            {pending_applicants}
                                        </h2>
                                    </div>
                                    <div className={styles["icon-container"]}>
                                        <img
                                            className={styles.icon}
                                            src={pending}
                                            alt={pending}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`${styles["graph-card"]} ${styles["first-row-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Total Passed Applicants
                                        </h1>
                                        <h2 className={styles["sub-header"]}>
                                            {passed_applicants}
                                        </h2>
                                    </div>
                                    <div className={styles["icon-container"]}>
                                        <img
                                            className={styles.icon}
                                            src={passed}
                                            alt={passed}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`${styles["graph-card"]} ${styles["first-row-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Total Failed Applicants
                                        </h1>
                                        <h2 className={styles["sub-header"]}>
                                            {failed_applicants}
                                        </h2>
                                    </div>
                                    <div className={styles["icon-container"]}>
                                        <img
                                            className={styles.icon}
                                            src={failed}
                                            alt={failed}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles["graph-card"]}>
                                <div className={styles["card-header"]}>
                                    <div
                                        className={`${styles["header-container"]} ${styles["graph-header-container"]}`}
                                    >
                                        <h1
                                            className={`${styles.header} ${styles["graph-header"]}`}
                                        >
                                            Applicants Progression
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={
                                            applicantsProgressionChart.options
                                        }
                                        series={
                                            applicantsProgressionChart.series
                                        }
                                        type="line"
                                        height={300}
                                        width="85%"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles["graph-card"]}>
                                <div className={styles["card-header"]}>
                                    <div
                                        className={`${styles["header-container"]} ${styles["graph-header-container"]}`}
                                    >
                                        <h1
                                            className={`${styles.header} ${styles["graph-header"]}`}
                                        >
                                            Age Success Rate
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={ageSuccessRateChart.options}
                                        series={ageSuccessRateChart.series}
                                        type="bar"
                                        height={300}
                                        width="85%"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles["graph-card"]}>
                                <div className={styles["card-header"]}>
                                    <div
                                        className={`${styles["header-container"]} ${styles["graph-header-container"]}`}
                                    >
                                        <h1
                                            className={`${styles.header} ${styles["graph-header"]}`}
                                        >
                                            Status Progression
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={
                                            applicantsStatusProgression.options
                                        }
                                        series={
                                            applicantsStatusProgression.series
                                        }
                                        type="line"
                                        height={300}
                                        width="85%"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles["graph-card"]}>
                                <div className={styles["card-header"]}>
                                    <div
                                        className={`${styles["header-container"]} ${styles["graph-header-container"]}`}
                                    >
                                        <h1
                                            className={`${styles.header} ${styles["graph-header"]}`}
                                        >
                                            Status Comparison
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={statusCount.options}
                                        series={statusCount.series}
                                        type="bar"
                                        height={300}
                                        width="85%"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Analytics;
