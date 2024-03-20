import { Router } from "express"
import { registerUserController, loginUserController, getUserProfile, updateUserController, getUsersController, deleteUserController } from "../controllers/users.controller.js";
import { authenticateJWTAndRole } from "../middlewares/auth/auth.JWT.Role.js";

export const router = Router()

router.post("/register", registerUserController);
router.post("/login", loginUserController)
router.get("/profile", authenticateJWTAndRole("user"), getUserProfile)
router.put("/:uid", updateUserController)
router.get("/", getUsersController)
router.delete("/:uid", deleteUserController)