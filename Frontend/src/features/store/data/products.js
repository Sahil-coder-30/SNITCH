// ── SNITCH Public Store — UI Constants ───────────────────

export const CATEGORIES = [
  { id: 'all',        label: 'All' },
  { id: 'tshirts',    label: 'T-Shirts' },
  { id: 'shirts',     label: 'Shirts' },
  { id: 'jeans',      label: 'Jeans' },
  { id: 'trousers',   label: 'Trousers' },
  { id: 'jackets',    label: 'Jackets' },
  { id: 'coats',      label: 'Coats' },
  { id: 'dresses',    label: 'Dresses' },
  { id: 'skirts',     label: 'Skirts' },
  { id: 'shoes',      label: 'Shoes' },
  { id: 'accessories',label: 'Accessories' },
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
    image: '/assets/nano_banner_hoodie.png',
    title: 'NANO BANANA PRO: HOODIES',
    subtitle: 'Experience ultimate comfort with our oversized fleece-lined dark hoodies.',
    accent: '#FFE066',
    gradient: 'linear-gradient(135deg, #060606 0%, #121212 50%, #202020 100%)'
  },
  { 
    id: 2, 
    image: '/assets/nano_banner_sweatshirt.png',
    title: 'ESSENTIAL SWEATSHIRTS',
    subtitle: 'Minimalist pastel sweatshirts detailed with high-density embroidered signature logo.',
    accent: '#FFE066',
    gradient: 'linear-gradient(135deg, #1A1A1D 0%, #2A2A2E 50%, #3A3A40 100%)'
  },
  { 
    id: 3, 
    image: '/assets/nano_banner_cap.png',
    title: 'WASHED DAD CAPS',
    subtitle: 'Classic 6-panel canvas hats in distressed black, featuring our signature neon icon.',
    accent: '#FFE066',
    gradient: 'linear-gradient(135deg, #0A0A0A 0%, #171717 50%, #252525 100%)'
  },
  { 
    id: 4, 
    image: '/assets/nano_banner_tees.png',
    title: 'GRAPHIC STREET TEES',
    subtitle: 'Heavyweight organic cotton streetwear t-shirts with striking neon graphic chest prints.',
    accent: '#FFE066',
    gradient: 'linear-gradient(135deg, #0E0E10 0%, #1C1C20 50%, #2D2D34 100%)'
  },
  { 
    id: 5, 
    image: '/assets/nano_banner_flatlay.png',
    title: 'THE COMPLETE UTILITY KIT',
    subtitle: 'Complete your style with our coordinated streetwear sets, beanies, caps, and straps.',
    accent: '#FFE066',
    gradient: 'linear-gradient(135deg, #0F0F10 0%, #1E1E22 50%, #2E2E36 100%)'
  },
  { 
    id: 6, 
    image: '/assets/nano_banner_studio.png',
    title: 'NEW STREETWEAR ARRIVALS',
    subtitle: 'Explore our limited edition drop featuring premium utility outerwear and track pants.',
    accent: '#FFE066',
    gradient: 'linear-gradient(135deg, #050505 0%, #141416 50%, #222226 100%)'
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
