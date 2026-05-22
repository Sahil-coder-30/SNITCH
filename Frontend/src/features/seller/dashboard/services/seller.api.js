import axios from 'axios';

/**
 * Service for seller-related API interactions.
 */
const sellerApi = {
  /**
   * Fetches the list of orders for the authenticated seller.
   */
  getOrders: async () => {
    // In a real application:
    // const response = await axios.get('/api/seller/orders');
    // return response.data;
    
    return [
      { id: 'ORD-10421', product: 'Oversized Hoodie - Black', thumb: '🧥', buyer: 'Riya Gupta',    sizeColor: 'L / Black',  qty: 1, amount: '₹899',   payment: 'Prepaid', status: 'delivered',  date: '10 Apr 2025' },
      { id: 'ORD-10418', product: 'Cargo Jogger Pants',       thumb: '👖', buyer: 'Kabir Sharma',  sizeColor: 'M / Olive',  qty: 2, amount: '₹1,498', payment: 'COD',     status: 'processing', date: '11 Apr 2025' },
      { id: 'ORD-10415', product: 'Floral Sundress',          thumb: '👗', buyer: 'Anika Patel',   sizeColor: 'S / Pink',   qty: 1, amount: '₹1,299', payment: 'Prepaid', status: 'shipped',    date: '12 Apr 2025' },
      { id: 'ORD-10410', product: 'Striped Polo Shirt',       thumb: '👕', buyer: 'Dev Malhotra',  sizeColor: 'XL / White', qty: 1, amount: '₹499',  payment: 'UPI',     status: 'cancelled',  date: '09 Apr 2025' },
      { id: 'ORD-10408', product: 'Denim Jacket',             thumb: '🧥', buyer: 'Meera Joshi',   sizeColor: 'M / Blue',   qty: 1, amount: '₹2,199', payment: 'Prepaid', status: 'delivered',  date: '08 Apr 2025' },
      { id: 'ORD-10402', product: 'Satin Slip Dress',         thumb: '👗', buyer: 'Pooja Verma',   sizeColor: 'S / Ivory',  qty: 1, amount: '₹1,599', payment: 'COD',     status: 'pending',    date: '07 Apr 2025' },
    ];
  },

  /**
   * Fetches the order timeline/tracking for a specific order.
   */
  getOrderTimeline: async (orderId) => {
    return [
      { label: 'Order Placed',  done: true,  date: '10 Apr 10:22 AM' },
      { label: 'Confirmed',     done: true,  date: '10 Apr 11:00 AM' },
      { label: 'Packed',        done: true,  date: '10 Apr 2:00 PM'  },
      { label: 'Shipped',       done: true,  date: '11 Apr 9:00 AM'  },
      { label: 'Delivered',     done: false, date: 'Expected 14 Apr' },
    ];
  },

  /**
   * Fetches the seller's overview data (stats, top products, recent orders).
   */
  getOverview: async () => {
    // const response = await axios.get('/api/seller/overview');
    // return response.data;
    return {
      recentOrders: [
        { id: '10421', customer: 'Riya Gupta', product: 'Oversized Hoodie', status: 'delivered', price: '899' },
        { id: '10418', customer: 'Kabir Sharma', product: 'Cargo Joggers', status: 'processing', price: '1,498' },
        { id: '10415', customer: 'Anika Patel', product: 'Floral Sundress', status: 'shipped', price: '1,299' },
      ],
      topProducts: [
        { name: 'Oversized Hoodie - Black', category: 'Tops', sold: 45, revenue: '40,455' },
        { name: 'Cargo Jogger Pants', category: 'Bottoms', sold: 32, revenue: '47,936' },
        { name: 'Classic White Tee', category: 'Tops', sold: 28, revenue: '13,972' },
      ],
      stats: { revenue: '1,24,850', orders: 156, activeListings: 12, rating: 4.8 },
      lowStock: [
        { name: 'Satin Slip Dress', size: 'S', stock: 2 },
        { name: 'Denim Jacket', size: 'M', stock: 1 },
      ]
    };
  },

  /**
   * Fetches the seller's product list.
   */
  getProducts: async () => {
    const response = await axios.get('/api/products/seller', { withCredentials: true });
    return response.data;
  },

  /**
   * Fetches earnings and payout data.
   */
  getEarnings: async () => {
    // const response = await axios.get('/api/seller/earnings');
    // return response.data;
    return {
      summary: {
        totalEarned: '₹1,24,850',
        pendingPayout: '₹18,400',
        withdrawn: '₹1,06,450'
      },
      chartData: [
        { month: 'Nov', value: 32000 },
        { month: 'Dec', value: 55000 },
        { month: 'Jan', value: 41000 },
        { month: 'Feb', value: 67000 },
        { month: 'Mar', value: 91000 },
        { month: 'Apr', value: 124850 },
      ],
      payouts: [
        { date: '10 Apr 2025', amount: '₹15,200', method: 'Bank Transfer', status: 'completed',  txId: 'TXN892733' },
        { date: '25 Mar 2025', amount: '₹22,500', method: 'UPI',           status: 'completed',  txId: 'TXN871042' },
        { date: '10 Mar 2025', amount: '₹18,750', method: 'Bank Transfer', status: 'completed',  txId: 'TXN850391' },
        { date: '25 Feb 2025', amount: '₹12,400', method: 'Bank Transfer', status: 'completed',  txId: 'TXN829184' },
        { date: '10 Feb 2025', amount: '₹18,400', method: 'UPI',           status: 'processing', txId: 'TXN807622' },
      ]
    };
  },

  /**
   * Fetches the seller's profile information.
   */
  getProfile: async () => {
    const response = await axios.get('/api/profile', { withCredentials: true });
    return response.data.profile;
  },

  /**
   * Updates the seller's profile information.
   */
  updateProfile: async (data) => {
    const headers = {};
    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await axios.put('/api/profile', data, {
      headers,
      withCredentials: true
    });
    return response.data;
  }
};

export default sellerApi;
