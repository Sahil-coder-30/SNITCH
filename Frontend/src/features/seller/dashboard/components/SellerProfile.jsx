import React, { useState, useEffect, useRef } from 'react';
import SellerDashboard from './SellerDashboard';
import { useSellerProfile } from '../Hooks/useSellerProfile';
import '../style/SellerProfile.scss';

const SellerProfile = () => {
  const { profile, loading, updateProfile } = useSellerProfile();

  // Local state for input fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [gstin, setGstin] = useState('');

  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');

  // Status feedback
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const fileInputRef = useRef(null);

  // Sync state with profile data on load
  useEffect(() => {
    if (profile) {
      setContactName(profile.name || '');
      setContactEmail(profile.email || '');
      setContactPhone(profile.phone || '');
      setCompanyName(profile.companyName || '');
      setDescription(profile.description || '');
      setGstin(profile.gstin || '');

      if (profile.address) {
        setAddrLine1(profile.address.line1 || '');
        setAddrLine2(profile.address.line2 || '');
        setAddrCity(profile.address.city || '');
        setAddrState(profile.address.state || '');
        setAddrPincode(profile.address.pincode || '');
      }
    }
  }, [profile]);

  const isChanged = () => {
    if (!profile) return false;
    const initialAddress = profile.address || {};
    return (
      contactName !== (profile.name || '') ||
      contactEmail !== (profile.email || '') ||
      contactPhone !== (profile.phone || '') ||
      companyName !== (profile.companyName || '') ||
      description !== (profile.description || '') ||
      gstin !== (profile.gstin || '') ||
      addrLine1 !== (initialAddress.line1 || '') ||
      addrLine2 !== (initialAddress.line2 || '') ||
      addrCity !== (initialAddress.city || '') ||
      addrState !== (initialAddress.state || '') ||
      addrPincode !== (initialAddress.pincode || '')
    );
  };

  if (loading || !profile) {
    return (
      <SellerDashboard breadcrumb={['Dashboard', 'My Profile']}>
        <div className="buyer-profile-loading">Loading store profile...</div>
      </SellerDashboard>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus({ type: 'loading', message: 'Saving changes...' });

    const address = {
      line1: addrLine1,
      line2: addrLine2,
      city: addrCity,
      state: addrState,
      pincode: addrPincode
    };

    const formData = new FormData();
    formData.append('name', contactName);
    formData.append('email', contactEmail);
    formData.append('phone', contactPhone);
    formData.append('companyName', companyName);
    formData.append('description', description);
    formData.append('gstin', gstin);
    formData.append('address', JSON.stringify(address));

    const res = await updateProfile(formData);
    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Store profile updated successfully!' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to update profile.' });
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaveStatus({ type: 'loading', message: 'Uploading store logo...' });

    const address = {
      line1: addrLine1,
      line2: addrLine2,
      city: addrCity,
      state: addrState,
      pincode: addrPincode
    };

    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('name', contactName);
    formData.append('email', contactEmail);
    formData.append('phone', contactPhone);
    formData.append('companyName', companyName);
    formData.append('description', description);
    formData.append('gstin', gstin);
    formData.append('address', JSON.stringify(address));

    const res = await updateProfile(formData);
    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Store logo updated successfully!' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to upload store logo.' });
    }
  };

  return (
    <SellerDashboard breadcrumb={['Dashboard', 'My Profile']}>
      <div className="seller-profile">
        <div className="seller-profile__top">
          {/* Left Column: Store Logo & Stats */}
          <div className="seller-profile__left-col">
            <div className="seller-profile__avatar-card">
              <div className="seller-profile__avatar-circle">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={companyName} className="seller-profile__avatar-img" />
                ) : (
                  <span className="seller-profile__avatar-initials">
                    {companyName ? companyName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) : 'ST'}
                  </span>
                )}
                <button className="seller-profile__avatar-edit" onClick={handleLogoClick} title="Change Store Logo">
                  <span className="material-symbols-outlined">photo_camera</span>
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </div>
              <h2 className="seller-profile__name">{companyName || 'SNITCH Store'}</h2>
              <span className="seller-profile__member-since">Seller since {profile.memberSince || 'May 2026'}</span>
              
              <div className="seller-profile__divider" />
              
              <div className="seller-profile__quick-stats">
                <div className="seller-profile__quick-stat">
                  <span className="seller-profile__quick-stat-value">₹{profile.stats?.revenue?.toLocaleString() || '0'}</span>
                  <span className="seller-profile__quick-stat-label">Revenue</span>
                </div>
                <div className="seller-profile__quick-stat">
                  <span className="seller-profile__quick-stat-value">{profile.stats?.orders || '0'}</span>
                  <span className="seller-profile__quick-stat-label">Orders</span>
                </div>
                <div className="seller-profile__quick-stat">
                  <span className="seller-profile__quick-stat-value">{profile.stats?.activeListings || '0'}</span>
                  <span className="seller-profile__quick-stat-label">Listings</span>
                </div>
                <div className="seller-profile__quick-stat">
                  <span className="seller-profile__quick-stat-value">⭐ {profile.stats?.rating || '5.0'}</span>
                  <span className="seller-profile__quick-stat-label">Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Forms */}
          <div className="seller-profile__right-col">
            {/* Store details */}
            <div className="seller-profile__card">
              <h2 className="seller-profile__card-title">Store Details</h2>
              <form onSubmit={handleSaveProfile}>
                <div className="seller-profile__form-grid" style={{ marginBottom: '24px' }}>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">Store Name</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. SNITCH Store"
                      required
                    />
                  </div>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">GSTIN Number</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                    />
                  </div>
                  <div className="seller-profile__field seller-profile__field--full">
                    <label className="seller-profile__label">Store Description</label>
                    <textarea 
                      className="seller-profile__textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your brand and apparel niche..."
                    />
                  </div>
                </div>

                <h2 className="seller-profile__card-title" style={{ marginTop: '32px', marginBottom: '20px' }}>Contact Information</h2>
                <div className="seller-profile__form-grid" style={{ marginBottom: '24px' }}>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">Contact Name</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Contact Person Full Name"
                      required
                    />
                  </div>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">Contact Email</label>
                    <input 
                      type="email" 
                      className="seller-profile__input"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Store Support/Contact Email"
                      required
                    />
                  </div>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="seller-profile__input"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Support contact phone"
                    />
                  </div>
                </div>

                <h2 className="seller-profile__card-title" style={{ marginTop: '32px', marginBottom: '20px' }}>Business Address</h2>
                <div className="seller-profile__form-grid" style={{ marginBottom: '24px' }}>
                  <div className="seller-profile__field seller-profile__field--full">
                    <label className="seller-profile__label">Address Line 1</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={addrLine1}
                      onChange={(e) => setAddrLine1(e.target.value)}
                      placeholder="Street address, building, suite"
                      required
                    />
                  </div>
                  <div className="seller-profile__field seller-profile__field--full">
                    <label className="seller-profile__label">Address Line 2</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={addrLine2}
                      onChange={(e) => setAddrLine2(e.target.value)}
                      placeholder="Area, locality (Optional)"
                    />
                  </div>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">City</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">State</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div className="seller-profile__field">
                    <label className="seller-profile__label">Pincode</label>
                    <input 
                      type="text" 
                      className="seller-profile__input"
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      placeholder="6-digit pincode"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                  <button type="submit" className="seller-profile__save-btn" disabled={!isChanged() || saveStatus.type === 'loading'}>
                    Save Changes
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  {saveStatus.message && (
                    <span style={{ 
                      fontSize: '13px', 
                      color: saveStatus.type === 'error' ? '#f87171' : saveStatus.type === 'success' ? '#4ade80' : '#D4AF7A' 
                    }}>
                      {saveStatus.message}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SellerDashboard>
  );
};

export default SellerProfile;
