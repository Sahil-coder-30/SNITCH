# SNITCH Project Metadata

## Overview
This file contains the complete metadata and structure of the SNITCH project to be used as context for Claude.

## Directory Structure
```
SNITCH/
    .gitignore
    Frontend/
        .gitignore
        README.md
        eslint.config.js
        index.html
        package-lock.json
        package.json
        replace_colors.py
        vite.config.js
        public/
            favicon.svg
            icons.svg
            assets/
                light_bg.png
        src/
            main.jsx
            app/
                App.jsx
                app.store.js
                style/
                    app.scss
            features/
                seller/
                    dashboard/
                        slice/
                            seller.slice.js
                        style/
                            CreateProduct.scss
                            SellerDashboard.scss
                            SellerEarnings.scss
                            SellerOrders.scss
                            SellerOverview.scss
                            SellerProducts.scss
                        components/
                            CreateProduct.jsx
                            SellerDashboard.jsx
                            SellerEarnings.jsx
                            SellerOrders.jsx
                            SellerOverview.jsx
                            SellerProducts.jsx
                            shared/
                                SellerComponents.jsx
                                style/
                                    seller-shared.scss
                        Hooks/
                            useCreateProduct.js
                            useSellerEarnings.js
                            useSellerOrders.js
                            useSellerOverview.js
                            useSellerProducts.js
                        services/
                            product.api.js
                            seller.api.js
                auth/
                    slice/
                        auth.slice.js
                    style/
                        ForgotPassword.scss
                        Login.scss
                        Register.scss
                        ResetPassword.scss
                        SetPassword.scss
                        Skeleton.scss
                        VerifyEmail.scss
                        VerifyOtp.scss
                        _auth-card.scss
                    components/
                        ForgotPassword.jsx
                        Login.jsx
                        ProtectedRoute.jsx
                        Register.jsx
                        ResetPassword.jsx
                        SetPassword.jsx
                        VerifyEmail.jsx
                        VerifyOtp.jsx
                        loaders/
                            LoginSkeleton.jsx
                            RegisterSkeleton.jsx
                            hel.jsx
                    Hooks/
                        auth.hooks.js
                    services/
                        auth.api.js
                buyer/
                    dashboard/
                        slice/
                            buyer.slice.js
                        style/
                            BrowseProducts.scss
                            BuyerDashboard.scss
                            BuyerOrders.scss
                            BuyerProfile.scss
                            Wishlist.scss
                        components/
                            BrowseProducts.jsx
                            BuyerDashboard.jsx
                            BuyerOrders.jsx
                            BuyerProfile.jsx
                            Wishlist.jsx
                            shared/
                                BuyerComponents.jsx
                                style/
                                    buyer-shared.scss
                        Hooks/
                            useBrowseProducts.js
                            useBuyerOrders.js
                            useBuyerProfile.js
                            useWishlist.js
                        services/
                            buyer.api.js
                store/
                    slice/
                        product.slice.js
                    style/
                        CartPage.scss
                        CheckoutPage.scss
                        MyOrdersPage.scss
                        OrderCancelledPage.scss
                        OrderDetailPage.scss
                        OrderSuccessPage.scss
                        OrderTrackingPage.scss
                        PaymentFailedPage.scss
                        ProductPage.scss
                        RefundStatusPage.scss
                        ReturnRequestPage.scss
                        StoreFront.scss
                        WriteReviewPage.scss
                    components/
                        StoreFront.jsx
                        shared/
                            StoreComponents.jsx
                            style/
                                store-shared.scss
                        product/
                            ProductPage.jsx
                        checkout/
                            CheckoutPage.jsx
                        cart/
                            CartPage.jsx
                        returns/
                            RefundStatusPage.jsx
                            ReturnRequestPage.jsx
                            WriteReviewPage.jsx
                        orders/
                            MyOrdersPage.jsx
                            OrderDetailPage.jsx
                            OrderSuccessPage.jsx
                            OrderTrackingPage.jsx
                        errors/
                            OrderCancelledPage.jsx
                            PaymentFailedPage.jsx
                    data/
                        dummyData.js
                        products.js
            utils/
                colors.js
                dummyData.js
            components/
                ThemeToggle/
                    ThemeToggle.jsx
                    ThemeToggle.scss
                layout/
                    LayoutComponents.jsx
                    style/
                        layout.scss
                dashboard/
                    DashboardTokens.scss
                    EmptyState.jsx
                    EmptyState.scss
                    Navbar.jsx
                    Navbar.scss
                    Pagination.jsx
                    Pagination.scss
                    ProductCard.jsx
                    ProductCard.scss
                    Sidebar.jsx
                    Sidebar.scss
                    StatCard.jsx
                    StatCard.scss
                    StatusBadge.jsx
                    StatusBadge.scss
                common/
                    Feedback.jsx
                    UI.jsx
                    style/
                        common.scss
                        feedback.scss
                SnitchIntro/
                    SnitchIntro.jsx
                    SnitchIntro.scss
                loaders/
                    ComponentSkeletons.jsx
                    Loader.scss
                    Skeleton.jsx
                    Skeleton.scss
                    VanguardLoader.jsx
            services/
    Backend/
        .env
        fix_auth.js
        package-lock.json
        package.json
        server.js
        src/
            middleware/
                identifyUser.middleware.js
                product.middleware.js
            app/
                app.js
            config/
                config.js
                db.js
                passport.js
            models/
                blacklist.model.js
                otp.model.js
                product.model.js
                review.model.js
                user.model.js
            validators/
                auth.validator.js
                product.validator.js
            controllers/
                auth.controller.js
                products.controller.js
            error/
                catch.error.js
            routes/
                auth.routes.js
                product.routes.js
            services/
                mail.service.js
                storage.service.js

```

## Frontend Metadata
**Dependencies:**
```json
{
  "@gsap/react": "^2.1.2",
  "@reduxjs/toolkit": "^2.11.2",
  "axios": "^1.15.0",
  "gsap": "^3.14.2",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-redux": "^9.2.0",
  "react-router-dom": "^7.14.0"
}
```
**Dev Dependencies:**
```json
{
  "@eslint/js": "^9.39.4",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^6.0.1",
  "eslint": "^9.39.4",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.5.2",
  "globals": "^17.4.0",
  "sass": "^1.99.0",
  "vite": "^8.0.4"
}
```
**Scripts:**
```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Backend Metadata
**Dependencies:**
```json
{
  "@imagekit/javascript": "^5.3.0",
  "@imagekit/nodejs": "^7.5.0",
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.6",
  "dotenv": "^17.4.1",
  "express": "^5.2.1",
  "express-session": "^1.19.0",
  "express-validator": "^7.3.2",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.4.1",
  "morgan": "^1.10.1",
  "multer": "^2.1.1",
  "nodemailer": "^8.0.5",
  "nodemon": "^3.1.14",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0"
}
```
**Dev Dependencies:**
```json
{}
```
**Scripts:**
```json
{
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "npx nodemon server.js"
}
```
