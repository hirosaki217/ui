import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer/loginSlice';
import conversationReducer from './reducers/conversationReducer/conversationSlice';
import messageReducer from './reducers/messageReducer/messageSlice';
const store = configureStore({
    reducer: {
        loginReducer,
        conversationReducer,
        messageReducer,
    },
});

export default store;
