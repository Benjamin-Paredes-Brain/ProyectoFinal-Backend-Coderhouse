import { Router } from "express"
import { createCartsController, deleteCartsController, getCartsByIdController, getCartsController, updateCartsController } from "../controllers/carts.controller.js"

export const router = Router()

router.post("/", createCartsController)

router.get("/", getCartsController)
router.get("/:cid", getCartsByIdController)

// router.put("/:cid", updateCartsController)

router.delete("/:cid", deleteCartsController)