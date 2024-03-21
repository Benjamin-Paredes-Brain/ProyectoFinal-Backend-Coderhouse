import Carts from "../dao/classes/carts.dao.js";
import Products from "../dao/classes/products.dao.js"
import Tickets from "../dao/classes/tickets.dao.js";
import { generateRandomString } from "../utils.js";

const cartsService = new Carts()
const productsService = new Products()
const ticketsService = new Tickets()

export const createCartsController = async (req, res) => {
    try {
        const cartData = { products: [] }
        let result = await cartsService.createCartsDao(cartData)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot create cart" })
        res.status(201).send({ status: "success", payload: result })
    }
    catch (error) {
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getCartsController = async (req, res) => {
    try {
        let result = await cartsService.getCartsDAO()
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get carts" })
        res.status(200).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const getCartsByIdController = async (req, res) => {
    try {
        let cid = req.params.cid;
        let result = await cartsService.getCartsByIdDAO(cid)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get cart with this id because doesn´t exists" })
        res.status(200).send({ status: "success", payload: result })
    } catch (err) {
        res.status(500).send("Server error: " + err)
    }
};

export const updateCartsController = async (req, res) => {
    try {
        let cid = req.params.cid;
        let productsUpdate = req.body.products;

        let result = await cartsService.updateCartsDAO(cid, productsUpdate);

        if (!result) {
            return res.status(404).send({ status: "error", message: "Cart not found" });
        }

        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
};

export const deleteCartsController = async (req, res) => {
    try {
        let cid = req.params.cid
        let result = await cartsService.deleteCartsDAO({ _id: cid })
        if (!result) return res.status(404).send({ status: "error", message: "Cannot delete cart" })
        res.status(200).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const updateQuantityProductsInCartsController = async (req, res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let quantity = req.body.quantity;

        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).send({ status: "error", message: "Quantity must be a positive number" });
        }

        let result = await cartsService.updateProductQuantityInCartDAO(cid, pid, quantity);

        if (!result) {
            return res.status(404).send({ status: "error", message: "Product not found in the cart" });
        }

        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
};

export const addProductInCartController = async (req, res) => {
    try {
        let pid = req.params.pid
        let cid = req.params.cid

        let product = await productsService.getProductsByIdDAO(pid)

        if (!product) {
            return res.status(404).send({ status: "error", message: "Product not found" });
        }

        let result = await cartsService.updateProductQuantityInCartDAO(cid, pid);

        if (!result) {
            return res.status(404).send({ status: "error", message: "Cannot add product to cart" });
        }

        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const deleteProductFromCartController = async (req, res) => {
    try {
        let pid = req.params.pid
        let cid = req.params.cid

        let result = await cartsService.deleteProductFromCartDAO(cid, pid);

        if (!result) {
            return res.status(404).send({ status: "error", message: "Cannot remove product from cart" });
        }

        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const clearCartController = async (req, res) => {
    try {
        const cid = req.params.cid;

        let result = await cartsService.clearCartDAO(cid);

        if (!result) return res.status(404).send({ status: "error", message: "Cannot clear cart" })
        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server Error: " + err);
    }
}

export const purchaseCartController = async (req, res) => {
    try {
        const user = req.user;
        const cid = req.params.cid;
        const cart = await cartsService.getCartsByIdDAO(cid);
        const purchaser = user.email;

        const purchasedProducts = [];
        const productsWithNoStock = [];

        let ticketAmount = 0;
        cart.products.forEach(product => {
            ticketAmount += product.product.price * product.quantity;
        });

        const ticketData = {
            code: generateRandomString(16),
            purchase_datetime: new Date(),
            amount: ticketAmount,
            purchaser: purchaser
        };

        for (const productInfo of cart.products) {
            const productId = productInfo.product._id;
            const quantityInCart = productInfo.quantity;

            const stockUpdated = await productsService.updateProductsStockDAO(productId, quantityInCart);

            if (!stockUpdated) {
                productsWithNoStock.push(productInfo.product);
            } else {
                const product = await productsService.getProductsByIdDAO(productId);
                if (product) {
                    purchasedProducts.push({
                        pid: product._id,
                        title: product.title,
                        quantity: quantityInCart
                    });
                }
            }
        }

        if (purchasedProducts.length > 0) {
            const productsToRemove = productsWithNoStock.map(product => product._id);
            await cartsService.removeProductsFromCartDAO(cid, productsToRemove);
        }

        let ticket = await ticketsService.generateTicketsDAO(ticketData);

        let additionalMessage = "";
        if (productsWithNoStock.length > 0) {
            additionalMessage = "Some products couldn't be purchased due to insufficient stock";
        }

        res.status(200).send({
            status: "success",
            message: "Products purchased successfully",
            purchasedProducts: purchasedProducts,
            info: additionalMessage,
            productsWithNoStock: productsWithNoStock,
            ticket: ticket
        });
    } catch (err) {
        res.status(500).send("Server Error: " + err);
    }
};
