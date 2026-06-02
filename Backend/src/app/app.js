import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "../error/catch.error.js";
import authRouter from "../routes/auth.routes.js";
import passport from "../config/passport.js";
import productRouter from "../routes/product.routes.js";
import profileRouter from "../routes/profile.routes.js";
import bannerRouter from "../routes/banner.routes.js";
import cartRouter from "../routes/cart.routes.js";
import wishlistRouter from "../routes/wishlist.routes.js";
import cors from 'cors';
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
// routes would go here
// app.use('/api/auth', authRoutes);

app.use(passport.initialize());

app.use("/api/products" , productRouter);
app.use("/api/auth" , authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);

// error handler must be last
app.use(errorHandler);

export default app;
