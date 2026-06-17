# StudentConnect — Backend

REST API for **StudentConnect**, a student social network / discussion forum. Users can
register, log in, create posts, like them and comment on them.

This module is the Spring Boot backend of the [telekom-team-project](../README.md) monorepo.

---

## 1. Tech stack

| Area           | Technology |
|----------------|------------|
| Language       | Java 25 |
| Framework      | Spring Boot 4.0.3 (Web MVC, Data JPA, Security, Validation) |
| Security       | Spring Security + JWT (jjwt 0.12.3), BCrypt password hashing |
| Persistence    | Spring Data JPA / Hibernate (`ddl-auto=update`) |
| Database       | PostgreSQL (configured), H2 (runtime, available for tests) |
| Boilerplate    | Lombok |
| Build          | Gradle (multi-module; wrapper included in repo) |
| Default port   | `9090` |

---

## 2. Architecture

The backend is a classic layered Spring Boot application:

```
HTTP request
   │
   ▼
[ Controller ]   REST endpoints, request validation (@Valid), HTTP status mapping
   │
   ▼
[ Service ]      business logic, ownership checks, DTO ⇄ entity mapping, @Transactional
   │
   ▼
[ Repository ]   Spring Data JPA interfaces (CRUD + derived queries)
   │
   ▼
[ Database ]     PostgreSQL via Hibernate
```

Cross-cutting concerns:

- **`security/`** — JWT creation/validation, the request filter, an in-memory token
  blacklist (logout), and the `UserDetailsService` that loads users from the DB.
- **`config/`** — Spring Security filter chain and CORS configuration.
- **`dto/`** — request/response payloads, decoupling the API from JPA entities.

### Package layout

```
com.example.project_10
├── Application.java            # Spring Boot entry point (@SpringBootApplication)
├── config/
│   ├── SecurityConfig.java     # filter chain, authorization rules, BCrypt bean
│   └── CorsConfig.java         # CORS (allows http://localhost:5173)
├── controller/
│   ├── AuthController.java     # /auth/**
│   ├── PostController.java     # /posts (+ /posts/{id}, /posts/user/{userId})
│   ├── CommentController.java  # /posts/{id}/comments/**
│   ├── LikeController.java     # /posts/{id}/likes
│   └── TestController.java     # / (health string)
├── service/
│   ├── UserService.java        # register / login / lookup
│   ├── PostService.java        # post CRUD + DTO mapping + counts
│   ├── CommentService.java     # comment CRUD + nickname resolution
│   └── LikeService.java        # like / unlike / status
├── repository/
│   ├── UserRepository.java
│   ├── PostRepository.java
│   ├── CommentRepository.java
│   └── LikeRepository.java
├── entity/
│   ├── User.java               # users
│   ├── Post.java               # posts (@ManyToOne User)
│   ├── Comment.java            # comments (raw postId / userId)
│   └── Like.java               # likes (unique post_id + user_id)
├── dto/
│   ├── RegisterDto.java        # registration request (+ validation)
│   ├── LoginDto.java           # login request
│   ├── PostDto.java            # create/update post request
│   ├── PostResponseDto.java    # post response (incl. likes/comments counts)
│   ├── CommentDto.java         # create/update comment request
│   ├── CommentResponseDto.java # comment response
│   └── LikeStatusDto.java      # like count + liked flag
└── security/
    ├── JWTUtil.java                 # create / parse / validate tokens
    ├── JWTFilter.java               # OncePerRequestFilter, populates SecurityContext
    ├── TokenBlacklistService.java   # in-memory blacklist for logged-out tokens
    └── UserDetailsServiceImpl.java  # loads UserDetails by email
```

---

## 3. Data model

```
User 1 ──── * Post
  (Post.user → User via @ManyToOne, FK user_id)

Comment  ── postId, userId  (plain Long columns, no JPA relation)
Like     ── postId, userId  (plain Long columns, unique together)
```

> Note: `Post` references `User` through a real JPA association, while `Comment` and
> `Like` store `postId` / `userId` as plain `Long` columns (no foreign-key association at
> the entity level).

### `users`

