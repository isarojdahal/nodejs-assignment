import { Router } from "express";
import UserController from "../controllers/usersController.js";

const router = Router();

const userController = new UserController();

router.post("/login", userController.login);

router.post("/signup", userController.signup);

export default router;
