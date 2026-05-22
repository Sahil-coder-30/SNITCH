import React, { useState, useEffect } from 'react';
import SellerDashboard from './SellerDashboard';
import { 
  getBanners, 
  uploadBannerImage, 
  saveActiveBanners, 
  deleteBanner 
} from '../services/banner.api';
import '../style/AdminBanners.scss';

const DEFAULT_GRADIENT = "linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #252525 100%)";
const DEFAULT_ACCENT = "#FFE066";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Load all banners from database
  const fetchAllBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data || []);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      showMsg("error", "Failed to load banners from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBanners();
  }, []);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showMsg("error", "File is too large. Max size is 10MB.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadBannerImage(formData);
      setBanners(prev => [response.banner, ...prev]);
      showMsg("success", "Banner image uploaded successfully to ImageKit!");
    } catch (error) {
      console.error("Upload failed:", error);
      showMsg("error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner image from ImageKit and database?")) {
      return;
    }

    try {
      await deleteBanner(id);
      setBanners(prev => prev.filter(b => b._id !== id));
      showMsg("success", "Banner deleted successfully.");
    } catch (error) {
      console.error("Deletion failed:", error);
      showMsg("error", "Failed to delete banner.");
    }
  };

  // Update banner fields in local state
  const handleFieldChange = (id, field, value) => {
    setBanners(prev => prev.map(b => {
      if (b._id === id) {
        return { ...b, [field]: value };
      }
      return b;
    }));
  };

  // Toggle active state
  const handleToggleActive = (id, activeStatus) => {
    setBanners(prev => prev.map(b => {
      if (b._id === id) {
        const nextOrder = activeStatus ? prev.filter(item => item.isActive).length : 0;
        return { ...b, isActive: activeStatus, order: nextOrder };
      }
      return b;
    }));
  };

  // Save the full configuration
  const handleSaveConfig = async () => {
    const activeBanners = banners.filter(b => b.isActive);

    if (activeBanners.length === 0) {
      showMsg("error", "Please select at least one active banner for the storefront.");
      return;
    }

    if (activeBanners.length > 8) {
      showMsg("error", "Too many active banners. We recommend choosing 5-6 banners.");
      return;
    }

    try {
      setSaving(true);
      // Sort active banners by order before saving
      const sortedActive = [...activeBanners].sort((a, b) => (a.order || 0) - (b.order || 0));
      await saveActiveBanners(sortedActive);
      showMsg("success", `Storefront configuration saved! ${sortedActive.length} banners are currently active.`);
      fetchAllBanners(); // Refresh list to sync order and updates
    } catch (error) {
      console.error("Failed to save banner configurations:", error);
      showMsg("error", "Failed to save storefront configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerDashboard breadcrumb={['Admin', 'Manage Banners']}>
      <div className="admin-banners">
        {/* Header Section */}
        <header className="admin-banners__header">
          <div className="admin-banners__title-wrap">
            <h1 className="admin-banners__title">Hero Section Banners</h1>
            <p className="admin-banners__subtitle">
              Upload banner assets to ImageKit and configure the active sliders shown in the Hero carousel.
            </p>
          </div>
          
          <div className="admin-banners__actions-wrap">
            {/* Upload Button */}
            <label className={`btn-upload ${uploading ? 'disabled' : ''}`}>
              <span className="material-symbols-outlined">upload_file</span>
              {uploading ? 'Uploading to ImageKit...' : 'Upload Image'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading} 
                style={{ display: 'none' }}
              />
            </label>

            {/* Save Config Button */}
            <button 
              className={`btn-save ${saving ? 'loading' : ''}`}
              onClick={handleSaveConfig}
              disabled={saving}
            >
              <span className="material-symbols-outlined">save</span>
              {saving ? 'Saving...' : 'Save Carousel Config'}
            </button>
          </div>
        </header>

        {/* Message Banner */}
        {message && (
          <div className={`alert-banner alert-banner--${message.type}`}>
            <span className="material-symbols-outlined">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="alert-banner__text">{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="banners-loading">
            <div className="spinner"></div>
            <p>Loading banners from database...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="banners-empty">
            <span className="material-symbols-outlined empty-icon">view_carousel</span>
            <h3>No Banners Found</h3>
            <p>Upload your first high-fashion streetwear banner image using the "Upload Image" button above.</p>
          </div>
        ) : (
          <div className="banners-grid">
            {banners.map((b) => (
              <div 
                key={b._id} 
                className={`banner-card ${b.isActive ? 'banner-card--active' : ''}`}
              >
                {/* Image Section */}
                <div className="banner-card__img-container">
                  <img src={b.imageUrl} alt="Banner Preview" className="banner-card__img" />
                  <div className="banner-card__badge-container">
                    <span className={`badge ${b.isActive ? 'badge--active' : 'badge--inactive'}`}>
                      {b.isActive ? 'Active Storefront' : 'Inactive'}
                    </span>
                  </div>
                  <button 
                    className="banner-card__btn-delete"
                    onClick={() => handleDelete(b._id)}
                    title="Delete banner"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                {/* Content Configuration Section */}
                <div className="banner-card__body">
                  <div className="banner-card__row flex-between">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={!!b.isActive} 
                        onChange={(e) => handleToggleActive(b._id, e.target.checked)}
                      />
                      <span className="checkbox-label">Activate Slide</span>
                    </label>
                    
                    {b.isActive && (
                      <div className="order-input-wrap">
                        <span className="order-label">Order:</span>
                        <input 
                          type="number" 
                          min="0" 
                          max="20"
                          value={b.order || 0}
                          onChange={(e) => handleFieldChange(b._id, 'order', parseInt(e.target.value) || 0)}
                          className="input-order"
                        />
                      </div>
                    )}
                  </div>

                  {b.isActive && (
                    <div className="banner-card__fields">
                      <div className="form-group">
                        <label>Main Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. NANO BANANA PRO: HOODIES"
                          value={b.title || ''}
                          onChange={(e) => handleFieldChange(b._id, 'title', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Subtitle / Description</label>
                        <textarea 
                          placeholder="e.g. Experience ultimate comfort with our oversized fleece-lined dark hoodies."
                          value={b.subtitle || ''}
                          rows={2}
                          onChange={(e) => handleFieldChange(b._id, 'subtitle', e.target.value)}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group half">
                          <label>Accent Color</label>
                          <div className="color-picker-wrap">
                            <input 
                              type="color" 
                              value={b.accent || DEFAULT_ACCENT}
                              onChange={(e) => handleFieldChange(b._id, 'accent', e.target.value)}
                            />
                            <input 
                              type="text" 
                              value={b.accent || DEFAULT_ACCENT}
                              onChange={(e) => handleFieldChange(b._id, 'accent', e.target.value)}
                              placeholder="#FFE066"
                            />
                          </div>
                        </div>

                        <div className="form-group half">
                          <label>CTA Button Label</label>
                          <input 
                            type="text" 
                            placeholder="Explore Collection"
                            value={b.cta || ''}
                            onChange={(e) => handleFieldChange(b._id, 'cta', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Background Gradient CSS</label>
                        <input 
                          type="text" 
                          placeholder="linear-gradient(...)"
                          value={b.gradient || DEFAULT_GRADIENT}
                          onChange={(e) => handleFieldChange(b._id, 'gradient', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SellerDashboard>
  );
};

export default AdminBanners;
