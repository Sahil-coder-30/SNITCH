import axios from 'axios';

const API_URL = '/api/products';

export const uploadImages = async (formData) => {
  const response = await axios.post(`${API_URL}/upload_images`, formData, {
    withCredentials: true,
  });
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await axios.post(`${API_URL}/create_Product`, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

export const getSellerProducts = async () => {
    // This endpoint might not exist yet, but following the pattern
    const response = await axios.get(`${API_URL}/seller`, { withCredentials: true });
    return response.data;
};
