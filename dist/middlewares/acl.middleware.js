"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (roles) => {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                data: null,
                message: "Forbidden",
            });
        }
        next();
    };
};
