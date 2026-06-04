const API_BASE_URL = "http://localhost:9090";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "omit",
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}

export async function register(payload: {
  email: string;
  name: string;
  nickname: string;
  password: string;
  surname: string;
  birthDate: string;
}) {
  return request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getComments(postId: number | string, token?: string) {
  return request(`/posts/${postId}/comments`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function createComment(
  postId: number | string,
  commentDto: { text: string },
  token: string
) {
  return request(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(commentDto),
  });
}

// Try to create post on backend; if backend endpoint missing, fall back to localStorage
export async function createPost(
  post: {
    id?: number;
    user: string;
    avatar?: string;
    time?: string;
    title: string;
    content: string;
    image?: string;
    likes?: number;
    comments?: number;
  },
  token?: string
) {
  // attempt backend call
  try {
    return await request(`/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(post),
    });
  } catch (err) {
    // fallback: persist in localStorage under 'localPosts'
    try {
      const raw = localStorage.getItem("localPosts");
      const arr = raw ? JSON.parse(raw) : [];
      const nextId = arr.reduce((max: number, p: any) => Math.max(max, p.id || 0), 0) + 1;
      const newPost = { id: nextId, likes: 0, comments: 0, time: "práve teraz", ...post };
      arr.unshift(newPost);
      localStorage.setItem("localPosts", JSON.stringify(arr));
      return newPost;
    } catch (e) {
      throw err;
    }
  }
}

export default {
  API_BASE_URL,
  request,
  register,
  login,
  getComments,
  createComment,
};
