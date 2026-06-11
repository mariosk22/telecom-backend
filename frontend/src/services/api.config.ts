export const API_BASE_URL = 'http://localhost:9090';

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
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};