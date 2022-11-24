import jwt from '../utils/jwt';
import axios from './apiConfig';
export const apiUser = {
    getProfile: async () => {
        return await axios.get('/m/profile');
    },
    getUserByUserName: async ({ username }) => {
        return await axios.get(`auth/users/${username}`);
    },
    updateProfile: async ({ name, birthDay, gender }) => {
        const yyyy = birthDay.getFullYear();
        let mm = birthDay.getMonth() + 1; // Months start at 0!
        let dd = birthDay.getDate();
        const dateOfBirth = {
            day: dd, month: mm, year: yyyy
        }
        console.log("API ", birthDay);
        await axios.put('/m/profile', { name, dateOfBirth, gender })
        // return await axios.get('/m/profile');
    }
};
