import React, { useState } from 'react';
import SellerDashboard from './SellerDashboard';
import '../style/CreateProduct.scss';
import { getClosestColorName } from '../../../../utils/colors.js';
import { useCreateProduct } from '../Hooks/useCreateProduct';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CreateProduct = () => {
  const { submitProduct, isSubmitting, uploadStatus } = useCreateProduct();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryFor: 'Mens',
    categoryName: 'Tshirts',
    brand: '',
    originalPrice: '',
    price: '',
    discountPercent: '',
    badge: 'new-arrival',
  });

  const [sizes, setSizes] = useState([
    { size: 'M', quantity: 0, additionalPrice: 0 }
  ]);

  const [colors, setColors] = useState([
    { hex: '#1a1a1a', name: 'Jet Black', files: [], previews: [] }
  ]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addColor = () => {
    setColors(prev => [...prev, { hex: '#000000', name: 'Jet Black', files: [], previews: [] }]);
  };

  const updateColor = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    if (field === 'hex') {
      newColors[index].name = getClosestColorName(value);
    }
    setColors(newColors);
  };

  const handleColorImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    const newColors = [...colors];
    newColors[index].files = [...newColors[index].files, ...files];
    newColors[index].previews = [...(newColors[index].previews || []), ...newPreviews];
    
    setColors(newColors);
  };

  const removeColorImage = (colorIndex, fileIndex) => {
    const newColors = [...colors];
    newColors[colorIndex].files.splice(fileIndex, 1);
    newColors[colorIndex].previews.splice(fileIndex, 1);
    setColors(newColors);
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addSize = (sizeVal) => {
    if (!sizes.find(s => s.size === sizeVal)) {
      setSizes([...sizes, { size: sizeVal, quantity: 0, additionalPrice: 0 }]);
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

    if (!coverImage) {
      alert("Please configure a cover image.");
      return;
    }

    if (!sizes.some(s => s.quantity > 0)) {
      alert("Please add at least one Size with a quantity greater than 0");
      return;
    }

    const result = await submitProduct(formData, sizes, colors, coverImage);
    if (result.success) {
        alert('Product instantiated successfully!');
        // Reset form or navigate
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

            {/* SECTION 1 — Basic Info */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">01</span>
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

            {/* SECTION 2 — Pricing & Stock */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">02</span>
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
                    <label className="create-product__label" style={{ display: 'flex', justifyContent: 'space-between' }}>
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

            {/* SECTION 3 — Variants */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">03</span>
                Variants & Stock Topology
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
                            <td style={{ borderBottom: '1px solid #2a2a2a' }}><input type="number" value={s.quantity} onChange={(e) => updateSize(idx, 'quantity', e.target.value)} className="create-product__input" style={{ width: '100px', background: '#000', border: '1px solid #444' }} placeholder="Qty" /></td>
                          </tr>
                        ))}
                        {sizes.length === 0 && (
                          <tr><td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No sizes active. Add a size matrix above.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="create-product__field" style={{ marginTop: '20px' }}>
                  <label className="create-product__label" style={{ color: '#aaa', marginBottom: '5px' }}>Color Profiling & Media Pipeline</label>
                  <p className="create-product__dropzone-hint" style={{marginBottom: "20px", color: '#666', fontSize: '12px'}}>Define robust color spectra and directly upload associated gallery variants.</p>
                  
                  <div className="create-product__colors" style={{ display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {colors.map((c, idx) => (
                      <div key={idx} className="create-product__color-item" style={{display: 'flex', flexDirection: 'column', gap: '15px', background: '#181818', padding: '20px', borderRadius: '10px', border: '1px solid #2a2a2a'}}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #555' }}>
                            <input type="color" value={c.hex} onChange={(e) => updateColor(idx, 'hex', e.target.value)} style={{ position: 'absolute', top: -10, left: -10, width: '60px', height: '60px', cursor: 'pointer' }} />
                          </div>
                          
                          <input type="text" value={c.hex} onChange={(e) => updateColor(idx, 'hex', e.target.value)} className="create-product__input create-product__input--sm" placeholder="#000000" style={{width: '90px', background: '#000', border: '1px solid #333'}} />
                          
                          <input type="text" value={c.name} disabled className="create-product__input create-product__input--sm" style={{flex: 1, backgroundColor: '#0a0a0a', border: '1px solid #222', color: '#e8c88a'}} />
                          
                          {colors.length > 1 && (
                            <button type="button" onClick={() => removeColor(idx)} className="create-product__color-remove" style={{ background: '#220000', border: '1px solid #550000', color: '#ff4444' }}>
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          )}
                        </div>

                        <div style={{ background: '#000', border: '1px dashed #444', borderRadius: '8px', padding: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                             <span style={{ fontSize: '13px', color: '#999' }}>Media Files ({c.files.length})</span>
                             <label className="create-product__btn create-product__btn--ghost" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}>
                               <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_photo_alternate</span>
                               Upload Color Shots
                               <input type="file" multiple onChange={(e) => handleColorImageUpload(idx, e)} style={{ display: 'none' }} accept="image/*" />
                             </label>
                          </div>

                          {c.previews && c.previews.length > 0 ? (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {c.previews.map((previewStr, pIdx) => (
                                <div key={pIdx} style={{ position: 'relative', width: '70px', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #333' }}>
                                  <img src={previewStr} alt="variant thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <button type="button" onClick={() => removeColorImage(idx, pIdx)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: '1px solid #fff', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', zIndex: 10 }}>×</button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#555', fontSize: '12px', margin: 0, textAlign: 'center' }}>No variant images uploaded yet.</p>
                          )}
                        </div>

                      </div>
                    ))}
                    
                    <button type="button" onClick={addColor} className="create-product__add-color" style={{ alignSelf: 'flex-start', background: 'rgba(232, 200, 138, 0.1)', color: '#e8c88a', borderColor: '#e8c88a' }}>
                      <span className="material-symbols-outlined">add</span>
                      Append Color Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — Visibility */}
            <div className="create-product__section" style={{ background: '#111', border: '1px solid #222', borderRadius: '12px' }}>
              <h2 className="create-product__section-title">
                <span className="create-product__section-num">04</span>
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
            {isSubmitting ? uploadStatus || "Processing..." : "Instatiate Product Entity"}
            {!isSubmitting && <span className="material-symbols-outlined">rocket_launch</span>}
            {isSubmitting && <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite" }}>sync</span>}
          </button>
        </div>
      </form>
    </SellerDashboard>
  );
};

export default CreateProduct;
