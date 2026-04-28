import { type NextFunction, type Request, type Response } from "express";
import { type ZodSchema } from "zod";

type Target = "body" | "query" | "params";

export function validate<T>(schema: ZodSchema<T>, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    Object.assign(req, { [target]: result.data });
    next();
  };
}
