// ── SNITCH Public Store — UI Constants ───────────────────

export const CATEGORIES = [
  { id: 'all',        label: 'All',           icon: 'grid_view' },
  { id: 'tshirts',    label: 'T-Shirts',      icon: 'checkroom' },
  { id: 'hoodies',    label: 'Hoodies',       icon: 'dry_cleaning' },
  { id: 'joggers',    label: 'Joggers',       icon: 'sports' },
  { id: 'jackets',    label: 'Jackets',       icon: 'outdoor_grill' },
  { id: 'accessories',label: 'Accessories',   icon: 'watch' },
];

export const SORT_OPTIONS = [
  { value: 'featured',    label: 'Featured' },
  { value: 'price-asc',   label: 'Price: Low to High' },
  { value: 'price-desc',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Avg. Customer Review' },
  { value: 'newest',      label: 'Newest Arrivals' },
];

export const BANNERS = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    title: 'The Winter Collection',
    subtitle: 'Stay warm without sacrificing style. Premium outerwear for the modern wardrobe.',
    accent: '#ffffff',
    gradient: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))'
  }
];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Oversized Black Hoodie',
    brand: 'SNITCH',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    category: 'hoodies',
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    badge: 'Best Seller',
    badgeType: 'sale',
    inStock: true,
    colors: ['#000000', '#5C4033'],
    colorNames: ['Jet Black', 'Walnut Brown'],
    deliveryDays: 2
  },
  {
    id: 'p2',
    name: 'Classic White T-Shirt',
    brand: 'SNITCH',
    price: 499,
    originalPrice: 799,
    discount: 37,
    category: 'tshirts',
    rating: 4.8,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    badge: 'New Arrival',
    badgeType: 'new',
    inStock: true,
    colors: ['#FFFFFF', '#C2B280'],
    colorNames: ['White', 'Sand Gold'],
    deliveryDays: 3
  }
];
