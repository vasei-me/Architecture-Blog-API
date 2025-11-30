export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      username: string;
      email: string;
    };
    token: string;
  };
}

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}
