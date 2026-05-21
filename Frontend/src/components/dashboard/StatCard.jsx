import React from "react";
import "./StatCard.scss";
import { StatCardSkeleton } from "../loaders/ComponentSkeletons";

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendLabel,
  loading = false,
}) => {
  if (loading) return <StatCardSkeleton />;

  const isPos = trend && trend > 0;

  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <div className="stat-card__icon-wrap">
          <span className="material-symbols-outlined stat-card__icon">
            {icon}
          </span>
        </div>
        {trend !== undefined && (
          <span
            className={`stat-card__trend ${isPos ? "stat-card__trend--up" : "stat-card__trend--down"}`}
          >
            <span className="material-symbols-outlined stat-card__trend-icon">
              {isPos ? "arrow_upward" : "arrow_downward"}
            </span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {trendLabel && <div className="stat-card__trend-label">{trendLabel}</div>}
    </div>
  );
};

export default StatCard;