| Field         | Column          | Type        | Constraints |
|---------------|-----------------|-------------|-------------|
| id            | `id`            | Long        | PK, identity |
| name          | `name`          | String      | not null |
| surname       | `surname`       | String      | not null |
| nickname      | `nickname`      | String      | not null, **unique** |
| email         | `email`         | String      | not null, **unique** |
| password      | `password`      | String      | not null (BCrypt hash) |
| dateOfBirth   | `date_of_birth` | LocalDate   | — |

### `posts`

| Field      | Column        | Type          | Constraints |
|------------|---------------|---------------|-------------|
| id         | `id`          | Long          | PK, identity |
| title      | `title`       | String(200)   | not null |
| content    | `content`     | String(1000)  | not null |
| image      | `image`       | TEXT          | nullable (URL / base64) |
| user       | `user_id`     | FK → users    | not null, `@ManyToOne(LAZY)` |
| createdAt  | `created_at`  | LocalDateTime | `@CreationTimestamp`, not updatable |

### `comments`

| Field      | Column        | Type          | Constraints |
|------------|---------------|---------------|-------------|
| id         | `id`          | Long          | PK, identity |
| postId     | `post_id`     | Long          | not null |
| userId     | `user_id`     | Long          | not null |
| content    | `content`     | String(1000)  | not null |
| createdAt  | `create_date` | LocalDateTime | not null, set on `@PrePersist` |

### `likes`

| Field      | Column        | Type          | Constraints |
|------------|---------------|---------------|-------------|
| id         | `id`          | Long          | PK, identity |
| postId     | `post_id`     | Long          | not null |
| userId     | `user_id`     | Long          | not null |
| createDate | `create_date` | LocalDateTime | not null, set on `@PrePersist` |

> Unique constraint `uk_likes_post_user` on (`post_id`, `user_id`) prevents a user from
> liking the same post twice.

---

## 4. Security & authentication

### Mechanism

- **Stateless JWT.** No server-side HTTP session (`SessionCreationPolicy.STATELESS`).
- On **login**, the server returns a signed JWT whose subject is the user's email.
- The client sends it on subsequent requests via the `Authorization: Bearer <token>` header.
- `JWTFilter` runs before `UsernamePasswordAuthenticationFilter`. For each request it:
  1. reads the `Authorization` header; if missing or not `Bearer …`, continues unauthenticated;
  2. validates the token signature/expiry and checks it is not blacklisted;
  3. if valid, loads the user (`UserDetailsServiceImpl`) and populates the `SecurityContext`.
- Passwords are hashed with **BCrypt** (`BCryptPasswordEncoder`).
- **Logout** adds the token to an in-memory blacklist (`TokenBlacklistService`) until it expires.

### Token details

- Algorithm: **HS256**.
- Expiration: **24 hours** (`86_400_000` ms).
- Subject: user **email**.

> **Operational caveat:** the signing key is generated in-memory at startup
> (`Keys.secretKeyFor(HS256)` in `JWTUtil`). All previously issued tokens become invalid
> after a restart, and tokens are not portable across multiple instances. For production,
> load a fixed key from configuration/environment. Likewise, the blacklist is in-memory
> and is cleared on restart.

### Authorization rules (`SecurityConfig`)

| Pattern                                   | Access |
|-------------------------------------------|--------|
| `/auth/**`                                | public |
| `/` (health)                              | public |
| `GET  /posts/*/comments`                  | public |
| `POST/PATCH/DELETE /posts/*/comments/**`  | authenticated |
| `GET  /posts/*/likes`                     | public |
| `POST/DELETE /posts/*/likes`              | authenticated |
| **everything else** (incl. `GET /posts`)  | authenticated |

> CSRF is disabled (stateless API). CORS allows origin `http://localhost:5173`
> with credentials, methods `GET, POST, PUT, DELETE, OPTIONS`.

---

## 5. REST API reference

Base URL (local dev): `http://localhost:9090`

Conventions used below:
- **Auth** column: 🔓 public · 🔑 requires `Authorization: Bearer <token>`.
- All request/response bodies are JSON unless noted.

### 5.1 Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | 🔓 | Returns the plain text `Backend is running`. |

---

