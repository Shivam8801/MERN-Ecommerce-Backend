import User from "../model/User.js";
import { sanitizeUser } from "../services/common.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const SECRET_KEY = "secret";

const createUser = async (req, res) => {
    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            "sha256",
            async function (err, hashedPassword) {
                const user = new User({
                    ...req.body,
                    password: hashedPassword,
                    salt,
                });
                const doc = await user.save();

                req.login(sanitizeUser(doc), (err) => {
                    if (err) res.status(400).json(err);
                    else {
                        const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                        res.cookie("jwt", token, {
                            expires: new Date(Date.now() + 3600000),
                            httpOnly: true,
                        })
                            .status(201)
                            .json({ id: doc.id, role: doc.role });
                    }
                });
            }
        );
    } catch (err) {
        res.status(400).json(err);
    }
};

const loginUser = async (req, res) => {
    const user = req.user;
    try {
        res.cookie("jwt", user.token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        })
            .status(201)
            .json({ id: user.id, role: user.role });
    } catch (err) {
        res.status(400).json(err);
    }
};

const checkAuth = async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.sendStatus(401);
    }
};

const logout = async (req, res) => {
    res.cookie("jwt", null, {
        expires: new Date(0),
        httpOnly: true,
    }).sendStatus(200);
};

export { createUser, loginUser, checkAuth, logout };
