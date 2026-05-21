// ============================================================
//  SNITCH — Central Data Store (API-Ready)
//  Placeholder for dynamic data fetching.
// ============================================================

export const DUMMY_USER = null;

export const DUMMY_ADDRESSES = [];

export const DUMMY_PRODUCTS = [];

export const DUMMY_CART_ITEMS = [];

export const DUMMY_ORDERS = [];

export const DUMMY_REVIEWS = [];

export const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', desc: '5-7 business days', fee: 0, badge: 'FREE', eta: null },
  { id: 'express', label: 'Express Delivery', desc: '2-3 business days', fee: 99, badge: null, eta: null },
];

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: 'smartphone' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'credit_card' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'payments' },
];

export const RETURN_REASONS = [
  'Wrong size / fit issue',
  'Product damaged / defective',
  'Not as described',
  'Changed my mind',
  'Wrong item delivered',
  'Quality not as expected',
  'Late delivery',
  'Other',
];
