# Backend — StudentConnect REST API

Spring Boot 4 REST API pre platformu **StudentConnect**. Poskytuje autentifikáciu,
správu príspevkov, komentárov, lajkov, **súkromných správ** a vyhľadávanie používateľov
cez JWT-chránené HTTP endpointy.

Tento modul je Spring Boot backend monorepa [telekom-team-project](../README.md).

---

## Tech stack

| Závislosť                       | Verzia / poznámka                     |
|---------------------------------|---------------------------------------|
| Java                            | 25                                    |
| Spring Boot                     | 4.0.3                                 |
| Spring Security                 | spravované Spring Boot 4.0.3 BOM      |
| Spring Data JPA / Hibernate     | spravované Spring Boot 4.0.3 BOM      |
| PostgreSQL driver               | `org.postgresql:postgresql` (runtime) |
| H2 (in-memory, test/runtime)    | `com.h2database:h2` (runtime)         |
| Lombok                          | spravované BOM                        |
| jjwt (JJWT)                     | 0.12.3                                |
| Jakarta Validation              | `spring-boot-starter-validation`      |
| Build                           | Gradle (multi-modul, wrapper v repe)  |

---

## Spustenie

```bash
# z koreňa monorepa
./gradlew :backend:bootRun
```

Aplikácia štartuje na `http://localhost:9090`.

> **Pozn.:** `:backend:bootRun` (rovnako ako `build`/`assemble`) cez `processResources`
> najprv spustí `:frontend:build` a skopíruje výstup frontendu do `static/`. Ak frontend
> nekompiluje, padne aj spustenie backendu cez Gradle.

Rýchly health check:

```bash
curl http://localhost:9090/
# -> Backend is running
```

---

## Konfigurácia (`application.properties`)

```properties
spring.application.name=Project 1.0
server.port=9090

# PostgreSQL
spring.datasource.url=jdbc:postgresql://cloud.kosickaakademia.sk:5432/student_connect_db
spring.datasource.username=student_connect_admin
spring.datasource.password=STUDENTCONNECT2
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> **Bezpečnostné upozornenie:** Credentials sú momentálne priamo v `application.properties`
> (verzionované v gite). Pre produkciu presuňte citlivé hodnoty do environment premenných
> (`SPRING_DATASOURCE_PASSWORD` atď.) alebo do externalizovanej / necommitnutej konfigurácie
> (`application-local.properties`, Vault, Kubernetes Secrets) a **rotujte vystavené heslo**.

---

## Architektúra — vrstvy

```
controller/   ← HTTP vstup, validácia requestov (@Valid), mapovanie na HTTP odpovede
service/      ← biznis logika, ownership checky, transakcie (@Transactional)
repository/   ← prístup do DB (Spring Data JPA interfaces)
entity/       ← JPA entity mapované na DB tabuľky
dto/          ← dátové objekty pre request/response (oddelené od entity)
security/     ← JWT filter, util, token blacklist, UserDetailsService
config/       ← Security filter chain, CORS konfigurácia
exception/    ← ApiException + globálny @RestControllerAdvice handler
```

---

## Dátový model

```
User 1 ──── * Post          (Post.user → User cez @ManyToOne, FK user_id)
User 1 ──── * Message        (sender_id / recipient_id → User cez @ManyToOne)

