import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './reducers/loginReducer/loginSlice';
import conversationReducer from './reducers/conversationReducer/conversationSlice';
import messageReducer from './reducers/messageReducer/messageSlice';
import meReducer from './reducers/userReducer/meReducer';
import friendReducer from './reducers/friendReducer/friendReducer';
const store = configureStore({
    reducer: {
        loginReducer,
        conversationReducer,
        messageReducer,
        meReducer,
        friendReducer,
    },
});

export default store;
