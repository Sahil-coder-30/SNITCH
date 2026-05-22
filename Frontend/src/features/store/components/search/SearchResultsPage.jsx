import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BuyerDashboard from '../../../buyer/dashboard/components/BuyerDashboard';
import ProductCard from '../shared/ProductCard';
import { ProductCardSkeleton, SkeletonGrid } from '../../../../components/loaders/ComponentSkeletons';
import '../../style/SearchResultsPage.scss';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  // API State
  const [products, setProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    categories: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 10000 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected Filters State
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('relevance');

  // UI State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeDropdown = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveDropdown(null);
      setIsClosing(false);
    }, 250);
  };

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      closeDropdown();
    } else {
      setActiveDropdown(name);
      setIsClosing(false);
    }
  };
  
  // Track previous query to reset filters only when 'q' changes
  const prevQ = useRef(q);

  useEffect(() => {
    if (q !== prevQ.current) {
      prevQ.current = q;
      setSelectedBrands([]);
      setSelectedCategories([]);
      setSelectedSizes([]);
      setSelectedColors([]);
      setMinPrice('');
      setMaxPrice('');
      setInStock(false);
      setMinRating('');
      setSort('relevance');
    }
  }, [q]);

  // Fetch results from search API
  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        q,
        sort,
        inStock: inStock ? 'true' : undefined
      };

      if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
      if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
      if (selectedSizes.length > 0) params.sizes = selectedSizes.join(',');
      if (selectedColors.length > 0) params.colors = selectedColors.join(',');

      // Swap query inputs if min > max to prevent invalid requests
      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        params.minPrice = maxPrice;
        params.maxPrice = minPrice;
      } else {
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
      }

      if (minRating) params.minRating = minRating;

      const res = await axios.get(`${API_BASE_URL}/products/search`, { params });

      setProducts(res.data.products || []);
      setSimilarProducts(res.data.similarProducts || []);
      
      // Update facet filters options dynamically
      if (res.data.availableFilters) {
        setAvailableFilters(res.data.availableFilters);
      }
    } catch (err) {
      console.error('Search API error:', err);
      setError(err.response?.data?.message || 'Failed to fetch search results.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced API call for filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [q, selectedBrands, selectedCategories, selectedSizes, selectedColors, minPrice, maxPrice, inStock, minRating, sort]);

  // Lock body scroll when a dropdown is open on mobile to prevent background scrolling
  useEffect(() => {
    const handleResize = () => {
      if (activeDropdown && window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [activeDropdown]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!activeDropdown) return;

    const handleGlobalClick = (event) => {
      // If click is on a dropdown button or inside a dropdown card, do nothing
      if (event.target.closest('.search-filters__dropdown-wrap') || 
          event.target.closest('.search-filters__clear-all')) {
        return;
      }
      closeDropdown();
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [activeDropdown]);


  const handleProductSelect = (product) => {
    navigate(`/product?id=${product.id}`);
  };

  // Toggle handlers for array filters
  const toggleFilter = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setMinRating('');
    setSort('relevance');
  };

  const handleMinPriceChange = (val) => {
    if (val === '') {
      setMinPrice('');
      return;
    }
    const numVal = Number(val);
    if (numVal > availableFilters.priceRange.max) {
      setMinPrice(availableFilters.priceRange.max.toString());
    } else {
      setMinPrice(val);
    }
  };

  const handlePriceBlur = () => {
    if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)) {
      const temp = minPrice;
      setMinPrice(maxPrice);
      setMaxPrice(temp);
    }
  };

  // Build list of active filter chips for display
  const getActiveChips = () => {
    const chips = [];
    selectedCategories.forEach(c => chips.push({ id: `cat-${c}`, type: 'category', value: c, label: `Category: ${c}` }));
    selectedBrands.forEach(b => chips.push({ id: `brand-${b}`, type: 'brand', value: b, label: `Brand: ${b}` }));
    selectedSizes.forEach(s => chips.push({ id: `size-${s}`, type: 'size', value: s, label: `Size: ${s}` }));
    selectedColors.forEach(c => chips.push({ id: `color-${c}`, type: 'color', value: c, label: `Color: ${c}` }));
    if (minPrice || maxPrice) {
      chips.push({
        id: 'price',
        type: 'price',
        label: `Price: ₹${minPrice || '0'} - ₹${maxPrice || availableFilters.priceRange.max}`
      });
    }
    if (inStock) {
      chips.push({ id: 'stock', type: 'stock', label: 'In Stock Only' });
    }
    if (minRating) {
      chips.push({ id: 'rating', type: 'rating', value: minRating, label: `${minRating}★ & above` });
    }
    return chips;
  };

  const removeChip = (chip) => {
    if (chip.type === 'category') toggleFilter(chip.value, selectedCategories, setSelectedCategories);
    if (chip.type === 'brand') toggleFilter(chip.value, selectedBrands, setSelectedBrands);
    if (chip.type === 'size') toggleFilter(chip.value, selectedSizes, setSelectedSizes);
    if (chip.type === 'color') toggleFilter(chip.value, selectedColors, setSelectedColors);
    if (chip.type === 'price') {
      setMinPrice('');
      setMaxPrice('');
    }
    if (chip.type === 'stock') setInStock(false);
    if (chip.type === 'rating') setMinRating('');
  };

  const activeChips = getActiveChips();

  // Helper to render responsive dropdown card / bottom sheet
  const renderDropdownCard = (name, title, clearHandler, hasActiveFilters, children) => {
    if (activeDropdown !== name) return null;

    return (
      <>
        <div 
          className={`search-filters__backdrop ${isClosing ? 'is-closing' : ''}`} 
          onClick={closeDropdown} 
        />
        <div className={`search-filters__dropdown-card search-filters__dropdown-card--${name} ${isClosing ? 'is-closing' : ''}`}>
          <div className="search-filters__mobile-header">
            <h2>{title}</h2>
            <div className="search-filters__mobile-header-actions">
              {hasActiveFilters && (
                <button className="clear-btn" onClick={clearHandler}>
                  Clear
                </button>
              )}
              <button className="close-btn" onClick={closeDropdown} aria-label="Close filter">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          
          <div className="search-filters__dropdown-content">
            {children}
          </div>

          <div className="search-filters__mobile-footer">
            <button className="apply-btn" onClick={closeDropdown}>
              Apply Filters
            </button>
          </div>
        </div>
      </>
    );
  };

  // Calculate slider background progress
  const minSliderVal = availableFilters.priceRange.min;
  const maxLimit = availableFilters.priceRange.max;
  const currentVal = maxPrice !== '' ? Number(maxPrice) : maxLimit;
  const pct = maxLimit > minSliderVal ? ((currentVal - minSliderVal) / (maxLimit - minSliderVal)) * 100 : 100;
  const sliderStyle = {
    background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-border-strong) ${pct}%, var(--color-border-strong) 100%)`
  };

  return (
    <BuyerDashboard>
      <div className="search-results-page">
        {/* Horizontal Action Bar */}
        <div className="search-filters-horizontal">
          <div className="search-filters-horizontal__list">
            
            {/* Sort Button Wrapper */}
            <div className="search-filters__dropdown-wrap">
              <button 
                type="button"
                className={`search-filters__btn ${activeDropdown === 'sort' ? 'active' : ''} ${sort !== 'relevance' ? 'has-active' : ''}`}
                onClick={() => toggleDropdown('sort')}
              >
                <span>
                  {sort === 'relevance' ? 'Sort' : `Sort: ${
                    sort === 'price-asc' ? 'Price Low-High' :
                    sort === 'price-desc' ? 'Price High-Low' :
                    sort === 'rating' ? 'Rating' :
                    sort === 'newest' ? 'New Arrivals' : 'Relevance'
                  }`}
                </span>
                <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
              </button>
              {renderDropdownCard('sort', 'Sort By', () => setSort('relevance'), sort !== 'relevance', (
                <div className="search-filters__options-list">
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Average Rating' },
                    { value: 'newest', label: 'New Arrivals' }
                  ].map((opt) => (
                    <label key={opt.value} className="search-filters__radio-label">
                      <input
                        type="radio"
                        name="sort-option"
                        checked={sort === opt.value}
                        onChange={() => {
                          setSort(opt.value);
                          if (window.innerWidth > 768) {
                            closeDropdown();
                          }
                        }}
                      />
                      <span className="search-filters__radio-text">{opt.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Availability Button Wrapper */}
            <div className="search-filters__dropdown-wrap">
              <button 
                type="button"
                className={`search-filters__btn ${activeDropdown === 'availability' ? 'active' : ''} ${inStock ? 'has-active' : ''}`}
                onClick={() => toggleDropdown('availability')}
              >
                <span>{inStock ? 'Availability: In Stock' : 'Availability'}</span>
                <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
              </button>
              {renderDropdownCard('availability', 'Availability', () => setInStock(false), inStock, (
                <div className="search-filters__dropdown-inner-padding">
                  <label className="search-filters__checkbox-label">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                    />
                    <span className="search-filters__checkbox-text">In Stock Only</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Price Button Wrapper */}
            <div className="search-filters__dropdown-wrap">
              <button 
                type="button"
                className={`search-filters__btn ${activeDropdown === 'price' ? 'active' : ''} ${(minPrice || maxPrice) ? 'has-active' : ''}`}
                onClick={() => toggleDropdown('price')}
              >
                <span>
                  {(minPrice || maxPrice) 
                    ? `Price: ₹${minPrice || '0'} - ₹${maxPrice || availableFilters.priceRange.max}`
                    : 'Price'
                  }
                </span>
                <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
              </button>
              {renderDropdownCard('price', 'Price Range', () => { setMinPrice(''); setMaxPrice(''); }, minPrice || maxPrice, (
                <div className="search-filters__price-dropdown-content">
                  <div className="search-filters__price-inputs">
                    <div className="search-filters__price-field">
                      <span className="price-symbol">₹</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        onBlur={handlePriceBlur}
                        min={availableFilters.priceRange.min}
                        max={maxPrice || availableFilters.priceRange.max}
                      />
                    </div>
                    <span className="price-separator">to</span>
                    <div className="search-filters__price-field">
                      <span className="price-symbol">₹</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={handlePriceBlur}
                        min={minPrice || availableFilters.priceRange.min}
                        max={availableFilters.priceRange.max}
                      />
                    </div>
                  </div>
                  <div className="search-filters__slider-wrap">
                    <input
                      type="range"
                      min={availableFilters.priceRange.min}
                      max={availableFilters.priceRange.max}
                      value={maxPrice || availableFilters.priceRange.max}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="search-filters__slider"
                      style={sliderStyle}
                    />
                    <div className="search-filters__slider-labels">
                      <span>₹{availableFilters.priceRange.min}</span>
                      <span>₹{availableFilters.priceRange.max}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Button Wrapper */}
            {availableFilters.categories.length > 0 && (
              <div className="search-filters__dropdown-wrap">
                <button 
                  type="button"
                  className={`search-filters__btn ${activeDropdown === 'categories' ? 'active' : ''} ${selectedCategories.length > 0 ? 'has-active' : ''}`}
                  onClick={() => toggleDropdown('categories')}
                >
                  <span>
                    {selectedCategories.length === 0 ? 'Categories' :
                     selectedCategories.length === 1 ? `Category: ${selectedCategories[0]}` :
                     `Categories (${selectedCategories.length})`
                    }
                  </span>
                  <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
                </button>
                {renderDropdownCard('categories', 'Categories', () => setSelectedCategories([]), selectedCategories.length > 0, (
                  <div className="search-filters__options-list">
                    {availableFilters.categories.map((c) => (
                      <label key={c.name} className="search-filters__checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c.name)}
                          onChange={() => toggleFilter(c.name, selectedCategories, setSelectedCategories)}
                        />
                        <span className="search-filters__checkbox-text">
                          {c.name} <span className="filter-count">({c.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Brands Button Wrapper */}
            {availableFilters.brands.length > 0 && (
              <div className="search-filters__dropdown-wrap">
                <button 
                  type="button"
                  className={`search-filters__btn ${activeDropdown === 'brands' ? 'active' : ''} ${selectedBrands.length > 0 ? 'has-active' : ''}`}
                  onClick={() => toggleDropdown('brands')}
                >
                  <span>
                    {selectedBrands.length === 0 ? 'Brands' :
                     selectedBrands.length === 1 ? `Brand: ${selectedBrands[0]}` :
                     `Brands (${selectedBrands.length})`
                    }
                  </span>
                  <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
                </button>
                {renderDropdownCard('brands', 'Brands', () => setSelectedBrands([]), selectedBrands.length > 0, (
                  <div className="search-filters__options-list">
                    {availableFilters.brands.map((b) => (
                      <label key={b.name} className="search-filters__checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b.name)}
                          onChange={() => toggleFilter(b.name, selectedBrands, setSelectedBrands)}
                        />
                        <span className="search-filters__checkbox-text">
                          {b.name} <span className="filter-count">({b.count})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Sizes Button Wrapper */}
            {availableFilters.sizes.length > 0 && (
              <div className="search-filters__dropdown-wrap">
                <button 
                  type="button"
                  className={`search-filters__btn ${activeDropdown === 'sizes' ? 'active' : ''} ${selectedSizes.length > 0 ? 'has-active' : ''}`}
                  onClick={() => toggleDropdown('sizes')}
                >
                  <span>
                    {selectedSizes.length === 0 ? 'Sizes' :
                     selectedSizes.length === 1 ? `Size: ${selectedSizes[0]}` :
                     `Sizes (${selectedSizes.length})`
                    }
                  </span>
                  <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
                </button>
                {renderDropdownCard('sizes', 'Sizes', () => setSelectedSizes([]), selectedSizes.length > 0, (
                  <div className="search-filters__size-grid">
                    {availableFilters.sizes.map((s) => {
                      const isSelected = selectedSizes.includes(s.name);
                      return (
                        <button
                          key={s.name}
                          type="button"
                          className={`search-filters__size-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => toggleFilter(s.name, selectedSizes, setSelectedSizes)}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Colors Button Wrapper */}
            {availableFilters.colors.length > 0 && (
              <div className="search-filters__dropdown-wrap">
                <button 
                  type="button"
                  className={`search-filters__btn ${activeDropdown === 'colors' ? 'active' : ''} ${selectedColors.length > 0 ? 'has-active' : ''}`}
                  onClick={() => toggleDropdown('colors')}
                >
                  <span>
                    {selectedColors.length === 0 ? 'Colors' :
                     selectedColors.length === 1 ? `Color: ${selectedColors[0]}` :
                     `Colors (${selectedColors.length})`
                    }
                  </span>
                  <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
                </button>
                {renderDropdownCard('colors', 'Colors', () => setSelectedColors([]), selectedColors.length > 0, (
                  <div className="search-filters__color-row">
                    {availableFilters.colors.map((c) => {
                      const isSelected = selectedColors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          type="button"
                          className={`search-filters__color-dot ${isSelected ? 'active' : ''}`}
                          style={{ backgroundColor: c.hex }}
                          onClick={() => toggleFilter(c.name, selectedColors, setSelectedColors)}
                          title={`${c.name} (${c.count})`}
                        >
                          {isSelected && <span className="material-symbols-outlined check-icon">check</span>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Ratings Button Wrapper */}
            <div className="search-filters__dropdown-wrap">
              <button 
                type="button"
                className={`search-filters__btn ${activeDropdown === 'ratings' ? 'active' : ''} ${minRating ? 'has-active' : ''}`}
                onClick={() => toggleDropdown('ratings')}
              >
                <span>{minRating ? `Rating: ${minRating}★+` : 'Ratings'}</span>
                <span className="material-symbols-outlined dropdown-arrow">expand_more</span>
              </button>
              {renderDropdownCard('ratings', 'Customer Ratings', () => setMinRating(''), minRating !== '', (
                <div className="search-filters__options-list">
                  {[4, 3, 2, 1].map((stars) => (
                    <label key={stars} className="search-filters__radio-label">
                      <input
                        type="radio"
                        name="rating"
                        checked={Number(minRating) === stars}
                        onChange={() => setMinRating(stars.toString())}
                      />
                      <span className="search-filters__radio-text">
                        {stars}★ & above
                      </span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Clear All Button */}
            {activeChips.length > 0 && (
              <button 
                type="button" 
                className="search-filters__clear-all"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}

          </div>
        </div>

        <div className="search-layout">
          {/* Right Results Pane */}
          <main className="search-results-main">
            <header className="search-results-header">
              <div className="search-results-header__info">
                <h1>
                  {q ? `Search results for "${q}"` : 'All Products Catalog'}
                </h1>
                {!loading && (
                  <span className="results-count">
                    {products.length} {products.length === 1 ? 'item' : 'items'} found
                  </span>
                )}
              </div>
            </header>

            {/* Active Filters Bar */}
            {activeChips.length > 0 && (
              <div className="active-filters-bar">
                <div className="chips-list">
                  {activeChips.map((chip) => (
                    <span key={chip.id} className="filter-chip">
                      {chip.label}
                      <button
                        type="button"
                        onClick={() => removeChip(chip)}
                        aria-label={`Remove filter ${chip.label}`}
                      >
                        <span className="material-symbols-outlined close-icon">close</span>
                      </button>
                    </span>
                  ))}
                  <button className="clear-all-chip" onClick={handleClearAll}>
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="search-error-banner">
                <span className="material-symbols-outlined">error</span>
                <p>{error}</p>
                <button onClick={fetchResults} className="retry-btn">Retry</button>
              </div>
            )}

            {/* Main Products Grid */}
            {loading ? (
              <SkeletonGrid count={8}>
                <ProductCardSkeleton />
              </SkeletonGrid>
            ) : products.length > 0 ? (
              <div className="sf-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onSelect={handleProductSelect} />
                ))}
              </div>
            ) : (
              /* No Products Matching Query Empty State */
              <div className="no-results-panel">
                <div className="no-results-panel__content">
                  <span className="material-symbols-outlined no-results-icon">search_off</span>
                  <h2>No results match your search & filters</h2>
                  <p>We couldn't find matches for what you searched. Try modifying your keywords or adjusting filters.</p>
                  <button className="reset-filters-btn" onClick={handleClearAll}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Recommendations / Similar Products Section */}
            {!loading && products.length === 0 && similarProducts.length > 0 && (
              <section className="similar-products-section">
                <div className="similar-products-section__header">
                  <h2>Products you might like</h2>
                  <p className="similar-products-section__sub">Recommendations matching your category choice</p>
                </div>
                <div className="sf-grid">
                  {similarProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onSelect={handleProductSelect} />
                  ))}
                </div>
              </section>
            )}

            {/* Similar Products Carousel at Bottom even if there are products */}
            {!loading && products.length > 0 && similarProducts.length > 0 && (
              <section className="similar-products-section similar-products-section--bottom">
                <div className="similar-products-section__header">
                  <h2>People also viewed</h2>
                  <p className="similar-products-section__sub">Explore similar items from related collections</p>
                </div>
                <div className="sf-grid">
                  {similarProducts.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} onSelect={handleProductSelect} />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </BuyerDashboard>
  );
};

export default SearchResultsPage;
