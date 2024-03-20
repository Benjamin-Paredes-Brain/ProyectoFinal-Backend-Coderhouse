import Products from "../dao/classes/products.dao.js"
import { getPrevLink, getNextLink } from "../utils.js"

const productsService = new Products()

export const createProductsController = async (req, res) => {
    let { title, description, price, thumbnail, code, stock, category, owner } = req.body

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        return res.status(400).send({ status: "error", message: "Incomplete fields" });
    }

    if (typeof title !== "string" || typeof description !== "string" || typeof price !== "number" || typeof thumbnail !== "string" || typeof code !== "string" || typeof stock !== "number" || typeof category !== "string") {
        return res.status(400).send({ status: "error", message: "Invalid data fields" });
    }

    const products = await productsService.getProductsDAO()
    if (products.docs.some(p => p.code === code)) {
        return res.status(400).send({ status: "error", message: `Product with this code ${code} already exists (the code cannot be repeated)` })
    }

    const productData = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        owner
    }

    let result = await productsService.createProductsDAO(productData)
    if (!result) return res.status(404).send({status: "error", message:"Cannot create products"})
    res.status(200).send({ status: "success", payload: result })
}

export const getProductsController = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1
        let limit = req.query.limit ? parseInt(req.query.limit) : 10
        let sort = 0
        let query = {}

        if (req.query.sort) {
            const sortOption = req.query.sort.toLowerCase()
            if (sortOption === "asc") {
                sort = 1
            } else {
                sortOption === "desc"
                sort = -1
            }
        }

        if (req.query.query) {
            query = { category: { $regex: req.query.query, $options: "i" } }
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort !== 0 ? { price: sort } : null
        }

        let result = await productsService.getProductsDAO(query, options)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get products" })

        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        return res.status(201).send({
            status: "success",
            payload: result,
            prevLink: result.hasPrevPage ? getPrevLink(baseUrl, result) : null,
            nextLink: result.hasNextPage ? getNextLink(baseUrl, result) : null
        })
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const getProductsByIdController = async (req, res) => {
    try {
        let pid = req.params.pid
        let result = await productsService.getProductsByIdDAO(pid)
        if (!result) return res.status(404).send({ status: "error", message: "Cannot get products with this id because doesn´t exists" })
        res.status(200).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const updateProductsController = async (req, res) => {

    try {
        let pid = req.params.pid
        let productReplace = req.body
        if (!productReplace.title || !productReplace.description || !productReplace.price || !productReplace.thumbnail || !productReplace.code || !productReplace.stock || !productReplace.category) return res.status(400).send({ status: "error", error: "Incomplete values" })
        let result = await productsService.updateProductsDAO({ _id: pid }, productReplace)
        if (!result) return res.status(404).send({ status: "error", message: "The product with this Id cannot be updated because it does not exist" })
        res.status(200).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }

}

export const deleteProductsController = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productsService.getProductsByIdDAO(pid);

        if (!product) {
            return res.status(404).send({ status: "error", message: "The product with this Id does not exist" });
        }

        const result = await productsService.deleteProductsDAO({ _id: pid });

        if (!result) {
            return res.status(404).send({ status: "error", message: "The product with this Id cannot be deleted because it does not exist"});
        }

        res.status(200).send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
}
