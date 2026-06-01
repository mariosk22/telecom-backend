import { API_BASE_URL, API_ENDPOINTS, getToken } from './api.config';

export interface PostDto {
  title: string;
  content: string;
  image?: string;
}

export interface PostResponseDto {
  id: number;
  title: string;
  content: string;
  image?: string;
  userId: number;
  createdAt?: string;
  user?: {
    id: number;
    email: string;
    username?: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

class PostService {
  async getAllPosts(): Promise<PostResponseDto[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.POSTS.GET_ALL}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Loading posts failed!');
    }

    return await response.json();
  }

  async getPostById(id: number): Promise<PostResponseDto> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.POSTS.GET_BY_ID(id)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Loading post failed!');
    }

    return await response.json();
  }

  async getPostsByUserId(userId: number): Promise<PostResponseDto[]> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.POSTS.GET_BY_USER(userId)}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Loading user posts failed!');
    }

    return await response.json();
  }

  async createPost(data: PostDto): Promise<PostResponseDto> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.POSTS.CREATE}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Creating post failed!');
    }

    return await response.json();
  }

  async deletePost(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.POSTS.DELETE(id)}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Deleting post failed!');
    }
  }
}

export default new PostService();
