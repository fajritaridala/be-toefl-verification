"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
exports.default = (req, res, next) => {
    // Cek apakah ada token di header Authorization
    const authorization = req.headers?.authorization;
    if (!authorization) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    // membaca token
    const [prefix, accessToken] = authorization.split(" "); // @split(" ") untuk memisahkan prefix "Bearer" dan token
    if (!(prefix === "Bearer" && accessToken)) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    const user = (0, jwt_1.getUserData)(accessToken);
    if (!user) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }
    // tambahkan user ke request
    req.user = user;
    next();
};
