import React, { useState, useContext } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../../../Shared/Component/Sidebar';
import { DashboardContext } from '../../../Shared/Component/DashboardContext';
import '../style/BuyerDashboard.scss';
import '../../../store/style/StoreFront.scss';

// ── Page metadata for app-bar ─────────────────────────────────
const PAGE_CONFIG = {
  '/buyer/cart':          { title: 'My Cart',         back: '/buyer'          },
  '/buyer/orders':        { title: 'My Orders',        back: '/buyer'          },
  '/buyer/wishlist':      { title: 'Wishlist',          back: '/buyer'          },
  '/buyer/profile':       { title: 'My Profile',       back: '/buyer'          },
  '/buyer/all-orders':    { title: 'All Orders',       back: '/buyer/orders'   },
  '/buyer/return':        { title: 'Return Request',   back: '/buyer/orders'   },
  '/buyer/review':        { title: 'Write a Review',   back: '/buyer/orders'   },
  '/buyer/refund-status': { title: 'Refund Status',    back: '/buyer/orders'   },
};

const getPageInfo = (pathname) => {
  if (PAGE_CONFIG[pathname]) return PAGE_CONFIG[pathname];
  if (pathname.startsWith('/buyer/orders/')) return { title: 'Order Details',  back: '/buyer/orders' };
  if (pathname.startsWith('/buyer/track/'))  return { title: 'Track Order',    back: '/buyer/orders' };
  return { title: 'My Account', back: '/buyer' };
};

const BuyerDashboard = ({ children }) => {
  const context = useContext(DashboardContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('buyer-sidebar-collapsed');
    return saved !== null ? saved === 'true' : true;
  });
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isNested = !!(context && context.isNested);
  const showSidebar = !isNested;

  const isStorefront = location.pathname === '/' || location.pathname === '/buyer' || location.pathname === '/search' || !user;
  const pageInfo = getPageInfo(location.pathname);

  return (
    <DashboardContext.Provider value={{ isNested: true }}>
      <div className={`sf-root buyer-dashboard ${showSidebar ? 'buyer-dashboard--with-sidebar' : ''} ${isNested ? 'buyer-dashboard--nested' : ''}`}>
        
        {/* ── App Bar — only visible on mobile for inner pages ── */}
        {!isStorefront && !isNested && (
          <header className="app-bar app-bar--mobile-only" role="banner">
            {/* Mobile: hamburger to toggle sidebar */}
            <button
              className="app-bar__menu-btn"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <h1 className="app-bar__title">{pageInfo.title}</h1>
          </header>
        )}

        {/* ── Main Layout ─────────────────────────────────────── */}
        <div className="buyer-dashboard__page-wrap">
          {showSidebar && (
            <Sidebar
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
            />
          )}

          <main className={`buyer-dashboard__main-content ${showSidebar ? 'buyer-dashboard__main-content--has-sidebar' : ''} ${sidebarCollapsed ? 'buyer-dashboard__main-content--collapsed' : ''}`}>
            <div className="buyer-dashboard__container">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default BuyerDashboard;

