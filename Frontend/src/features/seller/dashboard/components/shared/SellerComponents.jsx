import React from 'react';
import { Card, Badge, Button } from '../../../../../components/common/UI';
import { StatCardSkeleton, Skeleton } from '../../../../../components/common/Feedback';
import './style/seller-shared.scss';

export const StatCard = ({ title, value, trend, icon, color = 'primary', loading = false }) => {
  if (loading) return <StatCardSkeleton color={color} />;
  
  return (
    <Card className={`sn-stat-card sn-stat-card--${color}`}>
      <div className="sn-stat-card__icon-wrap">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="sn-stat-card__content">
        <p className="sn-stat-card__title">{title}</p>
        <h3 className="sn-stat-card__value">{value}</h3>
        {trend && (
          <p className={`sn-stat-card__trend ${trend > 0 ? 'is-up' : 'is-down'}`}>
            <span className="material-symbols-outlined">
              {trend > 0 ? 'trending_up' : 'trending_down'}
            </span>
            {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
    </Card>
  );
};

export const SellerHeader = ({ title, subtitle, actions }) => {
  return (
    <header className="sn-seller-header">
      <div className="sn-seller-header__text">
        <h1 className="sn-seller-header__title">{title}</h1>
        {subtitle && <p className="sn-seller-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="sn-seller-header__actions">{actions}</div>}
    </header>
  );
};

export const DataTable = ({ columns, data, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="sn-table-container">
        <div className="sn-table-skeleton">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="sn-table-row-skeleton">
              {columns.map((col, j) => (
                <Skeleton key={j} width={j === 0 ? "40px" : "15%"} height="1rem" variant={j === 0 ? "rect" : "rect"} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="sn-table-empty">
        <p>{emptyMessage || 'No data available'}</p>
      </div>
    );
  }

  return (
    <div className="sn-table-container">
      <table className="sn-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SellerSidebar = ({ activePath }) => {
  const menuItems = [
    { label: 'Overview', icon: 'dashboard', path: '/seller' },
    { label: 'Products', icon: 'inventory', path: '/seller/products' },
    { label: 'Orders', icon: 'shopping_cart', path: '/seller/orders' },
    { label: 'Earnings', icon: 'payments', path: '/seller/earnings' },
    { label: 'Settings', icon: 'settings', path: '/seller/settings' },
  ];

  return (
    <nav className="sn-seller-sidebar">
      <div className="sn-seller-sidebar__logo">SNITCH SELLER</div>
      <div className="sn-seller-sidebar__menu">
        {menuItems.map(item => (
          <a 
            key={item.path} 
            href={item.path} 
            className={`sn-seller-sidebar__item ${activePath === item.path ? 'is-active' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
      <div className="sn-seller-sidebar__footer">
        <Button variant="ghost" icon="logout" className="sn-seller-sidebar__logout">Logout</Button>
      </div>
    </nav>
  );
};
