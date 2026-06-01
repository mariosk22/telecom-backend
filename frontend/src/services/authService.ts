import { API_BASE_URL, API_ENDPOINTS, setToken } from './api.config';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}

export interface LoginResponse {
  token: string;
}

class AuthService {
  async register(data: RegisterDto): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Register failed!');
    }
  }

  async login(data: LoginDto): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error('Login failed!');
    }

    const result: LoginResponse = await response.json();
    setToken(result.token);
    return result.token;
  }
}

export default new AuthService();