### 5.2 Authentication — `/auth`

#### `POST /auth/register` 🔓

Registers a new user. All fields are validated (see constraints).

Request body:
```json
{
  "email": "jane@example.com",
  "name": "Jane",
  "surname": "Doe",
  "nickname": "janedoe",
  "password": "Passw0rd!",
  "birthDate": "2000-05-17"
}
```

Validation constraints:

| Field      | Rules |
|------------|-------|
| email      | not blank, valid email format |
| name       | not blank, 2–50 chars |
| surname    | not blank, 2–50 chars |
| nickname   | not blank, 3–50 chars, alphanumeric only (`^[a-zA-Z0-9]+$`) |
| password   | not blank, min 8 chars, must contain an uppercase letter, a digit and a special char `!@#$%^&*` |
| birthDate  | not null, must be in the past, user must be **≥ 15 years old** |

Responses:

| Status | Body |
|--------|------|
| `200 OK` | `{ "message": "Register successfully!" }` |
| `400 Bad Request` | `{ "message": "Register failed!" }` (e.g. email/nickname already exists) |

> Bean-validation failures (`@Valid`) are reported by Spring's default validation handling
> before the controller body runs.

#### `POST /auth/login` 🔓

Authenticates a user and issues a JWT.

Request body:
```json
{ "email": "jane@example.com", "password": "Passw0rd!" }
```

Responses:

| Status | Body |
|--------|------|
| `200 OK` | `{ "token": "<jwt>", "nickname": "janedoe", "name": "Jane" }` |
| `401 Unauthorized` | `{ "message": "Login failed!" }` |

#### `POST /auth/logout` 🔓 *(token optional)*

Blacklists the supplied bearer token until it expires.

| Header | `Authorization: Bearer <token>` (optional) |
|--------|--------------------------------------------|

Response:

| Status | Body |
|--------|------|
| `200 OK` | `{ "message": "Logout successfully!" }` |

---

### 5.3 Posts — `/posts`

`PostResponseDto` shape:
```json
{
  "id": 1,
  "userId": 7,
  "title": "How to set up Gradle?",
  "content": "I'm stuck on…",
  "image": null,
  "nickname": "janedoe",
  "likes": 3,
  "comments": 2,
  "createdAt": "2026-06-16T10:42:11"
}
```

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/posts` | 🔑 | All posts, newest first. → `200` `PostResponseDto[]` · `400 "Loading posts failed!"` |
| GET | `/posts/{id}` | 🔑 | Single post by id. → `200` `PostResponseDto` · `400 "Loading post failed!"` |
| GET | `/posts/user/{userId}` | 🔑 | Posts by a given user, newest first. → `200` `PostResponseDto[]` · `400 "Loading user posts failed!"` |
| POST | `/posts` | 🔑 | Create a post (author = current user). → `201` `PostResponseDto` · `400 "Creating post failed!"` |
| PATCH | `/posts/{id}` | 🔑 | Update own post. → `200` `PostResponseDto` · `401 "User not found!"` · `400 "Updating post failed!"` |
| DELETE | `/posts/{id}` | 🔑 | Delete own post (also deletes its comments & likes). → `200 "Post deleted successfully!"` · `400 "Deleting post failed!"` |

`PostDto` request body (create / update):
```json
{ "title": "My title", "content": "My content", "image": "https://…" }
```

| Field   | Rules |
|---------|-------|
| title   | not blank, 1–200 chars |
| content | not blank, 1–1000 chars |
| image   | optional |

> Ownership: `PATCH`/`DELETE` succeed only if the post belongs to the authenticated user;
> otherwise the service throws and the controller returns `400`. On `PATCH`, `image` is only
> overwritten when a non-null value is supplied.

---

### 5.4 Comments — `/posts/{id}/comments`

`CommentResponseDto` shape:
```json
{
  "id": 5,
  "postId": 1,
  "userId": 7,
  "nickname": "janedoe",
  "content": "Great question!",
  "createdDate": "2026-06-16T11:03:55"
}
```

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/posts/{id}/comments` | 🔓 | List comments for a post. → `200` `CommentResponseDto[]` · `400 "Loading comments failed!"` |
| POST | `/posts/{id}/comments` | 🔑 | Add a comment. → `201` `CommentResponseDto` · `404 "Post not found!"` · `400 "Creating comment failed!"` |
| PATCH | `/posts/{postId}/comments/{commentId}` | 🔑 | Edit own comment. → `200` `CommentResponseDto` · `401` · `404 "Comment not found!"` · `403 "You are not allowed to update comment!"` · `400` |
| DELETE | `/posts/{postId}/comments/{commentId}` | 🔑 | Delete own comment. → `204 No Content` · `401` · `404 "Comment not found!"` · `403 "You are not allowed to delete comment!"` · `400` |

