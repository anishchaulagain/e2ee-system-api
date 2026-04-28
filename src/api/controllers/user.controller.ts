import { type NextFunction, type Request, type Response } from "express";
import { UserService } from "../../services/user.service";
import { updatePublicKeySchema, searchUsersSchema } from "../validators/message.validators";

export const UserController = {
  /** GET /users/me — current user profile */
  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getById(req.user!.sub);
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  },

  /** GET /users/:id/public-key — fetch public key for E2EE key exchange */
  async getPublicKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.getPublicKey(req.params.id as string);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  /** PUT /users/me/public-key — upload/update encryption public key */
  async updatePublicKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = updatePublicKeySchema.parse(req.body);
      await UserService.updatePublicKey(req.user!.sub, body.publicKey);
      res.json({ message: "Public key updated" });
    } catch (err) {
      next(err);
    }
  },

  /** GET /users/search?q=query — search users by username */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = searchUsersSchema.parse(req.query);
      const users = await UserService.search(query.q, req.user!.sub);
      res.json({ data: users });
    } catch (err) {
      next(err);
    }
  },
};
