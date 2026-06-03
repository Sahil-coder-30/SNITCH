import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../Shared/Component/Sidebar';
import { DashboardContext } from '../../../Shared/Component/DashboardContext';
import '../style/SellerDashboard.scss';

/**
 * SellerDashboard — shell layout (sidebar + slot for page content)
 */
const SellerDashboard = ({ children }) => {
  const context = useContext(DashboardContext);
  const isNested = !!(context && context.isNested);
  const showSidebar = !isNested;

  return (
    <DashboardContext.Provider value={{ isNested: true }}>
      <div className={`seller-dashboard ${isNested ? 'seller-dashboard--nested' : ''}`}>
        {showSidebar && <Sidebar />}
        <div className="seller-dashboard__main">
          <main className="seller-dashboard__content">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default SellerDashboard;

