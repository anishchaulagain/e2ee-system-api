import { Router } from "express";
import { HomeController } from "../controllers/home.controller";

export const homeRouter = Router();

homeRouter.get("/", HomeController.index);
