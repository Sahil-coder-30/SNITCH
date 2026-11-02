# 🖤 SNITCH — *Wear the Statement*

<div align="center">

![SNITCH Banner](https://img.shields.io/badge/SNITCH-Fashion%20Store-black?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6TTIgMTJsMTAgNSAxMC01LTEwLTUtMTAgNXoiIGZpbGw9IndoaXRlIi8+PC9zdmc+&labelColor=111111)
![Version](https://img.shields.io/badge/Version-1.0.0-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN-yellow?style=for-the-badge)

<br/>

> **The only clothing store where every category tells a story.**
> *Streetwear. Formal. Casual. Kids. Women. Men — All under one roof.*

<br/>

[🛍️ Live Demo](#) • [📖 Docs](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 🧵 What is SNITCH?

**SNITCH** is a full-stack, dark-themed premium fashion e-commerce platform built for the modern generation. It's not just a clothing store — it's an experience. With a bold UI, seamless UX, and a curated catalog across every clothing category, SNITCH is where style meets technology.

Whether you're shopping for oversized streetwear, clean formals, casual fits, or kids' collections — SNITCH has it all, wrapped in a cinematic dark aesthetic.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | Secure Login & Register with JWT + Google/Apple OAuth |
| 🖤 **Dark UI** | Cinematic dark theme with editorial fashion imagery |
| 🛍️ **All Categories** | Men, Women, Kids, Streetwear, Formal, Casual & more |
| 🔍 **Smart Search** | Filter by size, color, category, price & brand |
| 🛒 **Cart & Wishlist** | Real-time cart updates & persistent wishlist |
| 💳 **Checkout Flow** | Smooth multi-step checkout with payment integration |
| 📦 **Order Tracking** | Live order status with timeline tracking |
| 📱 **Fully Responsive** | Mobile-first design, works on all screen sizes |
| ⚡ **Fast & Scalable** | Optimized APIs with caching and lazy loading |

---

## 🗂️ Project Structure

```
SNITCH/
│
├── client/                        # React Frontend
│   ├── public/
│   │   └── assets/                # Logos, banners, icons
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Auth/              # Login & Register pages
│   │   │   ├── Navbar/
│   │   │   ├── ProductCard/
│   │   │   └── Cart/
│   │   ├── pages/                 # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/               # Global state (Auth, Cart)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # Axios API service calls
│   │   └── App.jsx
│   └── package.json
│
├── server/                        # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── controllers/               # Route logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── errorHandler.js
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/                    # Express routers
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   └── index.js
│
├── .env
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Design & Tools
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Stitch](https://img.shields.io/badge/Stitch-UI%20Design-purple?style=for-the-badge)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

---

## 🔐 Authentication Pages

The Login and Register pages are designed with a **split-screen dark layout**:

- **Left Panel** — Full-height fashion editorial image generated via **Nano Banana Pro** (single model, dramatic dark pose, cinematic lighting)
- **Right Panel** — Clean, minimal auth form with SNITCH branding

### Login Page
- Email + Password fields
- Show/Hide password toggle
- Forgot Password link
- Google & Apple OAuth
- Tagline: *"Style never sleeps"*

### Register Page
- Full Name, Email, Password, Confirm Password, Phone
- Terms & Conditions checkbox
- Google & Apple OAuth
- Tagline: *"Join the Gang"*

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 18.x
npm >= 9.x
MongoDB Atlas account
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/snitch.git
cd snitch

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_URL=your_cloudinary_url
```

### Run the App

```bash
# Run backend (from /server)
npm run dev

# Run frontend (from /client)
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 📸 UI Preview

```
┌─────────────────────────────────────────┐
│                                         │
│   [Fashion Image]  │   SNITCH           │
│                    │                    │
│   Nano Banana Pro  │   Welcome Back     │
│   Generated —      │   ─────────────    │
│   Single Model     │   Email            │
│   Dark Pose        │   Password    👁   │
│   Cinematic        │                    │
│   Lighting         │   [ LOGIN ]        │
│                    │                    │
│                    │   ── OR ──         │
│                    │   [G] [🍎]         │
│                    │                    │
└─────────────────────────────────────────┘
```

---

## 🗺️ Roadmap

- [x] Project structure setup
- [x] Auth UI design (Login & Register)
- [ ] Backend Auth APIs (JWT + OAuth)
- [ ] Product catalog with filters
- [ ] Cart & Wishlist functionality
- [ ] Checkout & payment integration
- [ ] Order tracking system
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 👥 Team

| Name | Role |
|---|---|
| **Sahil** | Full-Stack Developer & Project Lead |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Made with 🖤 by **Sahil** — *SNITCH, Wear the Statement*

⭐ **Star this repo if you think SNITCH slaps!** ⭐

</div>
