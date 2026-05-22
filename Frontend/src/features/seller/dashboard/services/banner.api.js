import axios from 'axios';

const API_URL = '/api/banners';

export const uploadBannerImage = async (formData) => {
  const response = await axios.post(`${API_URL}/upload`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getBanners = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const saveActiveBanners = async (banners) => {
  const response = await axios.put(`${API_URL}/active`, { banners }, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getActiveBanners = async () => {
  const response = await axios.get(`${API_URL}/active`, { withCredentials: true });
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
  return response.data;
};
