import api from './api';

const userService = {
  getAll: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

export default userService;
