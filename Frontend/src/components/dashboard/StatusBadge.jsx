import React from 'react';
import './StatusBadge.scss';

// status: 'delivered' | 'processing' | 'shipped' | 'cancelled' | 'draft' | 'active' | 'out-of-stock' | 'pending' | 'returns'
const StatusBadge = ({ status }) => {
  const map = {
    delivered:    { label: 'Delivered',    icon: 'check_circle' },
    processing:   { label: 'Processing',   icon: 'autorenew'    },
    shipped:      { label: 'Shipped',      icon: 'local_shipping'},
    cancelled:    { label: 'Cancelled',    icon: 'cancel'       },
    pending:      { label: 'Pending',      icon: 'schedule'     },
    returns:      { label: 'Returns',      icon: 'undo'         },
    active:       { label: 'Active',       icon: 'circle'       },
    draft:        { label: 'Draft',        icon: 'edit_note'    },
    'out-of-stock': { label: 'Out of Stock', icon: 'inventory_2' },
  };

  const config = map[status] || { label: status, icon: 'circle' };

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="material-symbols-outlined status-badge__icon">{config.icon}</span>
      <span className="status-badge__label">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
