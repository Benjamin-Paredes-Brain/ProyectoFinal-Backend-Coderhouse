import { Router } from "express"
import { createCartsController, deleteCartsController, getCartsByIdController, getCartsController, addProductInCartController, clearCartController, deleteProductFromCartController, updateQuantityProductsInCartsController, purchaseCartController, updateCartsController} from "../controllers/carts.controller.js"
import { authenticateJWTAndRole } from "../middlewares/auth/auth.JWT.Role.js"

export const router = Router()

router.post("/", createCartsController)
router.post("/:cid/product/:pid", addProductInCartController)
router.post("/purchase/:cid", authenticateJWTAndRole(["user"]), purchaseCartController)

router.get("/", getCartsController)
router.get("/:cid", getCartsByIdController)

router.put(":/cid", updateCartsController)
router.put("/quantity/:cid/product/:pid", updateQuantityProductsInCartsController)

router.delete("/:cid", clearCartController)
router.delete("/:cid/product/:pid", deleteProductFromCartController)
router.delete("/remove/:cid", deleteCartsController)