`CommentDto` request body (create / update):
```json
{ "content": "My comment text" }
```

| Field   | Rules |
|---------|-------|
| content | not blank, 1–1000 chars |

> Ownership: `PATCH`/`DELETE` are allowed only if the comment's `userId` matches the
> authenticated user (`403` otherwise).

---

### 5.5 Likes — `/posts/{id}/likes`

`LikeStatusDto` shape:
```json
{ "count": 3, "liked": true }
```
- `count` — total likes on the post.
- `liked` — whether the **current** user has liked it (`false` if unauthenticated).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/posts/{id}/likes` | 🔓 | Like status for a post. → `200` `LikeStatusDto` · `400 "Loading likes failed!"` |
| POST | `/posts/{id}/likes` | 🔑 | Like a post (idempotent — no duplicate). → `200` `LikeStatusDto` · `401 "Unauthorized!"` · `400 "Like failed!"` |
| DELETE | `/posts/{id}/likes` | 🔑 | Remove the current user's like. → `200` `LikeStatusDto` · `401 "Unauthorized!"` · `400 "Unlike failed!"` |

---

## 6. Configuration

Configuration lives in [`src/main/resources/application.properties`](src/main/resources/application.properties).

| Property | Purpose |
|----------|---------|
| `server.port` | HTTP port (`9090`) |
| `spring.datasource.url` | JDBC URL of the database |
| `spring.datasource.username` / `password` | DB credentials |
| `spring.datasource.driver-class-name` | JDBC driver |
| `spring.jpa.hibernate.ddl-auto=update` | Hibernate auto-updates the schema on startup |
| `spring.jpa.show-sql=true` | Logs generated SQL |

> ⚠️ **Security & consistency notes**
> - Datasource credentials are currently committed in plain text. Move them to environment
>   variables / a non-committed profile (e.g. `application-local.properties`) and rotate any
>   exposed credentials.
> - `application.properties` targets **PostgreSQL**, but this module's `build.gradle`
>   declares the **MySQL** driver (`com.mysql:mysql-connector-j`). Align the JDBC driver
>   dependency with the database you actually run against (add `org.postgresql:postgresql`
>   for PostgreSQL).

---

## 7. Build & run

This is a Gradle module of the monorepo. From the **repository root**:

```bash
# Run the backend (Spring Boot)
./gradlew :backend:bootRun

# Build the jar
./gradlew :backend:build

# Run tests
./gradlew :backend:test
```

On Windows use `gradlew.bat` instead of `./gradlew`.

The API will be available at `http://localhost:9090`. A quick health check:

```bash
curl http://localhost:9090/
# -> Backend is running
```

### Typical flow

```bash
# 1. Register
curl -X POST http://localhost:9090/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","name":"Jane","surname":"Doe","nickname":"janedoe","password":"Passw0rd!","birthDate":"2000-05-17"}'

# 2. Login -> copy the "token" from the response
curl -X POST http://localhost:9090/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"Passw0rd!"}'

# 3. Create a post (use the token)
curl -X POST http://localhost:9090/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Hello","content":"My first post"}'
```

---

## 8. Error handling convention

Controllers wrap their logic in `try/catch` and return a **generic message with a `400`
status** on failure (e.g. `"Creating post failed!"`), rather than mapping specific error
types. Authorization/ownership violations inside services surface as `400` as well (except
where the controller explicitly returns `401`/`403`/`404`). Consider centralizing this with
a `@ControllerAdvice` / `@ExceptionHandler` to return precise status codes and messages.