Comment  ── postId, userId   (plain Long stĺpce, bez JPA relácie)
Like     ── postId, userId   (plain Long stĺpce, unikátna kombinácia)
```

> `Post` a `Message` referujú `User` cez reálnu JPA asociáciu, kým `Comment` a `Like`
> ukladajú `postId` / `userId` ako obyčajné `Long` stĺpce (bez FK asociácie na úrovni entity).

### `User` (tabuľka `users`)

| Stĺpec          | Typ         | Obmedzenia             |
|-----------------|-------------|------------------------|
| `id`            | `BIGINT`    | PK, identity           |
| `name`          | `VARCHAR`   | NOT NULL               |
| `surname`       | `VARCHAR`   | NOT NULL               |
| `nickname`      | `VARCHAR`   | NOT NULL, UNIQUE       |
| `email`         | `VARCHAR`   | NOT NULL, UNIQUE       |
| `password`      | `VARCHAR`   | NOT NULL (BCrypt hash) |
| `date_of_birth` | `DATE`      | nullable               |

### `Post` (tabuľka `posts`)

| Stĺpec       | Typ            | Obmedzenia                       |
|--------------|----------------|----------------------------------|
| `id`         | `BIGINT`       | PK, identity                     |
| `title`      | `VARCHAR(200)` | NOT NULL                         |
| `content`    | `VARCHAR(1000)`| NOT NULL                         |
| `image`      | `TEXT`         | nullable (base64 data URL / URL) |
| `user_id`    | `BIGINT`       | FK → `users.id`, NOT NULL, LAZY  |
| `created_at` | `TIMESTAMP`    | `@CreationTimestamp`, not updatable |

### `Comment` (tabuľka `comments`)

| Stĺpec        | Typ            | Obmedzenia                    |
|---------------|----------------|-------------------------------|
| `id`          | `BIGINT`       | PK, identity                  |
| `post_id`     | `BIGINT`       | NOT NULL (plain Long)         |
| `user_id`     | `BIGINT`       | NOT NULL (plain Long)         |
| `content`     | `VARCHAR(1000)`| NOT NULL                      |
| `create_date` | `TIMESTAMP`    | NOT NULL, set cez `@PrePersist` |

### `Like` (tabuľka `likes`)

| Stĺpec        | Typ         | Obmedzenia                     |
|---------------|-------------|--------------------------------|
| `id`          | `BIGINT`    | PK, identity                   |
| `post_id`     | `BIGINT`    | NOT NULL                       |
| `user_id`     | `BIGINT`    | NOT NULL                       |
| `create_date` | `TIMESTAMP` | NOT NULL, set cez `@PrePersist`|

> Unikátne obmedzenie `uk_likes_post_user` na (`post_id`, `user_id`) bráni dvojnásobnému
> lajku toho istého postu jedným používateľom.

### `Message` (tabuľka `messages`)

| Stĺpec         | Typ            | Obmedzenia                         |
|----------------|----------------|------------------------------------|
| `id`           | `BIGINT`       | PK, identity                       |
| `content`      | `VARCHAR(1000)`| NOT NULL                           |
| `sender_id`    | `BIGINT`       | FK → `users.id`, NOT NULL, LAZY    |
| `recipient_id` | `BIGINT`       | FK → `users.id`, NOT NULL, LAZY    |
| `created_at`   | `TIMESTAMP`    | `@CreationTimestamp`, not updatable|

---

## REST API

Base URL (lokálne): `http://localhost:9090`. Telá requestov/odpovedí sú JSON.
**verejné** = bez tokenu · **token** = vyžaduje `Authorization: Bearer <token>`.

### Health

| Metóda | Endpoint | Auth | Popis                                  |
|--------|----------|------|----------------------------------------|
| `GET`  | `/`      | verejné   | Vráti plain text `Backend is running`. |

### Autentifikácia (`/auth`)

| Metóda | Endpoint         | Auth | Body (JSON)                                                | Odpoveď                                          |
|--------|------------------|------|------------------------------------------------------------|--------------------------------------------------|
| `POST` | `/auth/register` | verejné   | `{ email, name, surname, nickname, password, birthDate }`  | `200 { message }` · `400 { message:"Register failed!" }` |
| `POST` | `/auth/login`    | verejné   | `{ email, password }`                                      | `200 { token, userId, nickname, name }` · `401 { message:"Login failed!" }` |
| `POST` | `/auth/logout`   | verejné* | — (header `Authorization: Bearer <token>`, voliteľný)      | `200 { message:"Logout successfully!" }`         |

> *Logout token nevyžaduje, ale ak je priložený a platný, uloží sa do blacklistu do expirácie.

### Príspevky (`/posts`)

`GET /posts`, `GET /posts/{id}` aj `GET /posts/user/{userId}` **vyžadujú autentifikáciu**
(spadajú pod `anyRequest().authenticated()`).

