import React, { useState } from "react";

const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
const MIN_AGE = 15;
const API_BASE_URL = "http://localhost:9090";

const AuthPage: React.FC<{ onSuccess: () => void }> = ({ onSuccess }: { onSuccess: () => void }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regSurname, setRegSurname] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const [errors, setErrors] = useState<any>({});

  const validateLogin = () => {
    const err: any = {};
    if (!loginEmail || !loginEmail.includes("@"))
      err.loginEmail = "Zadajte platný e-mail";
    if (!loginPassword || loginPassword.length < 8)
      err.loginPassword = "Heslo musí mať aspoň 8 znakov";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateRegister = () => {
    const err: any = {};
    if (!regName || regName.trim().length < 2)
      err.name = "Meno musí mať aspoň 2 znaky";
    if (!regSurname || regSurname.trim().length < 2)
      err.surname = "Priezvisko musí mať aspoň 2 znaky";
    if (!regUsername || regUsername.trim().length < 3)
      err.username = "Nickname musí mať aspoň 3 znaky";
    if (!regEmail || !regEmail.includes("@"))
      err.email = "Zadajte platný email";
    if (!regPassword || !passwordRegex.test(regPassword))
      err.password = "Heslo musí obsahovať písmeno, číslo a špeciálny znak (min 8 znakov)";
    if (!regAge) {
      err.age = "Vyberte dátum narodenia";
    } else {
      const birth = new Date(regAge);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const birthdayThisYear = new Date(birth.getFullYear() + age, birth.getMonth(), birth.getDate());
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (todayMidnight < birthdayThisYear) age--;
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
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        if (!response.ok) {
          setErrors({ loginEmail: "Nesprávny email alebo heslo" });
          return;
        }
        const data = await response.json();
        if (data?.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userEmail", loginEmail);
        }
        if (data?.nickname) localStorage.setItem("userNickname", data.nickname);
        if (data?.name) localStorage.setItem("userName", data.name);
        onSuccess();
      } catch {
        setErrors({ loginEmail: "Chyba pripojenia k serveru" });
      }
    } else {
      if (!validateRegister()) return;
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: regEmail,
            name: regName,
            nickname: regUsername,
            password: regPassword,
            surname: regSurname,
            birthDate: regAge,
          }),
        });
        if (!response.ok) {
          setErrors({ email: "Registrácia zlyhala, skús iný email" });
          return;
        }
        localStorage.setItem("userNickname", regUsername);
        localStorage.setItem("userName", regName);
        setActiveTab("login");
        setErrors({});
      } catch {
        setErrors({ email: "Chyba pripojenia k serveru" });
      }
    }
  };

  return (
      <div className="auth-shell">
        <div className="auth-brand">
          <div className="auth-brand-blob auth-brand-blob-1"></div>
          <div className="auth-brand-blob auth-brand-blob-2"></div>
          <div className="auth-brand-content">
            <div className="auth-logo">Student<span>Connect</span></div>
            <h1 className="auth-tagline">Miesto, kde študenti riešia problémy spoločne.</h1>
            <p className="auth-subtagline">
              Opýtaj sa na čokoľvek, pomôž ostatným a uč sa rýchlejšie — všetko na jednom mieste.
            </p>
            <ul className="auth-features">
              <li><i className="fa-solid fa-circle-question"></i> Pýtaj sa na čokoľvek zo školy</li>
              <li><i className="fa-solid fa-comments"></i> Odpovede priamo od komunity</li>
              <li><i className="fa-solid fa-heart"></i> Zbieraj a označuj užitočné rady</li>
            </ul>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="auth-container">
            <div className="auth-mobile-logo">Student<span>Connect</span></div>

            <div className="tab-group">
              <button
                  className={`tab ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => { setActiveTab("login"); setErrors({}); }}
              >
                Prihlásenie
              </button>
              <button
                  className={`tab ${activeTab === "register" ? "active" : ""}`}
                  onClick={() => { setActiveTab("register"); setErrors({}); }}
              >
                Registrácia
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "login" ? (
                  <>
                    <div className="input-group">
                      <label>E-mail</label>
                      <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="Zadajte e-mail"
                          required
                      />
                      {errors.loginEmail && <p className="text-red-500">{errors.loginEmail}</p>}
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
                      {errors.loginPassword && <p className="text-red-500">{errors.loginPassword}</p>}
                    </div>
                  </>
              ) : (
                  <>
                    <div className="auth-row">
                      <div className="input-group">
                        <label>Meno</label>
                        <input
                            type="text"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder="Zadajte meno"
                            required
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                      </div>
                      <div className="input-group">
                        <label>Priezvisko</label>
                        <input
                            type="text"
                            value={regSurname}
                            onChange={(e) => setRegSurname(e.target.value)}
                            placeholder="Zadajte priezvisko"
                            required
                        />
                        {errors.surname && <p className="text-red-500">{errors.surname}</p>}
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Prezývka</label>
                      <input
                          type="text"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          placeholder="Zadajte prezývku"
                          required
                      />
                      {errors.username && <p className="text-red-500">{errors.username}</p>}
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
                      {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                      <label>Dátum narodenia</label>
                      <input
                          type="date"
                          value={regAge}
                          onChange={(e) => setRegAge(e.target.value)}
                          required
                      />
                      {errors.age && <p className="text-red-500">{errors.age}</p>}
                    </div>
                    <div className="auth-row">
                      <div className="input-group">
                        <label>Heslo</label>
                        <input
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
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
                        {errors.confirm && <p className="text-red-500">{errors.confirm}</p>}
                      </div>
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
        </div>
      </div>
  );
};

export default AuthPage;
