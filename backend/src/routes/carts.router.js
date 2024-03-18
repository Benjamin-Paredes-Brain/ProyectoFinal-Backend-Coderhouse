import { Router } from "express"
import { createCartsController, deleteCartsController, getCartsByIdController, getCartsController, addProductInCartController, clearCartController, deleteProductFromCartController, updateQuantityProductsInCartsController} from "../controllers/carts.controller.js"

export const router = Router()

router.post("/", createCartsController)
router.post("/:cid/product/:pid", addProductInCartController)
router.post("/quantity/:cid/product/:pid", updateQuantityProductsInCartsController)

router.get("/", getCartsController)
router.get("/:cid", getCartsByIdController)

router.put("/:cid", clearCartController)

router.delete("/:cid/product/:pid", deleteProductFromCartController)
router.delete("/:cid", deleteCartsController)