| Metóda   | Endpoint                | Auth | Body (JSON)                    | Odpoveď                 |
|----------|-------------------------|------|--------------------------------|-------------------------|
| `GET`    | `/posts`                | token   | —                              | `200 PostResponseDto[]` |
| `GET`    | `/posts/{id}`           | token   | —                              | `200 PostResponseDto`   |
| `GET`    | `/posts/user/{userId}`  | token   | —                              | `200 PostResponseDto[]` |
| `POST`   | `/posts`                | token   | `{ title, content, image? }`   | `201 PostResponseDto`   |
| `PATCH`  | `/posts/{id}`           | token   | `{ title, content, image? }`   | `200 PostResponseDto` · `403` ak nie je vlastník |
| `DELETE` | `/posts/{id}`           | token   | —                              | `204 No Content` (zmaže aj komentáre a lajky) · `403` ak nie je vlastník |

`PostDto` (create/update): `title` (NOT BLANK, 1–200), `content` (NOT BLANK, 1–1000),
`image` (voliteľné). Pri `PATCH` sa `image` prepíše len ak je dodaná nenulová hodnota.

### Komentáre (`/posts/{id}/comments`)

| Metóda   | Endpoint                         | Auth         | Body          | Odpoveď                  |
|----------|----------------------------------|--------------|---------------|--------------------------|
| `GET`    | `/posts/{id}/comments`           | verejné   | —             | `200 CommentResponseDto[]` |
| `POST`   | `/posts/{id}/comments`           | prihlásený| `{ content }` | `201 CommentResponseDto` · `404` ak post neexistuje |
| `PATCH`  | `/posts/{postId}/comments/{id}`  | vlastník  | `{ content }` | `200 CommentResponseDto` · `403`/`404` |
| `DELETE` | `/posts/{postId}/comments/{id}`  | vlastník  | —             | `204 No Content` · `403`/`404` |

`CommentDto`: `content` (NOT BLANK, 1–1000).

### Lajky (`/posts/{id}/likes`)

| Metóda   | Endpoint              | Auth         | Odpoveď                                |
|----------|-----------------------|--------------|----------------------------------------|
| `GET`    | `/posts/{id}/likes`   | verejné   | `200 { count, liked }` (`liked=false` ak neprihlásený) |
| `POST`   | `/posts/{id}/likes`   | prihlásený| `200 { count, liked }` (idempotentné — bez duplicít) · `401` |
| `DELETE` | `/posts/{id}/likes`   | prihlásený| `200 { count, liked }` · `401`         |

### Správy (`/messages`) — všetko vyžaduje token

| Metóda | Endpoint                          | Body (JSON)              | Odpoveď                    |
|--------|-----------------------------------|--------------------------|----------------------------|
| `POST` | `/messages`                       | `{ recipientId, content }` | `201 MessageResponseDto` · `404` neexistujúci príjemca · `400` správa sebe |
| `GET`  | `/messages/conversations`         | —                        | `200 ConversationDto[]` (zoznam konverzácií, posledná správa) |
| `GET`  | `/messages/conversation/{userId}` | —                        | `200 MessageResponseDto[]` (celá konverzácia s daným používateľom) |
| `GET`  | `/messages/inbox`                 | —                        | `200 MessageResponseDto[]` (prijaté) |
| `GET`  | `/messages/sent`                  | —                        | `200 MessageResponseDto[]` (odoslané) |

`MessageDto`: `recipientId` (NOT NULL), `content` (NOT BLANK, 1–1000).

### Používatelia (`/users`) — vyžaduje token

| Metóda | Endpoint              | Auth | Odpoveď                                          |
|--------|-----------------------|------|--------------------------------------------------|
| `GET`  | `/users/search?q=...` | token   | `200 UserSearchDto[]` (podľa nicknamu, bez seba; prázdne pri prázdnom `q`) |

---

## Bezpečnosť

### JWT

- Algoritmus: **HS256**
- Platnosť tokenu: **24 hodín** (`86_400_000` ms), subject = **email** používateľa
- Kľúč je generovaný **in-memory** pri každom štarte (`Keys.secretKeyFor(HS256)` v `JWTUtil`)
  — všetky existujúce tokeny sa zneplatnia pri reštarte a nie sú prenosné medzi inštanciami
- Token sa posiela v hlavičke: `Authorization: Bearer <token>`
- `JWTFilter` beží pred `UsernamePasswordAuthenticationFilter`; pri chýbajúcom/neplatnom/blacklistovanom
  tokene request pokračuje neautentifikovane (chránené endpointy potom vrátia `403`)

> **Pre produkciu:** načítavajte fixný kľúč z konfigurácie/environmentu.

