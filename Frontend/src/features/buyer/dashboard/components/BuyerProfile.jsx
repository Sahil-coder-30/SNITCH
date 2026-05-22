import React, { useState, useEffect, useRef } from 'react';
import BuyerDashboard from './BuyerDashboard';
import { useBuyerProfile } from '../Hooks/useBuyerProfile';
import { Modal } from '../../../../components/common/UI';
import { ProfileSkeleton } from '../../../../components/loaders/ComponentSkeletons';
import '../style/BuyerProfile.scss';

const BuyerProfile = () => {
  const { 
    profile, 
    loading, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    addPaymentMethod, 
    deletePaymentMethod 
  } = useBuyerProfile();

  // Form inputs state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileGender, setProfileGender] = useState('Prefer not to say');
  
  // Status feedback
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  // Address Modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressEditing, setAddressEditing] = useState(null);
  const [addrType, setAddrType] = useState('Home');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrPhone, setAddrPhone] = useState('');

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pmType, setPmType] = useState('card');
  const [pmLabel, setPmLabel] = useState('');
  const [pmLast4, setPmLast4] = useState('');
  const [pmId, setPmId] = useState('');

  const fileInputRef = useRef(null);

  // Sync state with profile data on load
  useEffect(() => {
    if (profile) {
      setProfileName(profile.name || '');
      setProfileEmail(profile.email || '');
      setProfilePhone(profile.phone || '');
      setProfileDob(profile.dob || '');
      setProfileGender(profile.gender || 'Prefer not to say');
    }
  }, [profile]);

  if (loading || !profile) {
    return (
      <BuyerDashboard breadcrumb={['Home', 'My Profile']}>
        <ProfileSkeleton />
      </BuyerDashboard>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus({ type: 'loading', message: 'Saving changes...' });
    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('email', profileEmail);
    formData.append('phone', profilePhone);
    formData.append('dob', profileDob);
    formData.append('gender', profileGender);

    const res = await updateProfile(formData);
    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to update profile.' });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaveStatus({ type: 'loading', message: 'Uploading photo...' });
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('name', profileName);
    formData.append('email', profileEmail);
    formData.append('phone', profilePhone);
    formData.append('dob', profileDob);
    formData.append('gender', profileGender);

    const res = await updateProfile(formData);
    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Avatar updated successfully!' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
    } else {
      setSaveStatus({ type: 'error', message: res.error || 'Failed to upload photo.' });
    }
  };

  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setAddressEditing(addr);
      setAddrType(addr.type || 'Home');
      setAddrLine1(addr.line1 || '');
      setAddrLine2(addr.line2 || '');
      setAddrPhone(addr.phone || '');
    } else {
      setAddressEditing(null);
      setAddrType('Home');
      setAddrLine1('');
      setAddrLine2('');
      setAddrPhone('');
    }
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const data = { type: addrType, line1: addrLine1, line2: addrLine2, phone: addrPhone };
    let res;
    if (addressEditing) {
      res = await updateAddress(addressEditing._id, data);
    } else {
      res = await addAddress(data);
    }
    if (res.success) {
      setAddressModalOpen(false);
      setAddressEditing(null);
    } else {
      alert(res.error || 'Failed to save address');
    }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    const icon = pmType === 'card' ? '💳' : pmType === 'upi' ? '📱' : '🏦';
    const data = { type: pmType, label: pmLabel, last4: pmLast4, id: pmId, icon };
    const res = await addPaymentMethod(data);
    if (res.success) {
      setPaymentModalOpen(false);
      setPmLabel('');
      setPmLast4('');
      setPmId('');
    } else {
      alert(res.error || 'Failed to add payment method');
    }
  };

  return (
    <BuyerDashboard breadcrumb={['Home', 'My Profile']}>
      <div className="buyer-profile">
        {/* Profile Layout */}
        <div className="buyer-profile__top">
          {/* Left: Avatar + Summary */}
          <div className="buyer-profile__left-col">
            <div className="buyer-profile__avatar-card">
              <div className="buyer-profile__avatar-circle">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.name} className="buyer-profile__avatar-img" />
                ) : (
                  <span className="buyer-profile__avatar-initials">
                    {profileName.split(' ').filter(Boolean).map(n => n[0]).join('')}
                  </span>
                )}
                <button className="buyer-profile__avatar-edit" onClick={handleAvatarClick} title="Change photo">
                  <span className="material-symbols-outlined">photo_camera</span>
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </div>
              <h2 className="buyer-profile__name">{profileName || profile.name}</h2>
              <span className="buyer-profile__member-since">Member since {profile.memberSince || 'May 2026'}</span>
              <div className="buyer-profile__divider" />
              <div className="buyer-profile__quick-stats">
                <div className="buyer-profile__quick-stat">
                  <span className="buyer-profile__quick-stat-value">{profile.stats?.orders || 0}</span>
                  <span className="buyer-profile__quick-stat-label">Orders</span>
                </div>
                <div className="buyer-profile__quick-stat">
                  <span className="buyer-profile__quick-stat-value">{profile.stats?.wishlist || 0}</span>
                  <span className="buyer-profile__quick-stat-label">Wishlist</span>
                </div>
                <div className="buyer-profile__quick-stat">
                  <span className="buyer-profile__quick-stat-value">{profile.stats?.reviews || 0}</span>
                  <span className="buyer-profile__quick-stat-label">Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="buyer-profile__right-col">
            <div className="buyer-profile__card">
              <h2 className="buyer-profile__card-title">Personal Information</h2>
              <form onSubmit={handleSaveProfile} className="buyer-profile__modal-form">
                <div className="buyer-profile__form-grid">
                  <div className="buyer-profile__field">
                    <label className="buyer-profile__label">Full Name</label>
                    <input 
                      type="text" 
                      className="buyer-profile__input" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="buyer-profile__field">
                    <label className="buyer-profile__label">
                      Email Address
                      <span className="buyer-profile__verified">
                        <span className="material-symbols-outlined">verified</span>
                        Verified
                      </span>
                    </label>
                    <input 
                      type="email" 
                      className="buyer-profile__input" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                      required
                    />
                  </div>
                  <div className="buyer-profile__field">
                    <label className="buyer-profile__label">Phone</label>
                    <input 
                      type="tel" 
                      className="buyer-profile__input" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                    />
                  </div>
                  <div className="buyer-profile__field">
                    <label className="buyer-profile__label">Date of Birth</label>
                    <input 
                      type="date" 
                      className="buyer-profile__input" 
                      value={profileDob} 
                      onChange={(e) => setProfileDob(e.target.value)} 
                    />
                  </div>
                  <div className="buyer-profile__field">
                    <label className="buyer-profile__label">Gender</label>
                    <select 
                      className="buyer-profile__input" 
                      value={profileGender} 
                      onChange={(e) => setProfileGender(e.target.value)}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button type="submit" className="buyer-profile__save-btn" disabled={saveStatus.type === 'loading'}>
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

        {/* Saved Addresses */}
        <div className="buyer-profile__card">
          <div className="buyer-profile__card-header">
            <h2 className="buyer-profile__card-title">Saved Addresses</h2>
            <button className="buyer-profile__add-btn" onClick={() => handleOpenAddressModal()}>
              <span className="material-symbols-outlined">add</span>
              Add New Address
            </button>
          </div>
          <div className="buyer-profile__addresses">
            {profile.addresses && profile.addresses.length > 0 ? (
              profile.addresses.map((addr) => (
                <div key={addr._id} className="buyer-profile__address-card">
                  <div className="buyer-profile__address-header">
                    <span className="buyer-profile__address-type">{addr.type}</span>
                    <div className="buyer-profile__address-actions">
                      <button className="buyer-profile__icon-btn" onClick={() => handleOpenAddressModal(addr)} title="Edit">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="buyer-profile__icon-btn buyer-profile__icon-btn--danger" onClick={() => deleteAddress(addr._id)} title="Delete">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                  <p className="buyer-profile__address-line">{addr.line1}</p>
                  {addr.line2 && <p className="buyer-profile__address-line">{addr.line2}</p>}
                  {addr.phone && <p className="buyer-profile__address-phone">{addr.phone}</p>}
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--color-text-dimmed)', fontSize: '13px', gridColumn: '1/-1' }}>No saved addresses found.</div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="buyer-profile__card">
          <div className="buyer-profile__card-header">
            <h2 className="buyer-profile__card-title">Payment Methods</h2>
            <button className="buyer-profile__add-btn" onClick={() => setPaymentModalOpen(true)}>
              <span className="material-symbols-outlined">add</span>
              Add Payment Method
            </button>
          </div>
          <div className="buyer-profile__payments">
            {profile.paymentMethods && profile.paymentMethods.length > 0 ? (
              profile.paymentMethods.map((pm) => (
                <div key={pm._id} className="buyer-profile__payment-chip">
                  <span className="buyer-profile__payment-icon">{pm.icon}</span>
                  <div className="buyer-profile__payment-info">
                    <span className="buyer-profile__payment-label">{pm.label}</span>
                    <span className="buyer-profile__payment-id">
                      {pm.type === 'card' ? `•••• ${pm.last4}` : pm.id}
                    </span>
                  </div>
                  <button className="buyer-profile__icon-btn buyer-profile__icon-btn--danger" onClick={() => deletePaymentMethod(pm._id)} title="Remove">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--color-text-dimmed)', fontSize: '13px' }}>No payment methods saved.</div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => { setAddressModalOpen(false); setAddressEditing(null); }}
        title={addressEditing ? "Edit Address" : "Add New Address"}
      >
        <form onSubmit={handleSaveAddress} className="buyer-profile__modal-form">
          <div className="buyer-profile__field">
            <label className="buyer-profile__label">Address Type</label>
            <select className="buyer-profile__input" value={addrType} onChange={(e) => setAddrType(e.target.value)}>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="buyer-profile__field">
            <label className="buyer-profile__label">Address Line 1</label>
            <input 
              type="text" 
              className="buyer-profile__input" 
              value={addrLine1} 
              onChange={(e) => setAddrLine1(e.target.value)} 
              placeholder="e.g. 123 Main St, Apartment 4B"
              required 
            />
          </div>
          <div className="buyer-profile__field">
            <label className="buyer-profile__label">Address Line 2</label>
            <input 
              type="text" 
              className="buyer-profile__input" 
              value={addrLine2} 
              onChange={(e) => setAddrLine2(e.target.value)} 
              placeholder="e.g. Landmark, Locality (Optional)" 
            />
          </div>
          <div className="buyer-profile__field">
            <label className="buyer-profile__label">Phone Number</label>
            <input 
              type="tel" 
              className="buyer-profile__input" 
              value={addrPhone} 
              onChange={(e) => setAddrPhone(e.target.value)} 
              placeholder="10-digit mobile number"
              required 
            />
          </div>
          <div className="buyer-profile__modal-footer">
            <button type="button" className="buyer-profile__cancel-btn" onClick={() => { setAddressModalOpen(false); setAddressEditing(null); }}>Cancel</button>
            <button type="submit" className="buyer-profile__save-btn">Save Address</button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Add Payment Method"
      >
        <form onSubmit={handleSavePayment} className="buyer-profile__modal-form">
          <div className="buyer-profile__field">
            <label className="buyer-profile__label">Payment Type</label>
            <select className="buyer-profile__input" value={pmType} onChange={(e) => setPmType(e.target.value)}>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI ID</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>
          <div className="buyer-profile__field">
            <label className="buyer-profile__label">Label / Name</label>
            <input 
              type="text" 
              className="buyer-profile__input" 
              value={pmLabel} 
              onChange={(e) => setPmLabel(e.target.value)} 
              placeholder="e.g. HDFC Credit Card, Google Pay" 
              required 
            />
          </div>
          {pmType === 'card' ? (
            <div className="buyer-profile__field">
              <label className="buyer-profile__label">Last 4 Digits</label>
              <input 
                type="text" 
                maxLength="4" 
                pattern="\d{4}" 
                className="buyer-profile__input" 
                value={pmLast4} 
                onChange={(e) => setPmLast4(e.target.value)} 
                placeholder="e.g. 4321" 
                required 
              />
            </div>
          ) : (
            <div className="buyer-profile__field">
              <label className="buyer-profile__label">UPI ID / Account ID</label>
              <input 
                type="text" 
                className="buyer-profile__input" 
                value={pmId} 
                onChange={(e) => setPmId(e.target.value)} 
                placeholder="e.g. name@bank" 
                required 
              />
            </div>
          )}
          <div className="buyer-profile__modal-footer">
            <button type="button" className="buyer-profile__cancel-btn" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
            <button type="submit" className="buyer-profile__save-btn">Save Payment</button>
          </div>
        </form>
      </Modal>
    </BuyerDashboard>
  );
};

export default BuyerProfile;
