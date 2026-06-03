import React, { useState, useEffect } from 'react';
import { getStyleCodes, createStyleCode } from '../services/product.api';
import '../style/StylePassbook.scss';

const StylePassbook = () => {
  const [styleCodes, setStyleCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState(null);
  
  // Generation state
  const [keyInput, setKeyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load style codes
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getStyleCodes();
      setStyleCodes(data);
      if (data.length > 0 && !selectedStyle) {
        setSelectedStyle(data[0]); // Select first by default
      } else if (selectedStyle) {
        // Refresh currently selected style data
        const updatedSelected = data.find(s => s.styleCode === selectedStyle.styleCode);
        if (updatedSelected) setSelectedStyle(updatedSelected);
      }
    } catch (err) {
      console.error("Failed to load style codes:", err);
      setError("Failed to fetch style codes passbook.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setError("Please specify a label/key first.");
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const response = await createStyleCode(keyInput.trim());
      setKeyInput('');
      await loadData();
      // Select the newly created code
      if (response.style) {
        setSelectedStyle(response.style);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate style code.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="style-passbook">
        
        {/* Passbook Title */}
        <div className="style-passbook__header">
          <h1 className="style-passbook__title">Style Code Passbook</h1>
          <p className="style-passbook__subtitle">Generate, catalog, and monitor products grouped under unique production style codes.</p>
        </div>

        {error && (
          <div className="style-passbook__error">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="style-passbook__grid">
          
          {/* COLUMN 1: GENERATE SECTION */}
          <div className="style-passbook__col style-passbook__col--generate">
            <div className="style-passbook__card">
              <h2 className="style-passbook__card-title">
                <span className="material-symbols-outlined">api</span>
                Generate Style Code
              </h2>
              <p className="style-passbook__card-description">Create a unique style code for a design series. Once generated, you can list multiple color variants under it.</p>
              
              <form onSubmit={handleGenerate} className="style-passbook__form">
                <div className="style-passbook__field">
                  <label className="style-passbook__label">Style Key / Series Name</label>
                  <input 
                    type="text" 
                    value={keyInput} 
                    onChange={e => setKeyInput(e.target.value)} 
                    placeholder="e.g. Classic Linen Shirt Series" 
                    className="style-passbook__input"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="style-passbook__btn style-passbook__btn--primary"
                >
                  {submitting ? 'Generating...' : 'Generate & Save Style Code'}
                  {!submitting && <span className="material-symbols-outlined">history_edu</span>}
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 2: PASSBOOK TABLE */}
          <div className="style-passbook__col style-passbook__col--list">
            <div className="style-passbook__card">
              <h2 className="style-passbook__card-title">
                <span className="material-symbols-outlined">menu_book</span>
                Passbook Registry
              </h2>
              
              {loading && styleCodes.length === 0 ? (
                <div className="style-passbook__loading">
                  <div className="style-passbook__spinner"></div>
                  <p>Fetching style codes...</p>
                </div>
              ) : styleCodes.length === 0 ? (
                <div className="style-passbook__empty">
                  <span className="material-symbols-outlined">search_off</span>
                  <p>No style codes registered yet. Use the generator on the left to create your first code!</p>
                </div>
              ) : (
                <div className="style-passbook__table-wrap">
                  <table className="style-passbook__table">
                    <thead>
                      <tr>
                        <th>Key / Series</th>
                        <th>Style Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {styleCodes.map(s => {
                        const isSelected = selectedStyle && selectedStyle.styleCode === s.styleCode;
                        return (
                          <tr 
                            key={s.id || s.styleCode} 
                            onClick={() => setSelectedStyle(s)}
                            className={isSelected ? 'is-selected' : ''}
                          >
                            <td>
                              <span className="style-passbook__table-key">{s.key}</span>
                              <span className="style-passbook__table-date">
                                {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </td>
                            <td>
                              <code className="style-passbook__table-code">{s.styleCode}</code>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: ASSOCIATED PRODUCTS */}
          <div className="style-passbook__col style-passbook__col--products">
            <div className="style-passbook__card">
              <h2 className="style-passbook__card-title">
                <span className="material-symbols-outlined">inventory_2</span>
                Associated Products
              </h2>
              
              {selectedStyle ? (
                <div className="style-passbook__associations">
                  <div className="style-passbook__selected-info">
                    <p className="style-passbook__selected-label">Selected Style: <strong>{selectedStyle.key}</strong></p>
                    <code className="style-passbook__selected-code">{selectedStyle.styleCode}</code>
                  </div>
                  
                  {selectedStyle.products && selectedStyle.products.length > 0 ? (
                    <div className="style-passbook__products-list">
                      {selectedStyle.products.map(p => (
                        <div key={p.id} className="style-passbook__product-item">
                          <div className="style-passbook__product-img">
                            {p.coverImage ? (
                              <img src={p.coverImage} alt={p.title} />
                            ) : (
                              <span className="material-symbols-outlined">checkroom</span>
                            )}
                          </div>
                          <div className="style-passbook__product-details">
                            <span className="style-passbook__product-brand">{p.brand}</span>
                            <span className="style-passbook__product-title">{p.title}</span>
                            <div className="style-passbook__product-meta">
                              <span className="style-passbook__product-price">₹{p.price}</span>
                              {p.color && (
                                <span className="style-passbook__product-color">
                                  <span className="color-dot" style={{ background: p.color.hex }}></span>
                                  {p.color.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="style-passbook__empty-associations">
                      <span className="material-symbols-outlined">explore</span>
                      <p>No products are registered under this style code yet.</p>
                      <a 
                        href={`/seller/products/new?styleCode=${selectedStyle.styleCode}`} 
                        className="style-passbook__btn style-passbook__btn--outline"
                      >
                        <span className="material-symbols-outlined">add</span>
                        List First Variant
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="style-passbook__empty">
                  <p>Select a style code from the registry to view associated catalog items.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default StylePassbook;
