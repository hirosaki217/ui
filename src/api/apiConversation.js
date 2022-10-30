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
    createGroupConversation: async ({ name, userIds }) => {
        return await axios.post(`/conversations/new/groups`, { name, userIds });
    },
    getLastViewOfMembers: async (conversationId) => {
        return await axios.get(`/conversations/${conversationId}/last-view`);
    },
};
