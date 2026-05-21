import React from 'react';
import SellerDashboard from './SellerDashboard';
import StatCard       from '../../../../components/dashboard/StatCard';
import { useSellerEarnings } from '../Hooks/useSellerEarnings';
import '../style/SellerEarnings.scss';

// SVG bar chart
const EarningsBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value));
  const barW = 40, gap = 24, h = 160, pad = 16;
  const totalW = data.length * (barW + gap) - gap + pad * 2;

  return (
    <div className="earnings-bar">
      <svg viewBox={`0 0 ${totalW} ${h + 30}`} className="earnings-bar__svg" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D4AF7A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4AF7A" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const bh  = ((d.value / max) * (h - pad)) || 4;
          const bx  = pad + i * (barW + gap);
          const by  = h - bh;
          return (
            <g key={d.month}>
              <rect x={bx} y={by} width={barW} height={bh} fill="url(#barGrad)" rx="4" />
              <text x={bx + barW / 2} y={h + 18} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)" fontFamily="Manrope">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SellerEarnings = () => {
  const { earnings, loading } = useSellerEarnings();

  if (loading || !earnings) {
    return (
      <SellerDashboard breadcrumb={['Dashboard', 'Earnings & Payouts']}>
        <div className="seller-earnings-loading">Loading earnings data...</div>
      </SellerDashboard>
    );
  }

  const { summary, chartData, payouts } = earnings;

  return (
    <SellerDashboard breadcrumb={['Dashboard', 'Earnings & Payouts']}>
      <div className="seller-earnings">
        <div className="seller-earnings__header">
          <h1 className="seller-earnings__title">Earnings & Payouts</h1>
          <button className="seller-earnings__payout-btn">
            Request Payout
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="seller-earnings__summary">
          <StatCard icon="payments"      label="Total Earned"    value={summary.totalEarned} />
          <StatCard icon="pending"       label="Pending Payout"  value={summary.pendingPayout}   />
          <StatCard icon="account_balance" label="Withdrawn"     value={summary.withdrawn} />
        </div>

        {/* Bar Chart */}
        <div className="seller-earnings__card">
          <div className="seller-earnings__card-header">
            <h2 className="seller-earnings__section-title">Monthly Earnings</h2>
            <select className="seller-earnings__select">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <EarningsBarChart data={chartData} />
        </div>

        {/* Payout History Table */}
        <div className="seller-earnings__card">
          <div className="seller-earnings__card-header">
            <h2 className="seller-earnings__section-title">Payout History</h2>
          </div>
          <div className="seller-earnings__table-wrap">
            <table className="seller-earnings__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map(p => (
                  <tr key={p.txId}>
                    <td>{p.date}</td>
                    <td className="seller-earnings__amount">{p.amount}</td>
                    <td>{p.method}</td>
                    <td>
                      <span className={`seller-earnings__status seller-earnings__status--${p.status}`}>
                        {p.status === 'completed' ? '✓ Completed' : '⏳ Processing'}
                      </span>
                    </td>
                    <td className="seller-earnings__txid">{p.txId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerDashboard>
  );
};

export default SellerEarnings;
