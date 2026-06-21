# StudentConnect — Frontend

Single-page web app for **StudentConnect**, a student social network / discussion forum.
Users can register, log in, browse a feed of posts, like them, and read / write / edit /
delete comments.

This module is the React + Vite frontend of the [telekom-team-project](../README.md)
monorepo. It talks to the [Spring Boot backend](../backend/README.md) over plain HTTP.


## 1. Tech stack

| Area            | Technology |
|-----------------|------------|
| Language        | TypeScript 6 |
| UI library      | React 19 (functional components + hooks) |
| Build tool      | Vite 8 (`@vitejs/plugin-react`) |
| Routing         | none — a single conditional render (logged-out vs logged-in) |
| State           | local component state (`useState` / `useRef`) + `localStorage`; no Redux/Context |
| HTTP            | native `fetch` |
| Styling         | hand-written CSS (split per area), CSS variables for theming |
| Icons / avatars | Font Awesome 6.5 (CDN), DiceBear avatars (external API) |
| Linting         | ESLint 10 + `typescript-eslint` |
| Dev port        | `5173` (Vite default — matches the backend's allowed CORS origin) |


## 2. Architecture

The app is a flat React SPA. `App` is an **auth gate**: while logged out it renders only
`AuthPage`; once a valid token is present it renders the main three-column layout.

```
App  (auth gate — reads/validates JWT from localStorage)
│
├── logged OUT ─► AuthPage                 login / register tabs
│
└── logged IN  ─► Navbar                   search · theme · profile/logout · "+ add post"
                  │   └── CreatePostModal  new post (title / content / image)
                  ├── LeftRail             welcome card + "how it works"
                  ├── Feed                 fetches posts, keyboard nav, search filter, stats
                  │   ├── Post  (×N)        single card, optimistic like
                  │   ├── ScrollButtons     up / down
                  │   └── CommentsOverlay   list / add / edit / delete comments
                  └── RightRail            community stats · tip of the day · shortcuts
```

State that several components share is **lifted into `App`** and passed down as props:

| State            | Owner | Produced by        | Consumed by         |
|------------------|-------|--------------------|---------------------|
| `isLoggedIn`     | App   | `getStoredAuth()` / login / logout | the whole gate |
| `searchQuery`    | App   | `Navbar` search input | `Feed` (filters posts) |
| `stats`          | App   | `Feed` (`onStats`) | `RightRail`         |
| `feedRefreshRef` | App   | `Feed` registers its `fetchPosts` | `Navbar` after creating a post |

### Folder layout

```
frontend/
├── index.html                 # Vite entry HTML (mounts #root)
├── vite.config.ts             # Vite + React plugin
├── eslint.config.js
└── src/
    ├── main.tsx               # React entry; applies saved theme, renders <App/>
    ├── App.tsx                # auth gate, layout, shared state, logout
    ├── pages/
    │   └── AuthPage.tsx       # login + registration (client-side validation)
    ├── components/
    │   ├── navbar/            # Navbar (search, theme, profile dropdown, create-post)
    │   ├── feed/              # Feed (post list + data fetch) and Post (single card)
    │   ├── comments/          # CommentsOverlay (modal: list/add/edit/delete)
    │   ├── create-post/       # CreatePostModal (new post, image → data URL)
    │   ├── rail/              # LeftRail + RightRail (side columns)
    │   ├── scroll-buttons/    # ScrollButtons (feed up/down)
    │   └── theme-toggle/      # ThemeToggle (standalone light/dark button)
    ├── services/              # API layer — see note in §6 (currently unused by the UI)
    │   ├── api.config.ts      # API_BASE_URL, endpoint map, token helpers
    │   ├── authService.ts     # register / login
    │   └── postService.ts     # get all / create / delete posts
    ├── api/api.ts             # barrel re-exporting the services layer
    ├── data/posts.ts          # leftover mock posts (not used by the running app)
    ├── styles/                # CSS, one file per area (imported from index.css)
    └── assets/                # images, svgs
```

> Most folders expose an `index.ts` barrel (e.g. `components/feed/index.ts`) so imports
> read `from "../feed"` instead of `from "../feed/Feed"`.


## 3. Pages & components

| Component          | Responsibility |
|--------------------|----------------|
| `App`              | Decodes the stored JWT to decide logged-in/out, owns shared state, handles logout. |
| `AuthPage`         | Login / registration tabs. Validates inputs client-side (Slovak messages) and POSTs to `/auth/login` and `/auth/register`. |
| `Navbar`           | Brand, search box, light/dark toggle, profile dropdown (logout), and the **+ Add post** button that opens `CreatePostModal`. |
| `CreatePostModal`  | New-post form (title, content, optional image). Image is read as a base64 **data URL**, capped at **2 MB**. |
| `Feed`             | Fetches `GET /posts`, maps them to a view model, supports ↑/↓ keyboard navigation, search filtering, and emits aggregate stats. |
| `Post`             | One post card. Like button uses **optimistic UI** (updates instantly, reverts on request failure). |
| `CommentsOverlay`  | Modal for the active post: lists comments and lets the owner add / edit / delete. Closes on `Esc` or backdrop click. |
| `LeftRail`         | Welcome card (avatar + nickname) and a short "how it works" guide. |
| `RightRail`        | Community stats (posts / likes / comments), a daily study tip, and keyboard shortcuts. |
| `ScrollButtons`    | Floating up/down buttons that move the active post in the feed. |
| `ThemeToggle`      | Standalone light/dark button (the same logic is also built into `Navbar`). |


## 4. State, identity & persistence

There is no global store. Cross-session state lives in **`localStorage`**:

| Key             | Set by                     | Used for |
|-----------------|----------------------------|----------|
| `token`         | login                      | JWT sent as `Authorization: Bearer <token>` |
| `userEmail`     | login / register           | profile display |
| `userNickname`  | login / register           | **identity** — avatar seed, comment ownership, post author |
| `userName`      | login / register           | profile display |
| `theme`         | theme toggle               | `"light"` / `"dark"` (applied as `body.light-mode`) |

- **Identity is the nickname.** Avatars are seeded by it (`dicebear` URL), and a comment is
  treated as "own" (editable/deletable) when its author nickname equals `userNickname`.
- **Auth check** (`getStoredAuth` in `App.tsx`) decodes the JWT payload locally and treats
  the user as logged in only while `exp` is in the future — no network call on load.
- **Theme** is applied as early as `main.tsx` (before render) to avoid a flash, then toggled
  from the navbar.


## 5. Backend integration

The frontend expects the backend at **`http://localhost:9090`**. Endpoints actually called:

| Action            | Request                                          | Called from |
|-------------------|--------------------------------------------------|-------------|
| Register          | `POST /auth/register`                            | `AuthPage` |
| Login             | `POST /auth/login`                               | `AuthPage` |
| Logout            | `POST /auth/logout`                              | `App` (handleLogout) |
| List posts        | `GET /posts`                                     | `Feed` |
| Create post       | `POST /posts`                                    | `CreatePostModal` |
| Like / unlike     | `POST` / `DELETE /posts/{id}/likes`              | `Post` |
| List comments     | `GET /posts/{id}/comments`                       | `CommentsOverlay` |
| Add comment       | `POST /posts/{id}/comments`                      | `CommentsOverlay` |
| Edit comment      | `PATCH /posts/{postId}/comments/{commentId}`     | `CommentsOverlay` |
| Delete comment    | `DELETE /posts/{postId}/comments/{commentId}`    | `CommentsOverlay` |

Authenticated requests attach the token manually:

```ts
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
```

See the [backend API reference](../backend/README.md#5-rest-api-reference) for request/response
shapes and validation rules.


## 6. Known caveats & notes

> **Hardcoded base URL.** `http://localhost:9090` is duplicated as a literal in six files
> (`App`, `AuthPage`, `Feed`, `Post`, `CommentsOverlay`, `CreatePostModal`). For deployment
> this should move to a single source — ideally a Vite env var (`import.meta.env.VITE_API_URL`).

> **Unused service layer.** `src/services/` (`api.config.ts`, `authService`, `postService`)
> and the `src/api/api.ts` barrel implement a clean API layer with the same base URL and token
> helpers, but **no component imports them** — the UI calls `fetch` directly instead.
> Consolidating the components onto this layer would remove the duplication above.

> **Like state on load.** `GET /posts` doesn't return a per-user "liked" flag, so hearts always
> render empty after a refresh; the toggle itself is correct and optimistic.

> **External dependencies at runtime.** Avatars (DiceBear) and icons (Font Awesome CDN) are
> fetched from the internet — offline, avatars and glyphs won't render.

> `src/data/posts.ts` is leftover seed/mock data and is not referenced by the live app.

## 7. Build & run

Prerequisites: Node.js + npm.

```bash
cd frontend
npm install        # install dependencies
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # type-check (tsc -b) + production build → dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint
```

Start the [backend](../backend/README.md) first (on `:9090`) so the feed and auth work; the
dev server's origin `http://localhost:5173` is the one the backend's CORS config allows.

### As part of the Gradle build

The frontend is also a Gradle module. The root build bundles it into the backend jar:

```bash
./gradlew :frontend:buildFrontend   # npm install + npm run build (downloads Node automatically)
./gradlew build                     # builds the whole monorepo, frontend included
```
