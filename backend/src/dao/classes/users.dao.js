import { usersModel } from "../models/users.model.js";
import { logger } from "../../middlewares/logger/logger.js";

export default class Users {
    constructor() {
        this.logger = logger;
    }

    createUserDAO = async (userData) => {
        try {
            let result = await usersModel.create(userData)
            this.logger.info("User created successfully")
            return result;
        }
        catch (err) {
            this.logger.error(`Error creating user: ${err.message}`)
            return null;
        }
    }

    getUserByIdDAO = async (uid) => {
        try {
            let result = await usersModel.findById({ _id: uid })
            this.logger.info(`User with id ${uid} retrieved successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error retrieving user with id ${uid}: ${err.message}`)
            return null;
        }
    }

    getUserByEmailDAO = async (email) => {
        try {
            let result = await usersModel.findOne({ email: email })
            this.logger.info(`User with email ${email} retrieved successfully`)
            return result;
        }
        catch (err) {
            this.logger.error(`Error retrieving user with this email ${email}: ${err.message}`)
            return null;
        }

    }
    
}