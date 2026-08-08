import React from 'react';
import Card from '../Card/Card';
import './StatCard.css';

export const StatCard = ({
  title,
  value,
  subtitle = '',
  icon = null,
  type = 'primary', // 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'muted'
  change = null,
  className = ''
}) => {
  return (
    <Card className={`dt-stat-card dt-stat-card--${type} ${className}`} hoverable>
      <div className="dt-stat-card__header">
        <span className="dt-stat-card__title">{title}</span>
        {icon && <div className={`dt-stat-card__icon-box dt-stat-card__icon-box--${type}`}>{icon}</div>}
      </div>
      <div className="dt-stat-card__body">
        <div className="dt-stat-card__value">{value}</div>
        {(subtitle || change) && (
          <div className="dt-stat-card__meta">
            {change && <span className="dt-stat-card__change">{change}</span>}
            {subtitle && <span className="dt-stat-card__subtitle">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
