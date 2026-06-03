import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../features/Shared/Component/Navbar';
import Sidebar from '../features/Shared/Component/Sidebar';
import { DashboardContext } from '../features/Shared/Component/DashboardContext';
import './style/appLayout.scss';

const AppLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role; // 'BUYER' | 'SELLER' | undefined

  // Unified sidebar collapse state — lifted here so it persists across all route changes
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const key = role === 'SELLER' ? 'seller-sidebar-collapsed' : 'buyer-sidebar-collapsed';
    const saved = localStorage.getItem(key);
    if (saved !== null) return saved === 'true';
    return role === 'SELLER' ? false : true; // default: seller expanded, buyer/guest collapsed
  });

  return (
    <DashboardContext.Provider value={{ isNested: true }}>
      <div className="app-layout">
        {/* ── Shared Navbar (position: sticky, top: 0, height: 64px) ── */}
        <Navbar />

        {/* ── Body: flex row → [Sidebar] + [Main] ── */}
        <div className="app-layout__body">
          <Sidebar
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
          />

          {/* Page content — Outlet renders the matched route here */}
          <main className="app-layout__main">
            <Outlet />
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default AppLayout;