import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Topbar from "../../Components/Topbar/Topbar";
import styles from "../../../css/reports.module.css";
import { usePage, router } from "@inertiajs/react";
import Chart from "react-apexcharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import downloadIcon from "../../../images/download-icon.svg";
import loadingIcon from "../../../images/loading-icon.svg";
const ReportsPage = () => {
    const {
        admin,
        years,
        months,
        experienceData,
        applicationMethodData,
        source,
        ageDistribution,
        status,
    } = usePage().props;

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );

    useEffect(() => {
        router.visit("/reports", {
            method: "get",
            data: { year: selectedYear, month: selectedMonth },
            preserveState: true,
        });
    }, [selectedYear, selectedMonth]);

    const experienceCategories = [
        "No Experience",
        "6 months - 1 year",
        "1 year - 2 years",
        "2 years - 3 years",
        "3 years up",
    ];

    const experienceCategoryLabels = {
        "No Experience": "None",
        "6 months - 1 year": "6m-1y",
        "1 year - 2 years": "1-2y",
        "2 years - 3 years": "2-3y",
        "3 years up": "3+y",
    };

    const experienceChartData = {
        series: [
            {
                name: "Applicants",
                data: experienceCategories.map((category) => {
                    const experienceItem = experienceData.find(
                        (item) => item.bpo_experience === category
                    );
                    return experienceItem ? experienceItem.applicants : 0;
                }),
            },
        ],
        options: {
            chart: {
                type: "bar",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "20%",
                    endingShape: "rounded",
                    colors: {
                        ranges: [
                            {
                                from: 0,
                                to: 100,
                                color: "#132349",
                            },
                        ],
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: experienceCategories.map(
                    (category) => experienceCategoryLabels[category]
                ),
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
                max:
                    Math.max(
                        ...experienceCategories.map((category) => {
                            const experienceItem = experienceData.find(
                                (item) => item.bpo_experience === category
                            );
                            return experienceItem
                                ? experienceItem.applicants
                                : 0;
                        })
                    ) + 5,
                labels: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "14px",
                        fontWeight: "bold",
                        colors: "#132349",
                    },
                },
            },
        },
    };

    const applicationMethodChart = {
        series: ["Walk-in", "Online"].map((label) => {
            const dataItem = applicationMethodData.find(
                (item) => item.application_method === label
            );
            return dataItem ? dataItem.applicants : 0;
        }),
        options: {
            chart: {
                type: "donut",
            },
            labels: ["Walk-in", "Online"],
            plotOptions: {
                pie: {
                    donut: {
                        size: "70%",
                    },
                },
            },
            legend: {
                position: "bottom",
            },
            colors: ["#FD6804", "#132349"],
        },
    };

    const sourceChart = {
        series: source.map((item) => item.applicants),
        options: {
            chart: {
                type: "polarArea",
            },
            labels: source.map((item) => item.source),
            colors: [
                "rgba(252, 103, 3, 0.5)",
                "rgba(19, 35, 73, 0.5)",
                "rgba(255, 153, 0, 0.5)",
                "rgba(70, 86, 124, 0.5)",
                "rgba(158, 158, 158, 0.5)",
                "rgba(96, 124, 138, 0.5)",
            ],
            legend: {
                position: "bottom",
            },
            fill: {
                opacity: 0.9,
            },
            stroke: {
                width: 1,
                colors: ["#ffffff"],
            },
        },
    };

    const ageChart = {
        series: [
            {
                name: "Applicants",
                data: ageDistribution.map((item) => item.applicants),
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                    colors: {
                        ranges: [
                            {
                                from: 0,
                                to: 100,
                                color: "#132349",
                            },
                        ],
                    },
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            xaxis: {
                categories: ageDistribution.map((item) => item.age_group),
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
                title: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#132349",
                    },
                },
                labels: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "14px",
                        fontWeight: "bold",
                        colors: "#132349",
                    },
                },
                max:
                    Math.max(
                        ...ageDistribution.map((item) => item.applicants)
                    ) + 4,
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val}`,
                },
            },
        },
    };

    const statusCategories = ["Pending", "Passed", "Failed"];

    const totalApplicants = status.reduce(
        (sum, item) => sum + item.applicants,
        0
    );

    const maxApplicants = Math.max(...status.map((item) => item.applicants));

    const heatmapChartData = {
        series: [
            {
                name: " ",
                data: statusCategories.map((category) => {
                    const statusItem = status.find(
                        (item) => item.status === category
                    );
                    return statusItem ? statusItem.applicants : 0;
                }),
            },
        ],
        options: {
            chart: {
                type: "heatmap",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                heatmap: {
                    colorScale: {
                        ranges: [
                            {
                                from: 0,
                                to: maxApplicants * 0.2,
                                name: "Low",
                                color: "#FD6804",
                            },
                            {
                                from: maxApplicants * 0.2,
                                to: maxApplicants * 0.6,
                                name: "Medium",
                                color: "#FF9B37",
                            },
                            {
                                from: maxApplicants * 0.6,
                                to: maxApplicants,
                                name: "High",
                                color: "#132349",
                            },
                        ],
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: "12px",
                            fontWeight: "bold",
                            colors: ["#28282B"],
                        },
                        formatter: function (value) {
                            return value;
                        },
                    },
                },
            },
            dataLabels: {
                enabled: true,
            },
            xaxis: {
                categories: statusCategories,
                labels: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                        colors: "#28282B",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontFamily: "'Hind Madurai', serif",
                        fontSize: "14px",
                        fontWeight: "bold",
                        colors: "#28282B",
                    },
                },
            },
        },
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
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
            <div className={styles.reports}>
                <Sidebar />
                <div className={styles["reports-container"]}>
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
                            <select
                                className={styles.filter}
                                value={selectedMonth}
                                onChange={handleMonthChange}
                            >
                                {months.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
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
                        <div className={styles.row}>
                            <div
                                className={`${styles["graph-card"]} ${styles["experience-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Experience Distribution
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={experienceChartData.options}
                                        series={experienceChartData.series}
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
                            <div
                                className={`${styles["graph-card"]} ${styles["application-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Application Distribution
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={applicationMethodChart.options}
                                        series={applicationMethodChart.series}
                                        type="donut"
                                        height={250}
                                        width="85%"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className={`${styles["graph-card"]} ${styles["source-card"]}`}
                            >
                                <div className={styles["card-header"]}>
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Source Distribution
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={sourceChart.options}
                                        series={sourceChart.series}
                                        type="polarArea"
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
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Age Distribution
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={ageChart.options}
                                        series={ageChart.series}
                                        type="bar"
                                        height={350}
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
                                    <div className={styles["header-container"]}>
                                        <h1 className={styles.header}>
                                            Status Distribution
                                        </h1>
                                    </div>
                                </div>
                                <div className={styles.graph}>
                                    <Chart
                                        options={heatmapChartData.options}
                                        series={heatmapChartData.series}
                                        type="heatmap"
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

export default ReportsPage;
