import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const productCreationAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        const err = new Error("token is required");
        err.statusCode = 401;
        return next(err);
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (decoded.role !== "SELLER") {
            console.log(decoded.role);
            
            const err = new Error("Unauthorized");
            err.statusCode = 403;
            return next(err);
        }
        req.user = decoded;
        next();
    } catch (error) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        return next(err);
    }   
}