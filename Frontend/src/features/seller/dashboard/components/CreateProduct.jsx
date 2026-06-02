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
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">01</span>
                Style Code Passbook Integration
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field">
                  <label className="create-product__label">Select Style Code</label>
                  {loadingStyles ? (
                    <p style={{ color: '#666', fontSize: '13px' }}>Loading saved style codes...</p>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <select 
                        name="styleCode" 
                        value={formData.styleCode} 
                        onChange={handleInputChange} 
                        className="create-product__select" 
                        required 
                        style={{ background: '#1c1c1c', flex: 1 }}
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
                        style={{ padding: '0 16px', background: '#222', borderColor: '#333' }}
                      >
                        {showNewStyleInput ? 'Select Existing' : 'Generate New'}
                      </button>
                    </div>
                  )}
                </div>

                {showNewStyleInput && (
                  <div style={{ background: '#181818', border: '1px dashed #333', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
                    <h3 style={{ fontSize: '14px', color: '#e8c88a', marginBottom: '8px' }}>Generate Style Code</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={newStyleKey} 
                        onChange={e => setNewStyleKey(e.target.value)} 
                        placeholder="e.g. Linen Shirt Series" 
                        className="create-product__input"
                        style={{ background: '#0a0a0a', flex: 1 }}
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
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">02</span>
                Basic Identifiers
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field">
                  <label className="create-product__label">Product Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="create-product__input" required placeholder="e.g. Oversized Black Hoodie" style={{ background: '#1c1c1c' }} />
                </div>
                <div className="create-product__field">
                  <label className="create-product__label">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="create-product__textarea" rows={4} required placeholder="Craft a compelling story about this product..." style={{ background: '#1c1c1c' }} />
                </div>
                <div className="create-product__field-row">
                  <div className="create-product__field">
                    <label className="create-product__label">Category For</label>
                    <select name="categoryFor" value={formData.categoryFor} onChange={handleInputChange} className="create-product__select" required style={{ background: '#1c1c1c' }}>
                      <option value="Mens">Mens</option>
                      <option value="Womens">Womens</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>
                  <div className="create-product__field">
                    <label className="create-product__label">Sub-Category</label>
                    <select name="categoryName" value={formData.categoryName} onChange={handleInputChange} className="create-product__select" required style={{ background: '#1c1c1c' }}>
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
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="create-product__input" required placeholder="e.g. SNITCH" style={{ background: '#1c1c1c' }} />
                </div>
              </div>
            </div>

            {/* SECTION 3 — Pricing & Stock */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">03</span>
                Sales Analytics & Pricing
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field-row">
                  <div className="create-product__field">
                    <label className="create-product__label">Original Price (₹)</label>
                    <div className="create-product__currency-input" style={{ background: '#1c1c1c', border: '1px solid #333' }}>
                      <span className="create-product__currency-symbol" style={{ background: '#222', color: '#999', borderColor: '#333' }}>₹</span>
                      <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="create-product__input create-product__input--no-prefix" required placeholder="1299" style={{ border: 'none', background: 'transparent' }} />
                    </div>
                  </div>
                  <div className="create-product__field">
                    <label className="create-product__label" style={{ display: 'flex', justifycontent: 'space-between' }}>
                      Selling Price (₹)
                      {formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price) && (
                        <span className="create-product__discount-badge">
                          {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}% OFF
                        </span>
                      )}
                    </label>
                    <div className="create-product__currency-input" style={{ background: '#1c1c1c', border: '1px solid #333' }}>
                      <span className="create-product__currency-symbol" style={{ background: '#222', color: '#999', borderColor: '#333' }}>₹</span>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="create-product__input create-product__input--no-prefix" required placeholder="999" style={{ border: 'none', background: 'transparent' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — Sizes & Variant stock */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">04</span>
                Sizes Framework & Stock
              </h2>
              <div className="create-product__fields">
                <div className="create-product__field">
                  <label className="create-product__label" style={{ color: '#aaa', marginBottom: '8px' }}>Manage Size Capacity</label>
                  
                  {/* Select size to add */}
                  <div style={{display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap'}}>
                     {AVAILABLE_SIZES.map(s => (
                       <button type="button" key={s} onClick={() => addSize(s)} className="create-product__btn create-product__btn--ghost" style={{padding: '5px 12px', background: sizes.find(sz => sz.size === s) ? '#e8c88a' : '#1c1c1c', color: sizes.find(sz => sz.size === s) ? '#000' : '#fff', border: '1px solid #333'}}>{s}</button>
                     ))}
                  </div>

                  <div className="create-product__size-table-wrap">
                    <table className="create-product__size-table" style={{ background: '#1c1c1c', borderRadius: '8px', borderCollapse: 'separate', overflow: 'hidden', border: '1px solid #333' }}>
                      <thead style={{ background: '#222' }}>
                        <tr>
                          <th style={{ color: '#ccc', borderBottom: '1px solid #333' }}>Size Framework</th>
                          <th style={{ color: '#ccc', borderBottom: '1px solid #333' }}>Stock Integrity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizes.map((s, idx) => (
                          <tr key={idx}>
                            <td style={{ borderBottom: '1px solid #2a2a2a' }}><span className="create-product__size-label" style={{ background: '#000', border: '1px solid #444', color: '#e8c88a' }}>{s.size}</span></td>
                            <td style={{ borderBottom: '1px solid #2a2a2a' }}><input type="number" min="0" value={s.quantity} onChange={(e) => updateSize(idx, 'quantity', e.target.value)} className="create-product__input" style={{ width: '100px', background: '#000', border: '1px solid #444' }} placeholder="Qty" /></td>
                          </tr>
                        ))}
                        {sizes.length === 0 && (
                          <tr><td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No sizes active. Add a size matrix above.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 5 — Color profiling & media pipeline */}
                <div className="create-product__field" style={{ marginTop: '20px' }}>
                  <label className="create-product__label" style={{ color: '#aaa', marginBottom: '5px' }}>Color Profiling & Media Pipeline</label>
                  <p className="create-product__dropzone-hint" style={{marginBottom: "20px", color: '#666', fontSize: '12px'}}>Define robust color spectra and directly upload associated gallery variants.</p>
                  
                  <div className="create-product__color-item" style={{display: 'flex', flexDirection: 'column', gap: '15px', background: '#181818', padding: '20px', borderRadius: '10px', border: '1px solid #2a2a2a'}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #555' }}>
                        <input type="color" value={color.hex} onChange={(e) => handleColorChange(e.target.value)} style={{ position: 'absolute', top: -10, left: -10, width: '60px', height: '60px', cursor: 'pointer' }} />
                      </div>
                      
                      <input type="text" value={color.hex} onChange={(e) => handleColorChange(e.target.value)} className="create-product__input create-product__input--sm" placeholder="#000000" style={{width: '90px', background: '#000', border: '1px solid #333'}} />
                      
                      <input type="text" value={color.name} disabled className="create-product__input create-product__input--sm" style={{flex: 1, backgroundColor: '#0a0a0a', border: '1px solid #222', color: '#e8c88a'}} />
                    </div>

                    <div style={{ background: '#000', border: '1px dashed #444', borderRadius: '8px', padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginBottom: '15px' }}>
                         <span style={{ fontSize: '13px', color: '#999' }}>Media Files ({variantImages.length})</span>
                         <label className="create-product__btn create-product__btn--ghost" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}>
                           <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_photo_alternate</span>
                           Upload Color Shots
                           <input type="file" multiple onChange={handleVariantImagesUpload} style={{ display: 'none' }} accept="image/*" />
                         </label>
                      </div>

                      {variantPreviews && variantPreviews.length > 0 ? (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {variantPreviews.map((previewStr, pIdx) => (
                            <div key={pIdx} style={{ position: 'relative', width: '70px', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #333' }}>
                              <img src={previewStr} alt="variant thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => removeVariantImage(pIdx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: '1px solid #fff', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifycontent: 'center', cursor: 'pointer', fontSize: '14px', zIndex: 10 }}>×</button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#555', fontSize: '12px', margin: 0, textAlign: 'center' }}>No variant images uploaded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 6 — Visibility */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">05</span>
                Marketing Telemetry
              </h2>
              <div className="create-product__fields">
                 <div className="create-product__field">
                    <label className="create-product__label">Promotional Badge</label>
                    <select name="badge" value={formData.badge} onChange={handleInputChange} className="create-product__select" style={{ background: '#1c1c1c' }}>
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
            <div className="create-product__upload-card" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">Cover Architecture</h2>
              <p className="create-product__dropzone-hint mb-3" style={{ color: '#666' }}>This acts as the primary conduit for the user experience.</p>
              
              <label className="create-product__dropzone" style={{cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: coverPreview ? '0' : '40px', minHeight: '200px'}}>
                {coverPreview ? (
                  <img src={coverPreview} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} alt="Cover Preview" />
                ) : (
                  <>
                    <span className="material-symbols-outlined create-product__dropzone-icon" style={{ color: '#e8c88a' }}>cloud_upload</span>
                    <p className="create-product__dropzone-title" style={{ color: '#ccc' }}>Click to Establish Cover Image</p>
                  </>
                )}
                <input type="file" required onChange={handleCoverUpload} style={{display: 'none'}} accept="image/*" />
                
                {coverPreview && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px', fontSize: '13px', textAlign: 'center' }}>
                    Replace Cover Image
                  </div>
                )}
              </label>
            </div>

            <div className="create-product__preview-card" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">Marketplace Simulation</h2>
              <div className="create-product__preview-product" style={{ background: '#000', border: '1px solid #333' }}>
                <div className="create-product__preview-img" style={{ background: '#111', border: '1px solid #222', overflow: 'hidden' }}>
                   {coverPreview ? (
                      <img src={coverPreview} alt="mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                      <span className="material-symbols-outlined">checkroom</span>
                   )}
                </div>
                <div className="create-product__preview-body">
                  <span className="create-product__preview-brand" style={{ color: '#aaa' }}>{formData.brand || 'SNITCH'}</span>
                  <span className="create-product__preview-name" style={{ color: '#fff' }}>{formData.title || 'Product Title'}</span>
                  <div className="create-product__preview-price-row">
                    <span className="create-product__preview-price" style={{ color: '#e8c88a' }}>₹{formData.price || '999'}</span>
                    <span className="create-product__preview-original">₹{formData.originalPrice || '1299'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="create-product__action-bar" style={{ borderTop: '1px solid #333' }}>
          <button type="submit" disabled={isSubmitting} className="create-product__btn create-product__btn--primary" style={{ background: isSubmitting ? '#444' : '#e8c88a', color: isSubmitting ? '#aaa' : '#000', fontSize: '15px' }}>
            {isSubmitting ? uploadStatus || "Processing..." : "Instantiate Product Variant"}
            {!isSubmitting && <span className="material-symbols-outlined">rocket_launch</span>}
            {isSubmitting && <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite" }}>sync</span>}
          </button>
        </div>
      </form>
    </SellerDashboard>
  );
};

export default CreateProduct;
