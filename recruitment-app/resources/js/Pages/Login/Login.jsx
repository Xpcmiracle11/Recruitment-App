import React from "react";
import { useForm } from "@inertiajs/react";
import styles from "../../../css/Login.module.css";
import logo from "../../../images/trualliant-logo.svg";
import emailIcon from "../../../images/email.svg";
import passwordIcon from "../../../images/padlock.svg";

const Login = () => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };
    return (
        <div className={styles.login}>
            <h1 className={styles["login-header"]}>ADMIN LOGIN</h1>
            <form className={styles["form-container"]} onSubmit={handleSubmit}>
                <div className={styles["left-side"]}>
                    <div className={styles["logo-container"]}>
                        <img className={styles.logo} src={logo} alt="logo" />
                    </div>
                </div>
                <div className={styles["right-side"]}>
                    <div className={styles.row}>
                        <h1 className={styles["right-side-header"]}>
                            Welcome Back
                        </h1>
                    </div>
                    <div className={styles.row}>
                        <label
                            className={`${styles["field-label"]} ${styles["email-label"]}`}
                            htmlFor="email"
                        >
                            <div className={styles["input-container"]}>
                                <input
                                    className={`${styles.field} ${styles.email}`}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <div className={styles["icon-container"]}>
                                    <img
                                        className={styles["input-icon"]}
                                        src={emailIcon}
                                        alt="email"
                                    />
                                </div>
                            </div>
                            Email
                        </label>
                    </div>
                    <div className={styles.row}>
                        <label
                            className={`${styles["field-label"]} ${styles["password-label"]}`}
                            htmlFor="password"
                        >
                            <div className={styles["input-container"]}>
                                <input
                                    className={`${styles.field} ${styles.password}`}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                <div className={styles["icon-container"]}>
                                    <img
                                        className={styles["input-icon"]}
                                        src={passwordIcon}
                                        alt="password"
                                    />
                                </div>
                            </div>
                            Password
                            {errors.password && (
                                <p className={styles.error}>
                                    {errors.password}
                                </p>
                            )}
                        </label>
                    </div>
                    <div className={styles.row}>
                        <div className={styles["button-container"]}>
                            <button
                                type="submit"
                                className={styles["login-button"]}
                                disabled={processing}
                            >
                                {processing ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
