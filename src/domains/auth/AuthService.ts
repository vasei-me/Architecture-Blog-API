import jwt from "jsonwebtoken";
import config from "../../config";
import ApiError from "../../shared/errors/ApiError";
import {
  AuthResponse,
  JwtPayload,
  LoginInput,
  RegisterInput,
} from "./AuthInterfaces";
import UserModel, { IUser } from "./UserModel";

export class AuthService {
  async register(userData: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await UserModel.findOne({
        $or: [{ email: userData.email }, { username: userData.username }],
      });

      if (existingUser) {
        throw new ApiError(
          400,
          "User with this email or username already exists"
        );
      }

      // Create new user
      const user = await UserModel.create(userData);

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await UserModel.findOne({ email: credentials.email });
      if (!user) {
        throw new ApiError(401, "Invalid email or password");
      }

      // Check password
      const isPasswordValid = await user.comparePassword(credentials.password);
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: IUser): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions); // این خط رو اضافه کردم
  }
}

export default new AuthService();
