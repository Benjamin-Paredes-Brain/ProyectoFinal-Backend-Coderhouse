import { Router } from "express"
import { createCartsController, deleteCartsController, getCartsByIdController, getCartsController, addProductInCartController, clearCartController, deleteProductFromCartController, updateQuantityProductsInCartsController, purchaseCartController} from "../controllers/carts.controller.js"

export const router = Router()

router.post("/", createCartsController)
router.post("/:cid/product/:pid", addProductInCartController)
router.post("/quantity/:cid/product/:pid", updateQuantityProductsInCartsController)
router.post("/purchase/:cid", purchaseCartController)

router.get("/", getCartsController)
router.get("/:cid", getCartsByIdController)

router.put("/:cid", clearCartController)

router.delete("/:cid/product/:pid", deleteProductFromCartController)
router.delete("/:cid", deleteCartsController)