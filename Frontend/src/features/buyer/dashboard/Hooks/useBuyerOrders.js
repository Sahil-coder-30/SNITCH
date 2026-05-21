import { useState, useEffect, useMemo } from 'react';
import buyerApi from '../services/buyer.api';

/**
 * Custom hook to manage buyer orders logic.
 */
export const useBuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingSteps, setTrackingSteps] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await buyerApi.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All Orders') return orders;
    return orders.filter(order => {
      if (activeTab === 'Active') return ['processing', 'shipped'].includes(order.status);
      if (activeTab === 'Delivered') return order.status === 'delivered';
      if (activeTab === 'Cancelled') return order.status === 'cancelled';
      if (activeTab === 'Returns & Refunds') return order.status === 'returned';
      return true;
    });
  }, [orders, activeTab]);

  const handleTrackOrder = async (order) => {
    setSelectedOrder(order);
    try {
      const steps = await buyerApi.getOrderTracking(order.id);
      setTrackingSteps(steps);
      setTrackingOpen(true);
    } catch (error) {
      console.error('Failed to fetch tracking info:', error);
    }
  };

  const closeTracking = () => {
    setTrackingOpen(false);
    setSelectedOrder(null);
  };

  return {
    orders: filteredOrders,
    loading,
    activeTab,
    setActiveTab,
    trackingOpen,
    trackingSteps,
    selectedOrder,
    handleTrackOrder,
    closeTracking,
  };
};
