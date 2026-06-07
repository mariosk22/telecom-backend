# StudentConnect (Telekom Team Project)

Študentská sociálna sieť / diskusné fórum. Používatelia sa môžu zaregistrovať, prihlásiť,
pridávať príspevky, lajkovať ich a komentovať.

Projekt je **monorepo** zložené z dvoch častí:
- **backend** – REST API (Spring Boot, JWT autentifikácia, JPA, MySQL)
- **frontend** – SPA (React + Vite + TypeScript)

---

## 🧱 Technológie

| Vrstva    | Technológie |
|-----------|-------------|
| Backend   | Java 25, Spring Boot 4.0.3, Spring Security, Spring Data JPA, Lombok, JWT (jjwt 0.12.3) |
| Databáza  | MySQL 8 (beží v Dockeri), Hibernate (`ddl-auto=update`) |
| Frontend  | React 19, Vite 8, TypeScript 6 |
| Build     | Gradle (multi-module, wrapper súčasťou repa) |

---

## 📁 Štruktúra projektu

```
telekom-team-project/
├── backend/                # Spring Boot REST API
│   └── src/main/java/com/example/project_10/
│       ├── controller/     # REST endpointy (Auth, Post, Comment, Like)
│       ├── service/        # biznis logika
│       ├── repository/     # prístup do DB (Spring Data JPA)
│       ├── entity/         # JPA entity (User, Post, Comment, Like)
│       ├── dto/            # dátové objekty pre request/response
│       ├── security/       # JWT (filter, util, UserDetailsService)
│       └── config/         # Security + CORS konfigurácia
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── components/     # UI komponenty (feed, navbar, comments...)
│       ├── pages/          # AuthPage (login/registrácia)
│       ├── services/       # volania na backend API
│       └── data/           # dočasné mock dáta
├── build.gradle            # root build (zlepuje frontend do backend jaru)
└── settings.gradle
```