### Token blacklist

Po volaní `/auth/logout` sa token uloží do `TokenBlacklistService` (in-memory `ConcurrentHashMap`)
až do jeho prirodzenej expirácie. `JWTFilter` pri každom requeste overí, či token nie je blacklistovaný.

> **Obmedzenie:** Blacklist je in-memory — po reštarte sa vyprázdni a nefunguje cez viac
> inštancií. Pre produkciu zvážte perzistentné riešenie (napr. Redis).

### Heslá

Hashované pomocou **BCrypt** (`BCryptPasswordEncoder`, Spring Security).

### CORS

- Povolený origin: `http://localhost:5173` (Vite dev server)
- Povolené metódy: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `allowCredentials = true`
- Pre produkciu zmeňte `CorsConfig.java` na skutočnú doménu.

### Endpointy bez autentifikácie (permitAll)

- `/auth/**` (register, login, logout)
- `GET /` (health / servovanie React SPA)
- `GET /posts/*/comments`
- `GET /posts/*/likes`

> Všetko ostatné — vrátane `GET /posts`, `/messages/**`, `/users/**` — vyžaduje autentifikáciu.
> CSRF je vypnuté (stateless API), session policy `STATELESS`.

---

## DTO objekty

| DTO                  | Smer     | Polia                                                                 |
|----------------------|----------|-----------------------------------------------------------------------|
| `RegisterDto`        | Request  | `email, name, surname, nickname, password, birthDate` (+ validácia)   |
| `LoginDto`           | Request  | `email, password`                                                     |
| `PostDto`            | Request  | `title, content, image?`                                              |
| `PostResponseDto`    | Response | `id, userId, title, content, image, nickname, likes, comments, createdAt` |
| `CommentDto`         | Request  | `content`                                                             |
| `CommentResponseDto` | Response | `id, postId, userId, nickname, content, createdDate`                  |
| `LikeStatusDto`      | Response | `count, liked`                                                        |
| `MessageDto`         | Request  | `recipientId, content`                                                |
| `MessageResponseDto` | Response | `id, senderId, senderNickname, recipientId, recipientNickname, content, createdAt` |
| `ConversationDto`    | Response | `userId, nickname, lastMessage, lastMessageAt, lastMessageFromMe`     |
| `UserSearchDto`      | Response | `id, nickname, name, surname` (zámerne **bez** emailu a hesla)        |

### Validačné pravidlá `RegisterDto`

| Pole       | Pravidlá |
|------------|----------|
| `email`    | not blank, platný email formát |
| `name`     | not blank, 2–50 znakov |
| `surname`  | not blank, 2–50 znakov |
| `nickname` | not blank, 3–50 znakov, len alfanumerické (`^[a-zA-Z0-9]+$`) |
| `password` | not blank, min 8 znakov, musí obsahovať veľké písmeno, číslo a špeciálny znak `!@#$%^&*` |
| `birthDate`| not null, musí byť v minulosti, používateľ **≥ 15 rokov** |

---

## Spracovanie chýb

Centralizované v `exception/GlobalExceptionHandler` (`@RestControllerAdvice`):

| Výnimka                          | Odpoveď |
|----------------------------------|---------|
| `ApiException(status, message)`  | daný `status` + `{ "message": ... }` |
| `MethodArgumentNotValidException`| `400` + mapa `{ pole: chyba }` (z `@Valid`) |
| ostatné `Exception`              | `500 { "message": "Something went wrong" }` |

> Výnimka: `AuthController` si `register`/`login` ošetruje vlastným `try/catch`
> (generické `400 "Register failed!"` / `401 "Login failed!"`), takže tieto dva endpointy
> neprechádzajú cez globálny handler.

---

## Build

```bash
# Plný build (vrátane frontendu — processResources ťahá :frontend:build)
./gradlew :backend:build

# Len kompilácia Java zdrojákov (bez frontendu)
./gradlew :backend:compileJava
```

Produkčný JAR: `backend/build/libs/backend-0.0.1-SNAPSHOT.jar`

> Pozn.: `assemble`/`bootJar`/`bootRun` cez `processResources` závisia od `:frontend:build`.
> Ak chceš baliť backend úplne bez frontendu, treba odstrániť túto závislosť v `backend/build.gradle`.
