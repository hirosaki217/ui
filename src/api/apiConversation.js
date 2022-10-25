import axios from './apiConfig';

export const apiConversations = {
    getList: async (name, type = 0) => {
        return await axios.get('/conversations', {
            params: {
                name: name ? name : '',
                type,
            },
        });
    },
    getConversationById: async (id) => {
        return await axios.get(`/conversations/${id}`);
    },
};
