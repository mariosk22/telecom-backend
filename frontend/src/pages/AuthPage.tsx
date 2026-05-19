// src/pages/AuthPage.tsx
import React, { useState } from "react";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const MIN_AGE = 15;
const API_BASE_URL = "YOUR_API_URL";

const AuthPage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    // Login
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regAge, setRegAge] = useState("");
    const [regConfirm, setRegConfirm] = useState("");

    const [errors, setErrors] = useState<any>({});

    const validateLogin = () => {
        const err: any = {};
        if (!loginUsername || loginUsername.trim().length < 3)
            err.username = "Username musí mať aspoň 3 znaky";
        if (!loginPassword || loginPassword.length < 8)
            err.password = "Heslo musí mať aspoň 8 znakov";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const validateRegister = () => {
        const err: any = {};
        if (!regUsername || regUsername.trim().length < 3)
            err.username = "Nickname musí mať aspoň 3 znaky";
        if (!regEmail || !regEmail.includes("@"))
            err.email = "Zadajte platný email";
        if (!regPassword || !passwordRegex.test(regPassword))
            err.password =
                "Heslo musí obsahovať písmeno, číslo a špeciálny znak (min 8 znakov)";

        if (!regAge) {
            err.age = "Vyberte dátum narodenia";
        } else {
            const birth = new Date(regAge);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            if (
                new Date(today.getFullYear(), today.getMonth(), today.getDate()) <
                new Date(birth.getFullYear() + age, birth.getMonth(), birth.getDate())
            )
                age--;
            if (age < MIN_AGE) err.age = `Musíte mať minimálne ${MIN_AGE} rokov`;
        }

        if (regPassword !== regConfirm) err.confirm = "Heslá sa nezhodujú";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTab === "login") {
            if (!validateLogin()) return;

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginUsername,
                    password: loginPassword,
                }),
            });

            if (!response.ok) {
                return;
            }

            onSuccess();
        } else {
            if (!validateRegister()) return;

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: regEmail,
                    name: "YOUR_NAME",
                    nickname: regUsername,
                    password: regPassword,
                    surname: "YOUR_SURNAME",
                    birthDate: regAge,
                }),
            });

            if (!response.ok) {
                return;
            }

            onSuccess();
        }
    };

    return (
        <div className="auth-container">
            <div className="tab-group">
                <button
                    className={`tab ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => setActiveTab("login")}
                >
                    Login
                </button>
                <button
                    className={`tab ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => setActiveTab("register")}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {activeTab === "login" ? (
                    <>
                        <div className="input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                                placeholder="Zadajte username"
                                required
                            />
                            {errors.username && (
                                <p className="text-red-500">{errors.username}</p>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Heslo</label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500">{errors.password}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-group">
                            <label>Nickname</label>
                            <input
                                type="text"
                                value={regUsername}
                                onChange={(e) => setRegUsername(e.target.value)}
                                placeholder="Zadajte prezývku"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Dátum narodenia</label>
                            <input
                                type="date"
                                value={regAge}
                                onChange={(e) => setRegAge(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Heslo</label>
                            <input
                                type="password"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Potvrďte heslo</label>
                            <input
                                type="password"
                                value={regConfirm}
                                onChange={(e) => setRegConfirm(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className={`submit-btn ${activeTab === "register" ? "register-variant" : ""}`}
                >
                    {activeTab === "login" ? "Prihlásiť sa" : "Vytvoriť účet"}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;
