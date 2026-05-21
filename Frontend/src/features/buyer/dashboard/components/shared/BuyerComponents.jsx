import React from 'react';
import { Card, Badge, Button } from '../../../../../components/common/UI';
import { Skeleton } from '../../../../../components/common/Feedback';
import './style/buyer-shared.scss';

export const OrderCard = ({ order, loading = false }) => {
  if (loading) {
    return (
      <Card className="sn-order-card is-skeleton">
        <div className="sn-order-card__header">
          <div className="sn-order-card__meta">
            <Skeleton width="120px" height="1.25rem" className="mb-2" />
            <Skeleton width="180px" height="0.875rem" />
          </div>
          <Skeleton width="80px" height="24px" />
        </div>
        <div className="sn-order-card__items">
          <div className="sn-order-item">
            <Skeleton width="64px" height="80px" />
            <div className="sn-order-item__info">
              <Skeleton width="60%" height="1.125rem" className="mb-2" />
              <Skeleton width="40%" height="0.875rem" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="sn-order-card">
      <div className="sn-order-card__header">
        <div className="sn-order-card__meta">
          <p className="sn-order-card__id">Order #{order.id}</p>
          <p className="sn-order-card__date">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <Badge 
          variant={order.status === 'DELIVERED' ? 'success' : 'warning'}
          className="sn-order-card__status"
        >
          {order.status}
        </Badge>
      </div>

      <div className="sn-order-card__items">
        {order.items?.map(item => (
          <div key={item.id} className="sn-order-item">
            <img src={item.image} alt={item.name} className="sn-order-item__img" />
            <div className="sn-order-item__info">
              <p className="sn-order-item__name">{item.name}</p>
              <p className="sn-order-item__variant">Size: {item.size} | Qty: {item.quantity}</p>
            </div>
            <p className="sn-order-item__price">₹{item.price?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="sn-order-card__footer">
        <p className="sn-order-card__total">Total: <span>₹{order.total?.toLocaleString()}</span></p>
        <div className="sn-order-card__actions">
          <Button variant="secondary" size="sm">View Details</Button>
          {order.status === 'DELIVERED' && <Button variant="primary" size="sm">Write Review</Button>}
        </div>
      </div>
    </Card>
  );
};

export const AddressCard = ({ address, isDefault, onEdit, onDelete }) => {
  return (
    <Card className={`sn-address-card ${isDefault ? 'is-default' : ''}`}>
      <div className="sn-address-card__header">
        <h4 className="sn-address-card__type">{address.type || 'Home'}</h4>
        {isDefault && <Badge variant="primary" size="sm">Default</Badge>}
      </div>
      <div className="sn-address-card__body">
        <p className="sn-address-card__name">{address.name}</p>
        <p className="sn-address-card__text">{address.street}, {address.city}</p>
        <p className="sn-address-card__text">{address.state} - {address.zipCode}</p>
        <p className="sn-address-card__phone">Phone: {address.phone}</p>
      </div>
      <div className="sn-address-card__footer">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete} className="is-danger">Remove</button>
      </div>
    </Card>
  );
};

export const ProfileSidebar = ({ activePath }) => {
  const menuItems = [
    { label: 'Profile Info', icon: 'person', path: '/buyer/profile' },
    { label: 'My Orders', icon: 'shopping_bag', path: '/buyer/orders' },
    { label: 'My Wishlist', icon: 'favorite', path: '/buyer/wishlist' },
    { label: 'Saved Addresses', icon: 'location_on', path: '/buyer/addresses' },
    { label: 'Settings', icon: 'settings', path: '/buyer/settings' },
  ];

  return (
    <nav className="sn-profile-sidebar">
      {menuItems.map(item => (
        <a 
          key={item.path} 
          href={item.path} 
          className={`sn-profile-sidebar__item ${activePath === item.path ? 'is-active' : ''}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
};
