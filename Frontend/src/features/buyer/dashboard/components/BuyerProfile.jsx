import React from 'react';
import BuyerDashboard from './BuyerDashboard';
import { useBuyerProfile } from '../Hooks/useBuyerProfile';
import '../style/BuyerProfile.scss';

const BuyerProfile = () => {
  const { profile, loading, updateProfile } = useBuyerProfile();

  if (loading || !profile) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'My Profile']}>
        <div className="buyer-profile-loading">Loading profile...</div>
      </BuyerDashboard>
    );
  }

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Profile']}>
      <div className="buyer-profile">

        {/* Profile Layout */}
        <div className="buyer-profile__top">
          {/* Left: Avatar + Summary */}
          <div className="buyer-profile__left-col">
            <div className="buyer-profile__avatar-card">
              <div className="buyer-profile__avatar-circle">
                <span className="buyer-profile__avatar-initials">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
                <button className="buyer-profile__avatar-edit" title="Change photo">
                  <span className="material-symbols-outlined">photo_camera</span>
                </button>
              </div>
              <h2 className="buyer-profile__name">{profile.name}</h2>
              <span className="buyer-profile__member-since">Member since {profile.memberSince}</span>
              <div className="buyer-profile__divider" />
              <div className="buyer-profile__quick-stats">
                <div className="buyer-profile__quick-stat">
                  <span className="buyer-profile__quick-stat-value">{profile.stats.orders}</span>
                  <span className="buyer-profile__quick-stat-label">Orders</span>
                </div>
                <div className="buyer-profile__quick-stat">
                  <span className="buyer-profile__quick-stat-value">{profile.stats.wishlist}</span>
                  <span className="buyer-profile__quick-stat-label">Wishlist</span>
                </div>
                <div className="buyer-profile__quick-stat">
                  <span className="buyer-profile__quick-stat-value">{profile.stats.reviews}</span>
                  <span className="buyer-profile__quick-stat-label">Reviews</span>
                </div>
              </div>
              <a href="/seller/register" className="buyer-profile__become-seller">
                <span className="material-symbols-outlined">storefront</span>
                Start Selling on SNITCH
              </a>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="buyer-profile__right-col">
            <div className="buyer-profile__card">
              <h2 className="buyer-profile__card-title">Personal Information</h2>
              <div className="buyer-profile__form-grid">
                <div className="buyer-profile__field">
                  <label className="buyer-profile__label">Full Name</label>
                  <input type="text" className="buyer-profile__input" defaultValue={profile.name} />
                </div>
                <div className="buyer-profile__field">
                  <label className="buyer-profile__label">
                    Email Address
                    <span className="buyer-profile__verified">
                      <span className="material-symbols-outlined">verified</span>
                      Verified
                    </span>
                  </label>
                  <input type="email" className="buyer-profile__input" defaultValue={profile.email} />
                </div>
                <div className="buyer-profile__field">
                  <label className="buyer-profile__label">Phone</label>
                  <input type="tel" className="buyer-profile__input" defaultValue={profile.phone} />
                </div>
                <div className="buyer-profile__field">
                  <label className="buyer-profile__label">Date of Birth</label>
                  <input type="date" className="buyer-profile__input" defaultValue={profile.dob} />
                </div>
                <div className="buyer-profile__field">
                  <label className="buyer-profile__label">Gender</label>
                  <select className="buyer-profile__input" defaultValue={profile.gender}>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
              <button className="buyer-profile__save-btn">
                Save Changes
                <span className="material-symbols-outlined">check</span>
              </button>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="buyer-profile__card">
          <div className="buyer-profile__card-header">
            <h2 className="buyer-profile__card-title">Saved Addresses</h2>
            <button className="buyer-profile__add-btn">
              <span className="material-symbols-outlined">add</span>
              Add New Address
            </button>
          </div>
          <div className="buyer-profile__addresses">
            {profile.addresses.map((addr, idx) => (
              <div key={idx} className="buyer-profile__address-card">
                <div className="buyer-profile__address-header">
                  <span className="buyer-profile__address-type">{addr.type}</span>
                  <div className="buyer-profile__address-actions">
                    <button className="buyer-profile__icon-btn" title="Edit">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="buyer-profile__icon-btn buyer-profile__icon-btn--danger" title="Delete">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
                <p className="buyer-profile__address-line">{addr.line1}</p>
                <p className="buyer-profile__address-line">{addr.line2}</p>
                <p className="buyer-profile__address-phone">{addr.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="buyer-profile__card">
          <div className="buyer-profile__card-header">
            <h2 className="buyer-profile__card-title">Payment Methods</h2>
            <button className="buyer-profile__add-btn">
              <span className="material-symbols-outlined">add</span>
              Add Payment Method
            </button>
          </div>
          <div className="buyer-profile__payments">
            {profile.paymentMethods.map((pm, idx) => (
              <div key={idx} className="buyer-profile__payment-chip">
                <span className="buyer-profile__payment-icon">{pm.icon}</span>
                <div className="buyer-profile__payment-info">
                  <span className="buyer-profile__payment-label">{pm.label}</span>
                  <span className="buyer-profile__payment-id">
                    {pm.type === 'card' ? `•••• ${pm.last4}` : pm.id}
                  </span>
                </div>
                <button className="buyer-profile__icon-btn buyer-profile__icon-btn--danger" title="Remove">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default BuyerProfile;
