import React from 'react';
import Sidebar from '../../../../components/dashboard/Sidebar';
import Navbar  from '../../../../components/dashboard/Navbar';
import '../style/SellerDashboard.scss';

/**
 * SellerDashboard — shell layout (sidebar + navbar + slot for page content)
 * Props:
 *   page: 'overview' | 'products' | 'create-product' | 'orders' | 'earnings'
 *   breadcrumb: string[]
 */
const SellerDashboard = ({ children, breadcrumb = ['Dashboard', 'Overview'] }) => (
  <div className="seller-dashboard">
    <Sidebar role="seller" />
    <div className="seller-dashboard__main">
      <Navbar role="seller" breadcrumb={breadcrumb} />
      <main className="seller-dashboard__content">
        {children}
      </main>
    </div>
  </div>
);

export default SellerDashboard;
