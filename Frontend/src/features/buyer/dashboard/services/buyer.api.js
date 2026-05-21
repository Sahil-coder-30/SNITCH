import axios from 'axios';

/**
 * Service for buyer-related API interactions.
 */
const buyerApi = {
  /**
   * Fetches the list of orders for the authenticated buyer.
   */
  getOrders: async () => {
    // In a real application, this would be an API call
    // const response = await axios.get('/api/buyer/orders');
    // return response.data;
    
    // For now, returning dummy data to maintain functionality
    return [
      {
        id: 'ORD-20940', date: '12 Apr 2025', product: 'Oversized Hoodie - Black',
        size: 'L', price: '₹899', qty: 1, status: 'shipped',    expected: '16 Apr 2025',
      },
      {
        id: 'ORD-20921', date: '05 Apr 2025', product: 'Floral Wrap Dress',
        size: 'S', price: '₹1,199', qty: 1, status: 'delivered', expected: '09 Apr 2025',
      },
      {
        id: 'ORD-20898', date: '28 Mar 2025', product: 'Cargo Shorts - Olive',
        size: 'M', price: '₹699', qty: 2, status: 'processing', expected: '03 Apr 2025',
      },
      {
        id: 'ORD-20871', date: '20 Mar 2025', product: 'Linen Button-Up Shirt',
        size: 'XL', price: '₹849', qty: 1, status: 'cancelled', expected: '—',
      },
    ];
  },

  /**
   * Fetches tracking information for a specific order.
   */
  getOrderTracking: async (orderId) => {
    return [
      { label: 'Order Placed',  icon: 'shopping_bag',   done: true,  date: '12 Apr 10:22 AM' },
      { label: 'Confirmed',     icon: 'check_circle',   done: true,  date: '12 Apr 11:00 AM' },
      { label: 'Packed',        icon: 'inventory_2',    done: true,  date: '12 Apr 2:00 PM' },
      { label: 'Shipped',       icon: 'local_shipping', done: true,  date: '13 Apr 9:00 AM' },
      { label: 'Delivered',     icon: 'home',           done: false, date: 'Expected 16 Apr' },
    ];
  },

  /**
   * Fetches products based on filters.
   */
  getProducts: async (filters) => {
    // This would typically call /api/products with query params
    // const response = await axios.get('/api/products', { params: filters });
    // return response.data;
    return [
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
      },
      {
        id: 'p3',
        name: 'Relaxed Fit Cargo Joggers',
        brand: 'SNITCH',
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        category: 'joggers',
        rating: 4.3,
        reviewCount: 89,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
        badge: null,
        badgeType: null,
        inStock: true,
        colors: ['#4B5320', '#353839'],
        colorNames: ['Olive Green', 'Onyx Black'],
        deliveryDays: 4
      }
    ];
  },

  /**
   * Fetches the buyer's profile information.
   */
  getProfile: async () => {
    // const response = await axios.get('/api/buyer/profile');
    // return response.data;
    return {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      dob: '1998-07-15',
      gender: 'Female',
      memberSince: 'March 2023',
      stats: {
        orders: 14,
        wishlist: 12,
        reviews: 6
      },
      addresses: [
        { type: 'Home', line1: '42, Green Park Extension', line2: 'New Delhi – 110016, Delhi', phone: '+91 98765 43210' },
        { type: 'Work', line1: '14th Floor, Cyber Hub Tower B', line2: 'Gurugram – 122002, Haryana', phone: '+91 91234 56789' },
        { type: 'Other', line1: 'H-5, Lajpat Nagar III', line2: 'New Delhi – 110024, Delhi', phone: '+91 98765 43210' },
      ],
      paymentMethods: [
        { type: 'card', label: 'Visa', last4: '4242', icon: '💳' },
        { type: 'upi',  label: 'UPI',  id: 'priya@upi', icon: '₹' },
      ]
    };
  },

  /**
   * Updates the buyer's profile information.
   */
  updateProfile: async (data) => {
    // const response = await axios.patch('/api/buyer/profile', data);
    // return response.data;
    return { success: true, message: 'Profile updated successfully' };
  },

  /**
   * Fetches the buyer's wishlist.
   */
  getWishlist: async () => {
    // const response = await axios.get('/api/buyer/wishlist');
    // return response.data;
    return [
      { name: 'Oversized Graphic Tee',  category: "Men's",   subCategory: 'Tops',      price: 599,  originalPrice: 899,  stock: 22, rating: 4.6, reviewCount: 134, status: 'active', badge: 'SALE', isWishlisted: true, lowStock: false },
      { name: 'Floral Wrap Dress',      category: "Women's", subCategory: 'Dress',     price: 1199, originalPrice: 1599, stock: 2,  rating: 4.4, reviewCount: 78,  status: 'active', badge: 'NEW',  isWishlisted: true, lowStock: true  },
      { name: 'Linen Button-Up Shirt',  category: "Men's",   subCategory: 'Tops',      price: 849,  originalPrice: 1099, stock: 14, rating: 4.7, reviewCount: 203, status: 'active', badge: 'SALE', isWishlisted: true, lowStock: false },
      { name: 'Satin Mini Skirt',       category: "Women's", subCategory: 'Bottoms',   price: 999,  originalPrice: null, stock: 1,  rating: 4.3, reviewCount: 45,  status: 'active', badge: null,   isWishlisted: true, lowStock: true  },
      { name: 'Tie-Dye Hoodie',         category: 'Unisex',  subCategory: 'Tops',      price: 1099, originalPrice: 1399, stock: 7,  rating: 4.5, reviewCount: 91,  status: 'active', badge: 'SALE', isWishlisted: true, lowStock: false },
      { name: 'Pleated Midi Skirt',     category: "Women's", subCategory: 'Bottoms',   price: 1299, originalPrice: null, stock: 11, rating: 4.2, reviewCount: 38,  status: 'active', badge: 'NEW',  isWishlisted: true, lowStock: false },
      { name: 'Slim Fit Chinos',        category: "Men's",   subCategory: 'Bottoms',   price: 899,  originalPrice: 1199, stock: 28, rating: 4.0, reviewCount: 67,  status: 'active', badge: null,   isWishlisted: true, lowStock: false },
      { name: 'Ruched Bodycon Dress',   category: "Women's", subCategory: 'Dress',     price: 1499, originalPrice: 1999, stock: 5,  rating: 4.8, reviewCount: 156, status: 'active', badge: 'SALE', isWishlisted: true, lowStock: false },
      { name: 'Denim Shorts',           category: 'Unisex',  subCategory: 'Bottoms',   price: 749,  originalPrice: null, stock: 33, rating: 4.1, reviewCount: 29,  status: 'active', badge: 'NEW',  isWishlisted: true, lowStock: false },
      { name: 'Longline Puffer Jacket', category: "Women's", subCategory: 'Outerwear', price: 2499, originalPrice: 3299, stock: 3,  rating: 4.9, reviewCount: 84,  status: 'active', badge: 'SALE', isWishlisted: true, lowStock: true  },
      { name: 'Polo Collar Tee',        category: "Men's",   subCategory: 'Tops',      price: 549,  originalPrice: null, stock: 47, rating: 4.3, reviewCount: 112, status: 'active', badge: null,   isWishlisted: true, lowStock: false },
      { name: 'Velvet Blazer',          category: "Women's", subCategory: 'Outerwear', price: 2199, originalPrice: 2799, stock: 6,  rating: 4.7, reviewCount: 58,  status: 'active', badge: 'SALE', isWishlisted: true, lowStock: false },
    ];
  },

  /**
   * Removes an item from the wishlist.
   */
  removeFromWishlist: async (productId) => {
    // await axios.delete(`/api/buyer/wishlist/${productId}`);
    return { success: true };
  }
};

export default buyerApi;
