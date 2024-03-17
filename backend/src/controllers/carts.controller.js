import Carts from "../dao/classes/carts.dao.js";

const cartsService = new Carts()

export const createCartsController = async (req, res) => {
    try {
        const cartData = { products: [] }
        let result = await cartsService.createCartsDao(cartData)
        if (!result) return res.status(404).send("Cannot create cart")
        res.status(201).send({ status: "success", payload: result })
    }
    catch (error) {
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getCartsController = async (req, res) => {
    try {
        let result = await cartsService.getCartsDAO()
        if (!result) return res.status(404).send("Cannot get carts")
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
        if (!result) return res.status(404).send("Cannot get cart with this id because doesn´t exists")
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
            return res.status(404).send("Cart not found");
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
        if (!result) return res.status(404).send("Cannot delete cart")
        res.status(200).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}