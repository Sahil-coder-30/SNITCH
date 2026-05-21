import { useState, useEffect, useMemo } from 'react';
import sellerApi from '../services/seller.api';

/**
 * Custom hook to manage seller orders logic.
 */
export const useSellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await sellerApi.getOrders();
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
    if (activeTab === 'All') return orders;
    return orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());
  }, [orders, activeTab]);

  const openDrawer = async (order) => {
    setSelectedOrder(order);
    try {
      const steps = await sellerApi.getOrderTimeline(order.id);
      setTimeline(steps);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Failed to fetch order timeline:', error);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  return {
    orders: filteredOrders,
    loading,
    activeTab,
    setActiveTab,
    drawerOpen,
    selectedOrder,
    timeline,
    openDrawer,
    closeDrawer,
  };
};
