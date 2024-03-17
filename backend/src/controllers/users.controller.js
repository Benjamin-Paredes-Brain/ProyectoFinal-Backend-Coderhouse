import Users from "../dao/classes/users.dao.js";
import jwt from "jsonwebtoken";
import { createHash, isValidPassword } from "../utils.js";

const usersService = new Users()

export const registerUserController = async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ message: "Incomplete fields" });
        }

        if (typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string" || typeof age !== "number" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid data fields" });
        }

        const userExists = await usersService.getUserByEmailDAO(email)
        if (userExists) return res.status(409).json({ message: "User with this email already exists" });


        const userData = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }

        let result = await usersService.createUserDAO(userData);

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
            return res.status(400).json({ message: "Incomplete fields" });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid data fields" });
        }

        const user = await usersService.getUserByEmailDAO(email)
        if (!isValidPassword(user, password)) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("authCookie", token, { signed: true, httpOnly: true });
        return res.status(200).json({ message: "Login successful"});
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
}
