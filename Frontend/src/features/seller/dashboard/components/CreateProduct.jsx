import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SellerDashboard from './SellerDashboard';
import '../style/CreateProduct.scss';
import { getClosestColorName } from '../../../../utils/colors.js';
import { useCreateProduct } from '../Hooks/useCreateProduct';
import { getStyleCodes, createStyleCode } from '../services/product.api';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CreateProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { submitProduct, isSubmitting, uploadStatus } = useCreateProduct();
  
  // Style codes from Passbook
  const [styleCodes, setStyleCodes] = useState([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [newStyleKey, setNewStyleKey] = useState('');
  const [generatingStyle, setGeneratingStyle] = useState(false);
  const [showNewStyleInput, setShowNewStyleInput] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryFor: 'Mens',
    categoryName: 'Tshirts',
    brand: 'SNITCH',
    originalPrice: '',
    price: '',
    discountPercent: '',
    badge: 'new-arrival',
    styleCode: '',
  });

  const [sizes, setSizes] = useState([
    { size: 'M', quantity: 0 }
  ]);

  // Exactly one color variant
  const [color, setColor] = useState({ hex: '#1a1a1a', name: 'Jet Black' });
  const [variantImages, setVariantImages] = useState([]);
  const [variantPreviews, setVariantPreviews] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Fetch style codes from passbook
  const fetchStyles = async () => {
    try {
      setLoadingStyles(true);
      const data = await getStyleCodes();
      setStyleCodes(data);
      
      // Pre-fill from query param if available
      const paramStyleCode = searchParams.get('styleCode');
      if (paramStyleCode) {
        setFormData(prev => ({ ...prev, styleCode: paramStyleCode }));
      } else if (data.length > 0) {
        setFormData(prev => ({ ...prev, styleCode: data[0].styleCode }));
      }
    } catch (error) {
      console.error("Failed to load style codes:", error);
    } finally {
      setLoadingStyles(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateStyleCode = async (e) => {
    e.preventDefault();
    if (!newStyleKey.trim()) {
      alert('Please enter a series name for the new style code.');
      return;
    }
    setGeneratingStyle(true);
    try {
      const response = await createStyleCode(newStyleKey.trim());
      if (response.style) {
        const newCode = response.style.styleCode;
        // Refetch and select
        const data = await getStyleCodes();
        setStyleCodes(data);
        setFormData(prev => ({ ...prev, styleCode: newCode }));
        setNewStyleKey('');
        setShowNewStyleInput(false);
        alert(`Successfully generated style code: ${newCode}`);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate style code.');
    } finally {
      setGeneratingStyle(false);
    }
  };

  const handleColorChange = (hexValue) => {
    setColor({
      hex: hexValue,
      name: getClosestColorName(hexValue)
    });
  };

  const handleVariantImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setVariantImages(prev => [...prev, ...files]);
    setVariantPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeVariantImage = (index) => {
    setVariantImages(prev => prev.filter((_, i) => i !== index));
    setVariantPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...sizes];
    if (field === 'quantity') {
      if (value === '') {
        newSizes[index][field] = '';
      } else {
        const val = parseInt(value, 10);
        newSizes[index][field] = isNaN(val) ? 0 : Math.max(0, val);
      }
    } else {
      newSizes[index][field] = value;
    }
    setSizes(newSizes);
  };

  const addSize = (sizeVal) => {
    if (!sizes.find(s => s.size === sizeVal)) {
      setSizes([...sizes, { size: sizeVal, quantity: 0 }]);
    } else {
      setSizes(sizes.filter(s => s.size !== sizeVal));
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.styleCode) {
      alert("Please select or generate a Style Code.");
      return;
    }

    if (!coverImage) {
      alert("Please configure a cover image.");
      return;
    }

    if (!sizes.some(s => s.quantity > 0)) {
      alert("Please add at least one Size with a quantity greater than 0");
      return;
    }

    const result = await submitProduct(formData, sizes, color, coverImage, variantImages);
    if (result.success) {
      alert('Product variant instantiated successfully!');
      navigate('/seller/products');
    } else {
      alert(result.error);
    }
  };

  return (
    <SellerDashboard breadcrumb={['Dashboard', 'My Products', 'Create New Product']}>
      <form className="create-product" onSubmit={handleSubmit}>
        <div className="create-product__header">
          <h1 className="create-product__title">Create New Product</h1>
          <p className="create-product__subtitle">A modern, unified flow to list a powerful product globally.</p>
        </div>

        <div className="create-product__layout">
          {/* LEFT: Form */}
          <div className="create-product__form-col">

            {/* SECTION 1 — Style Code Passbook Integration */}
            <div className="create-product__section">
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">01</span>
                Style Code Passbook Integration
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field">
                  <label className="create-product__label">Select Style Code</label>
                  {loadingStyles ? (
                    <p style={{ color: 'var(--color-text-dimmed)', fontSize: '13px' }}>Loading saved style codes...</p>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <select 
                        name="styleCode" 
                        value={formData.styleCode} 
                        onChange={handleInputChange} 
                        className="create-product__select" 
                        required
                      >
                        <option value="">-- Select Style Code --</option>
                        {styleCodes.map(s => (
                          <option key={s.id || s.styleCode} value={s.styleCode}>
                            {s.key} ({s.styleCode})
                          </option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        onClick={() => setShowNewStyleInput(!showNewStyleInput)} 
                        className="create-product__btn create-product__btn--ghost"
                        style={{ padding: '0 16px' }}
                      >
                        {showNewStyleInput ? 'Select Existing' : 'Generate New'}
                      </button>
                    </div>
                  )}
                </div>

                {showNewStyleInput && (
                  <div className="create-product__generator-panel">
                    <h3 className="create-product__generator-title">Generate Style Code</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={newStyleKey} 
                        onChange={e => setNewStyleKey(e.target.value)} 
                        placeholder="e.g. Linen Shirt Series" 
                        className="create-product__input"
                      />
                      <button 
                        type="button" 
                        disabled={generatingStyle} 
                        onClick={handleGenerateStyleCode}
                        className="create-product__btn create-product__btn--primary"
                        style={{ padding: '0 16px' }}
                      >
                        {generatingStyle ? 'Creating...' : 'Generate & Select'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2 — Basic Info */}
            <div className="create-product__section">
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">02</span>
                Basic Identifiers
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field">
                  <label className="create-product__label">Product Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="create-product__input" required placeholder="e.g. Oversized Black Hoodie" />
                </div>
                <div className="create-product__field">
                  <label className="create-product__label">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="create-product__textarea" rows={4} required placeholder="Craft a compelling story about this product..." />
                </div>
                <div className="create-product__field-row">
                  <div className="create-product__field">
                    <label className="create-product__label">Category For</label>
                    <select name="categoryFor" value={formData.categoryFor} onChange={handleInputChange} className="create-product__select" required>
                      <option value="Mens">Mens</option>
                      <option value="Womens">Womens</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="create-product__field">
                    <label className="create-product__label">Sub-Category</label>
                    <select name="categoryName" value={formData.categoryName} onChange={handleInputChange} className="create-product__select" required>
                      <option value="Tshirts">T-Shirts</option>
                      <option value="Shirts">Shirts</option>
                      <option value="Jeans">Jeans</option>
                      <option value="Trousers">Trousers</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Skirts">Skirts</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Coats">Coats</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>
                <div className="create-product__field">
                  <label className="create-product__label">Brand Strategy</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="create-product__input" required placeholder="e.g. SNITCH" />
                </div>
              </div>
            </div>

            {/* SECTION 3 — Pricing & Stock */}
            <div className="create-product__section">
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">03</span>
                Sales Analytics & Pricing
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field-row">
                  <div className="create-product__field">
                    <label className="create-product__label">Original Price (₹)</label>
                    <div className="create-product__currency-input">
                      <span className="create-product__currency-symbol">₹</span>
                      <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="create-product__input create-product__input--no-prefix" required placeholder="1299" />
                    </div>
                  </div>
                  <div className="create-product__field">
                    <label className="create-product__label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      Selling Price (₹)
                      {formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price) && (
                        <span className="create-product__discount-badge">
                          {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}% OFF
                        </span>
                      )}
                    </label>
                    <div className="create-product__currency-input">
                      <span className="create-product__currency-symbol">₹</span>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="create-product__input create-product__input--no-prefix" required placeholder="999" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — Sizes & Variant stock */}
            <div className="create-product__section">
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">04</span>
                Sizes Framework & Stock
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field">
                  <label className="create-product__label">Manage Size Capacity</label>
                  
                  {/* Select size to add */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                     {AVAILABLE_SIZES.map(s => {
                       const isActive = sizes.some(sz => sz.size === s);
                       return (
                         <button 
                           type="button" 
                           key={s} 
                           onClick={() => addSize(s)} 
                           className={`create-product__size-btn ${isActive ? 'create-product__size-btn--active' : ''}`}
                         >
                           {s}
                         </button>
                       );
                     })}
                  </div>

                  <div className="create-product__size-table-wrap">
                    <table className="create-product__size-table">
                      <thead>
                        <tr>
                          <th>Size Framework</th>
                          <th>Stock Integrity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizes.map((s, idx) => (
                          <tr key={idx}>
                            <td><span className="create-product__size-label">{s.size}</span></td>
                            <td><input type="number" min="0" value={s.quantity} onChange={(e) => updateSize(idx, 'quantity', e.target.value)} className="create-product__size-qty-input" placeholder="Qty" /></td>
                          </tr>
                        ))}
                        {sizes.length === 0 && (
                          <tr><td colSpan={2} className="create-product__gallery-empty">No sizes active. Add a size matrix above.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 5 — Color profiling & media pipeline */}
                <div className="create-product__field" style={{ marginTop: '20px' }}>
                  <label className="create-product__label">Color Profiling & Media Pipeline</label>
                  <p className="create-product__dropzone-hint" style={{ marginBottom: "20px" }}>Define robust color spectra and directly upload associated gallery variants.</p>
                  
                  <div className="create-product__color-card">
                    <div className="create-product__color-row">
                      <div className="create-product__color-picker-wrapper">
                        <input type="color" value={color.hex} onChange={(e) => handleColorChange(e.target.value)} className="create-product__color-picker-input" />
                      </div>
                      
                      <input type="text" value={color.hex} onChange={(e) => handleColorChange(e.target.value)} className="create-product__input create-product__input--sm create-product__color-hex-input" placeholder="#000000" />
                      
                      <input type="text" value={color.name} disabled className="create-product__input create-product__input--sm create-product__color-name-input" />
                    </div>

                    <div className="create-product__gallery-box">
                      <div className="create-product__gallery-header">
                         <span className="create-product__gallery-title">Media Files ({variantImages.length})</span>
                         <label className="create-product__btn create-product__btn--ghost create-product__gallery-btn">
                           <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_photo_alternate</span>
                           Upload Color Shots
                           <input type="file" multiple onChange={handleVariantImagesUpload} style={{ display: 'none' }} accept="image/*" />
                         </label>
                      </div>

                      {variantPreviews && variantPreviews.length > 0 ? (
                        <div className="create-product__gallery-previews">
                          {variantPreviews.map((previewStr, pIdx) => (
                            <div key={pIdx} className="create-product__gallery-thumb">
                              <img src={previewStr} alt="variant thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => removeVariantImage(pIdx)} className="create-product__gallery-thumb-remove">×</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="create-product__gallery-empty">No variant images uploaded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6 — Visibility */}
            <div className="create-product__section">
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">05</span>
                Marketing Telemetry
              </h2>
              <div className="create-product__fields">
                 <div className="create-product__field">
                    <label className="create-product__label">Promotional Badge</label>
                    <select name="badge" value={formData.badge} onChange={handleInputChange} className="create-product__select">
                      <option value="new-arrival">New Arrival (Boosts Discovery)</option>
                      <option value="best-seller">Best Seller (High Fidelity)</option>
                      <option value="limited-edition">Limited Edition (FOMO Bias)</option>
                      <option value="sale">Sale / Discounting</option>
                    </select>
                  </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Image upload + Preview */}
          <div className="create-product__preview-col">
            <div className="create-product__upload-card">
              <h2 className="create-product__section-title">Cover Architecture</h2>
              <p className="create-product__dropzone-hint mb-3">This acts as the primary conduit for the user experience.</p>
              
              <label className={`create-product__dropzone ${coverPreview ? 'create-product__dropzone--has-preview' : ''}`}>
                {coverPreview ? (
                  <img src={coverPreview} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} alt="Cover Preview" />
                ) : (
                  <>
                    <span className="material-symbols-outlined create-product__dropzone-icon">cloud_upload</span>
                    <p className="create-product__dropzone-title">Click to Establish Cover Image</p>
                  </>
                )}
                <input type="file" required onChange={handleCoverUpload} style={{ display: 'none' }} accept="image/*" />
                
                {coverPreview && (
                  <div className="create-product__dropzone-overlay">
                    Replace Cover Image
                  </div>
                )}
              </label>
            </div>

            <div className="create-product__preview-card">
              <h2 className="create-product__section-title">Marketplace Simulation</h2>
              <div className="create-product__preview-product">
                <div className="create-product__preview-img">
                   {coverPreview ? (
                      <img src={coverPreview} alt="mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                      <span className="material-symbols-outlined">checkroom</span>
                   )}
                </div>
                <div className="create-product__preview-body">
                  <span className="create-product__preview-brand">{formData.brand || 'SNITCH'}</span>
                  <span className="create-product__preview-name">{formData.title || 'Product Title'}</span>
                  <div className="create-product__preview-price-row">
                    <span className="create-product__preview-price">₹{formData.price || '999'}</span>
                    <span className="create-product__preview-original">₹{formData.originalPrice || '1299'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="create-product__action-bar">
          <button type="submit" disabled={isSubmitting} className="create-product__btn create-product__btn--primary" style={{ fontSize: '15px' }}>
            {isSubmitting ? uploadStatus || "Processing..." : "Create Product"}
            {!isSubmitting && <span className="material-symbols-outlined">rocket_launch</span>}
            {isSubmitting && <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite" }}>sync</span>}
          </button>
        </div>
      </form>
    </SellerDashboard>
  );
};

export default CreateProduct;
