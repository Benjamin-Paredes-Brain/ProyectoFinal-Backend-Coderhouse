import Users from "../dao/classes/users.dao.js";
import UserProfileDTO from "../dto/user.dto.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils.js";
import Carts from "../dao/classes/carts.dao.js";

const usersService = new Users()
const cartsService = new Carts()

export const registerUserController = async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send({ status: "error", message: "Incomplete fields" });
        }

        if (typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string" || typeof age !== "number" || typeof password !== "string") {
            return res.status(400).send({ status: "error", message: "Invalid data fields" });
        }

        const userExists = await usersService.getUserByEmailDAO(email)
        if (userExists) return res.status(409).send({ status: "error", message: "User with this email already exists" });


        const userData = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        let result = await usersService.createUserDAO(userData);

        if (result) {
            const userCart = await cartsService.createCartsDao()
            result.carts.push(userCart._id)
            await result.save()
        } else {
            return res.status(400).send({ status: "error", message: "Cannot create user" })
        }

        res.status(201).send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const loginUserController = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send({ status: "error", message: "Incomplete fields" });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).send({ status: "error", message: "Invalid data fields" });
        }

        const user = await usersService.getUserByEmailDAO(email)
        if (!isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", message: "Invalid Credentials" })
        }

        const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("authCookie", token, { signed: true, httpOnly: true });
        return res.status(200).send({ message: "Login successful", payload: token });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const uid = req.user._id;
        const user = await usersService.getUserByIdDAO(uid);
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        let result = new UserProfileDTO(req.user)
        return res.status(200).send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}
