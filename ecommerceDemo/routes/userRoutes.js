import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();
const userController = new UserController();

router.route('/').get(userController.homepage)

export default router;