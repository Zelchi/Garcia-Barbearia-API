import express from "express";
const router = express.Router();

import { userController } from "./UserController";

router.use((req, res, next) => userController.middleware(req, res, next));
router.post("/", (req, res) => userController.userPost(req, res));

export default router;