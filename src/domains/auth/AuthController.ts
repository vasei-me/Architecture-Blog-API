import { NextFunction, Request, Response } from "express";
import { LoginInput, RegisterInput } from "./AuthInterfaces";
import authService from "./AuthService";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterInput = req.body;
      const result = await authService.register(userData);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials: LoginInput = req.body;
      const result = await authService.login(credentials);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // user is attached to req by authMiddleware
      const user = (req as any).user;

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.userId,
            username: user.username,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
