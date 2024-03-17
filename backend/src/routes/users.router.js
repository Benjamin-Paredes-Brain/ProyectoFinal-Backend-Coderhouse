import { Router } from "express"
import { registerUserController, loginUserController } from "../controllers/users.controller.js";
import { authenticateJWTAndRole } from "../middlewares/auth/auth.JWT.Role.js";

export const router = Router()

router.post("/register", registerUserController);
router.post("/login", loginUserController)
router.get("/profile", authenticateJWTAndRole("user"), (req, res) => {
    res.json("Prueba!")
})