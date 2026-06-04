export * from "../services/api.config";
export { default } from "../services/api.config";

import { API_BASE_URL, API_ENDPOINTS, getToken } from "../services/api.config";

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
  return request(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return request(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getComments(postId: number | string, token?: string) {
  const t = token ?? getToken();
  return request(`${API_ENDPOINTS.POSTS.GET_BY_ID(postId)}/comments`, {
    method: "GET",
    headers: t ? { Authorization: `Bearer ${t}` } : undefined,
  });
}

export async function createComment(
  postId: number | string,
  commentDto: { text: string },
  token?: string
) {
  const t = token ?? getToken();
  return request(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
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
    return await request(API_ENDPOINTS.POSTS.CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...((token ?? getToken()) ? { Authorization: `Bearer ${token ?? getToken()}` } : {}),
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
