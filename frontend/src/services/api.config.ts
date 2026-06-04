// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  POSTS: {
    GET_ALL: '/posts',
    GET_BY_ID: (id: number | string) => `/posts/${id}`,
    GET_BY_USER: (userId: number) => `/posts/user/${userId}`,
    CREATE: '/posts',
    DELETE: (id: number) => `/posts/${id}`,
  },
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// -- Network helpers and API functions (merged here so config + API live together) --
const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'omit',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
};

export async function register(payload: any) {
  return request(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return request(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getComments(postId: number | string, token?: string) {
  const t = token ?? getToken();
  return request(`${API_ENDPOINTS.POSTS.GET_BY_ID(postId)}/comments`, {
    method: 'GET',
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
    body: JSON.stringify(commentDto),
  });
}

export async function createPost(
  post: any,
  token?: string
) {
  try {
    return await request(API_ENDPOINTS.POSTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...((token ?? getToken()) ? { Authorization: `Bearer ${token ?? getToken()}` } : {}),
      },
      body: JSON.stringify(post),
    });
  } catch (err) {
    try {
      const raw = localStorage.getItem('localPosts');
      const arr = raw ? JSON.parse(raw) : [];
      const nextId = arr.reduce((max: number, p: any) => Math.max(max, p.id || 0), 0) + 1;
      const newPost = { id: nextId, likes: 0, comments: 0, time: 'práve teraz', ...post };
      arr.unshift(newPost);
      localStorage.setItem('localPosts', JSON.stringify(arr));
      return newPost;
    } catch (e) {
      throw err;
    }
  }
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getToken,
  setToken,
  removeToken,
  register,
  login,
  getComments,
  createComment,
  createPost,
};
