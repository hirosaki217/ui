import jwt from '../utils/jwt';
import axios from './apiConfig';

export const apiMessage = {
    getList: async (id) => {
        return await axios.get(`/messages/${id}`);
    },
    sendText: async ({ conversationId, content, type = 'TEXT' }) => {
        return await axios.post(`/messages/text`, {
            conversationId,
            content,
            type,
        });
    },
};
