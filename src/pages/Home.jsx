import MyChat from '../components/MyChat/MyChat';
import SideNavbar from '../components/SideNavbar/SideNavbar';

import ChattingPage from './chatting/ChattingPage';
import { init, socket } from '../utils/socketClient';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSelector } from '../store/reducers/loginReducer/loginSlice';
import { conversationSelector, getList } from '../store/reducers/conversationReducer/conversationSlice';
import { rerenderMessage } from '../store/reducers/messageReducer/messageSlice';
import useWindowUnloadEffect from '../hooks/useWindowUnloadEffect';
import { useAuthContext } from '../contexts/AuthContext';
import jwt from '../utils/jwt';
init();
const Home = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuthContext();
    const conversations = useSelector(conversationSelector);
    const user = { _id: jwt.getUserId() };

    useEffect(() => {
        if (!user._id) return;
        dispatch(getList({}));
    }, []);

    useEffect(() => {
        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        const userId = user._id;
        if (userId) socket.emit('join', userId);
    }, [user]);

    useEffect(() => {
        if (conversations.length === 0) return;

        const conversationIds = conversations.map((conversation) => conversation._id);
        socket.emit('join-conversations', conversationIds);
    }, [conversations]);
    useEffect(() => {
        socket.on('new-message', (conversationId, message) => {
            if (user._id !== message.user._id) dispatch(rerenderMessage(message));
        });
    }, []);

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    useWindowUnloadEffect(async () => {
        async function leaveApp() {
            socket.emit('leave', user._id);
            await sleep(2000);
        }

        await leaveApp();
    }, true);
    return (
        <div className="home">
            <SideNavbar style={{ flex: 1 }} />
            <MyChat></MyChat>
            <ChattingPage socket={socket} />
        </div>
    );
};

export default Home;
