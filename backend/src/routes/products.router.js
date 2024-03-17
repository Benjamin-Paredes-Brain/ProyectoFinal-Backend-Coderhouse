import { Router } from "express"
import { getProductsController, getProductsByIdController, createProductsController, updateProductsController, deleteProductsController } from "../controllers/products.controller.js"

export const router = Router()

router.post("/", createProductsController)

router.get("/", getProductsController)
router.get("/:pid", getProductsByIdController)

router.put("/:pid", updateProductsController)

router.delete("/:pid", deleteProductsController)