import api from './api';

const stockService = {
  stockIn: async (data) => {
    const response = await api.post('/stock/in', data);
    return response.data;
  },

  stockOut: async (data) => {
    const response = await api.post('/stock/out', data);
    return response.data;
  },

  getHistory: async (type) => {
    const params = type ? { type } : {};
    const response = await api.get('/stock/history', { params });
    return response.data;
  },

  // Stock In: Finance approve
  approveStockIn: async (id) => {
    const response = await api.patch(`/stock/${id}/approve`);
    return response.data;
  },

  // Stock In: Management acknowledge
  acknowledgeStockIn: async (id) => {
    const response = await api.patch(`/stock/${id}/acknowledge`);
    return response.data;
  },

  // Stock Out: Management approve
  approveStockOut: async (id) => {
    const response = await api.patch(`/stock/${id}/approve-out`);
    return response.data;
  },

  // Stock Out: Finance acknowledge
  acknowledgeStockOut: async (id) => {
    const response = await api.patch(`/stock/${id}/acknowledge-out`);
    return response.data;
  },

  reject: async (id, rejectNote) => {
    const response = await api.patch(`/stock/${id}/reject`, { rejectNote });
    return response.data;
  },
};

export default stockService;
