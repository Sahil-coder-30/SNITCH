---
name: react-outlet-layout
description: How to implement shared layout with React Router's <Outlet /> in this project. Use this skill whenever the user wants to add a new page route, wrap routes with a shared navbar/footer/sidebar, create a layout component, nest routes, or asks how routing works in this app. Trigger this even if the user just says "add a new page" or "add a route" — this project's routing pattern must be followed.
---

# React Router Outlet Layout — Project Pattern

This project uses React Router v6 with a centralized layout component (`AppLayout`) that wraps all pages. Every new page must be added as a child route under `AppLayout`.

---

## How It Works

### 1. The Layout Component (`AppLayout.jsx`)

Located at `src/layouts/AppLayout.jsx` (or `src/components/AppLayout.jsx` — check your project).

```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../features/Shared/Component/Navbar';

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />   {/* ← child route renders here */}
    </>
  );
};

export default AppLayout;
```

- `<Navbar />` is always visible on every page — never unmounts during navigation.
- `<Outlet />` is the slot where the current page component renders.

---

### 2. Router Setup

The router defines `AppLayout` as the parent and all pages as its children:

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Cart from './pages/Cart';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,      // ← shared layout wraps everything
    children: [
      { path: '/',       element: <Home /> },
      { path: '/cart',   element: <Cart /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

## Adding a New Page — Step by Step

### Step 1: Create the page component

```jsx
// src/pages/MyNewPage.jsx
const MyNewPage = () => {
  return <div>My New Page</div>;
};

export default MyNewPage;
```

### Step 2: Import it in your router file

```jsx
import MyNewPage from './pages/MyNewPage';
```

### Step 3: Add it as a child route under `AppLayout`

```jsx
children: [
  { path: '/',           element: <Home /> },
  { path: '/cart',       element: <Cart /> },
  { path: '/my-new-page', element: <MyNewPage /> },  // ← add here
],
```

That's it. The new page automatically gets the `<Navbar />` for free.

---

## What Renders at Each URL

| URL | What renders |
|-----|-------------|
| `/` | `<Navbar />` + `<Home />` |
| `/cart` | `<Navbar />` + `<Cart />` |
| `/my-new-page` | `<Navbar />` + `<MyNewPage />` |

---

## Rules to Follow in This Project

1. **Never render `<Navbar />` inside a page component** — it's already handled by `AppLayout`.
2. **All pages must be children of `AppLayout`** in the router — never add a top-level route that bypasses it.
3. **Use `<Link>` or `useNavigate()`** from `react-router-dom` for navigation, not `<a href>`.
4. **Do not add a second `<RouterProvider>`** — there is only one router in this project.

---

## Adding Shared UI (Footer, Sidebar, etc.)

To add other shared elements alongside `<Navbar />`, edit `AppLayout.jsx`:

```jsx
const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />   {/* ← add shared footer here */}
    </>
  );
};
```

All pages immediately inherit the new shared element.