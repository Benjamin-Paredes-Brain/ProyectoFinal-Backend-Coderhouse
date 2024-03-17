import { cartsModel } from "../models/carts.model.js"
import { logger } from "../../middlewares/logger/logger.js"

export default class Carts {

    constructor() {
        this.logger = logger;
    }

    createCartsDao = async (cartData) => {
        try {
            let result = await cartsModel.create(cartData)
            this.logger.info(`Cart with id ${result._id} created successfully`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while creating cart: ${error.message}`)
            return null;
        }
    }

    getCartsDAO = async () => {
        try {
            let result = await cartsModel.find()
            this.logger.info(`Carts successfully retrieved`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while fetching carts: ${error.message}`)
            return null;
        }
    }

    getCartsByIdDAO = async (cid) => {
        try {
            let result = await cartsModel.findById({ _id: cid }).populate('products.product');
            if (!result) return null
            this.logger.info(`Cart with id ${cid} successfully retrieved`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while fetching cart: ${error.message}`)
            return null;
        }
    }

    // updateCartsDAO = async (cid, productsUpdate) => {
    //     try {
    //         let result = await cartsModel.findByIdAndUpdate(
    //             cid,
    //             {
    //                 $set: {
    //                     'products': productsUpdate,
    //                 },
    //             },
    //             { new: true }
    //         ).populate('products.product');
    //         this.logger.info(`Cart with ID ${cid} updated successfully`);
    //         return result;
    //     } catch (error) {
    //         this.logger.error(`Error while updating cart with ID ${cid}: ${error.message}`);
    //         return null;
    //     }
    // };

    deleteCartsDAO = async (cid) => {
        try {
            let result = await cartsModel.deleteOne({ _id: cid })
            this.logger.info(`Cart deleted successfully`)
            return result;
        }
        catch (error) {
            this.logger.error(`Error while deleting cart with id ${cid}: ${error.message}`)
            return null;
        }
    }
}