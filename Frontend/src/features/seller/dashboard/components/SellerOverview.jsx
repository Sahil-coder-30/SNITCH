import React from 'react';
import SellerDashboard from './SellerDashboard';
import StatCard       from '../../../../components/dashboard/StatCard';
import StatusBadge    from '../../../../components/dashboard/StatusBadge';
import { useSellerOverview } from '../Hooks/useSellerOverview';
import '../style/SellerOverview.scss';

const SellerOverview = () => {
  const { loading, data } = useSellerOverview();

  const RevenueChart = () => (
    <div className="revenue-chart revenue-chart--empty">
      <span className="material-symbols-outlined">analytics</span>
      <p>No revenue data recorded</p>
    </div>
  );

  const DonutChart = () => (
    <div className="donut-chart donut-chart--empty">
      <p>Awaiting Orders</p>
    </div>
  );

  return (
    <SellerDashboard breadcrumb={['Dashboard', 'Overview']}>
      <div className="seller-overview">
        {/* ROW 1 — Stat Cards */}
        <div className="seller-overview__stat-row">
            <StatCard loading={loading} icon="payments"     label="Total Revenue"    value={`₹${data.stats.revenue}`} />
            <StatCard loading={loading} icon="inventory_2"  label="Total Orders"     value={data.stats.orders.toString()} />
            <StatCard loading={loading} icon="checkroom"    label="Active Listings"  value={data.stats.activeListings.toString()} />
            <StatCard loading={loading} icon="star"         label="Avg. Rating"      value={`⭐ ${data.stats.rating} / 5`} />
        </div>

        {/* ROW 2 — Charts & Top Products */}
        <div className="seller-overview__row-2">
          <div className="seller-overview__card seller-overview__card--chart">
            <div className="seller-overview__card-header">
              <h2 className="seller-overview__section-title">Revenue Overview</h2>
            </div>
            {loading ? <div className="skeleton-pulse" style={{ height: '240px' }} /> : <RevenueChart />}
          </div>

          <div className="seller-overview__card">
            <div className="seller-overview__card-header">
              <h2 className="seller-overview__section-title">Top Selling Products</h2>
            </div>
            <div className="seller-overview__top-products">
              {loading ? (
                <div className="skeleton-pulse" style={{ height: '240px' }} />
              ) : data.topProducts.length > 0 ? (
                data.topProducts.map((p, idx) => (
                  <div key={idx} className="seller-overview__top-product-row">
                    <span className="seller-overview__top-rank">{idx + 1}</span>
                    <div className="seller-overview__top-thumb">
                       <span className="material-symbols-outlined">image</span>
                    </div>
                    <div className="seller-overview__top-info">
                       <span className="seller-overview__top-name">{p.name}</span>
                       <span className="seller-overview__top-cat">{p.category}</span>
                    </div>
                    <div className="seller-overview__top-stats">
                       <span className="seller-overview__top-sold">{p.sold} sold</span>
                       <span className="seller-overview__top-revenue">₹{p.revenue}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sf-empty-text">No sales data yet</div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 3 — Recent Orders */}
        <div className="seller-overview__row-3">
          <div className="seller-overview__card">
            <div className="seller-overview__card-header">
              <h2 className="seller-overview__section-title">Recent Orders</h2>
              {!loading && <a href="/seller/orders" className="seller-overview__view-all">View All →</a>}
            </div>
            <div className="seller-overview__table-wrap">
              {loading ? (
                <div className="skeleton-pulse" style={{ height: '260px' }} />
              ) : data.recentOrders.length > 0 ? (
                <table className="seller-overview__table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map(o => (
                      <tr key={o.id}>
                        <td className="seller-overview__order-id">#{o.id}</td>
                        <td>{o.customer}</td>
                        <td className="seller-overview__product-name">{o.product}</td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className="seller-overview__amount">₹{o.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="sf-empty-table">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  <p>No recent orders found</p>
                </div>
              )}
            </div>
          </div>

          <div className="seller-overview__card">
            <div className="seller-overview__card-header">
              <h2 className="seller-overview__section-title">Order Status Distribution</h2>
            </div>
            <div className="seller-overview__content--centered">
               {loading ? <div className="skeleton-pulse" style={{ height: '260px', borderRadius: '50%' }} /> : <DonutChart />}
            </div>
          </div>
        </div>
      </div>
    </SellerDashboard>
  );
};


export default SellerOverview;
