import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

export const productCreationAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        const err = new Error("token is required");
        err.statusCode = 401;
        return next(err);
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // Find the user in the database to fetch their actual role
        const userDoc = await userModel.findById(decoded.id);
        if (!userDoc) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        const role = userDoc.role || decoded.role;
        if (role !== "SELLER") {
            console.log(`Access denied for role: ${role}`);
            const err = new Error("Unauthorized");
            err.statusCode = 403;
            return next(err);
        }

        req.user = {
            ...decoded,
            role: role
        };
        next();
    } catch (error) {
        console.error("Auth error in productCreationAuth:", error);
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        return next(err);
    }   
}