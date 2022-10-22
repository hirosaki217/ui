import jwt from '../utils/jwt';
import axios from './apiConfig';
export const apiUser = {
    getProfile: async () => {
        return await axios.get('/m/profile');
    },
};
