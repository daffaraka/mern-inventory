import api from './api';

const userService = {

    getAll: async (params) => {
        const response = await api.get('/users', { params });
        return response.data;
    },
}


export default userService;