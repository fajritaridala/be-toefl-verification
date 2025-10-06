"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const constant_1 = require("../utils/constant");
const jwt_1 = require("../utils/jwt");
const validates_1 = require("../utils/validates");
exports.default = {
    async login(req, res) {
        try {
            const { address } = req.body;
            await validates_1.loginValidateSchema.validate({ address });
            const existingUser = await user_model_1.UserModel.findOne({ address }).lean();
            // Avoid logging user documents to keep logs light and secure
            if (existingUser) {
                const tokenJwt = (0, jwt_1.generateToken)({
                    address: existingUser.address,
                    role: existingUser.role,
                });
                res.status(200).json({
                    message: "login successful",
                    data: {
                        user: tokenJwt,
                    },
                });
            }
            else {
                res.status(200).json({
                    message: "address not registered",
                    needsRegistration: true,
                    data: { address },
                });
            }
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
    async register(req, res) {
        try {
            console.log(req.body);
            const { address, fullName, email, roleToken } = req.body;
            await validates_1.registerValidateSchema.validate({
                address,
                fullName,
                email,
                roleToken,
            });
            const existingAddress = await user_model_1.UserModel.findOne({ address }).lean();
            if (existingAddress) {
                throw new Error("address already registered");
            }
            const existingEmail = await user_model_1.UserModel.findOne({ email }).lean();
            if (existingEmail) {
                throw new Error("email already registered");
            }
            // validasi role
            let role = constant_1.ROLES.PESERTA;
            if (roleToken === process.env.ADMIN_TOKEN) {
                role = constant_1.ROLES.ADMIN;
            }
            // Keep logs concise
            const result = await user_model_1.UserModel.create({
                address,
                fullName,
                email,
                role,
            });
            res.status(201).json({
                message: "registration successful",
                data: result,
            });
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
    async me(req, res) {
        try {
            const address = req.user?.address;
            const result = await user_model_1.UserModel.findOne({ address }).lean();
            res.status(200).json({
                message: "data successfully received",
                data: result,
            });
        }
        catch (error) {
            const err = error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },
};
