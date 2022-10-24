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
import { useNavigate } from 'react-router-dom';
import { getProfile, meSelector } from '../store/reducers/userReducer/meReducer';
import { findFriend, getFriends, getListInvite } from '../store/reducers/friendReducer/friendReducer';
init();
const Home = () => {
    const dispatch = useDispatch();
    const { isLogin } = useSelector(loginSelector);
    const conversations = useSelector(conversationSelector);
    const navigate = useNavigate();
    useEffect(() => {
        if (!jwt.getUserId()) navigate('login');
    }, [jwt.getUserId()]);

    useEffect(() => {
        if (!jwt.getUserId()) return;
        dispatch(getProfile());
        dispatch(getList({}));
        dispatch(getFriends());
        dispatch(getListInvite());
    }, []);

    useEffect(() => {
        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        const userId = jwt.getUserId();
        if (userId) socket.emit('join', userId);
    }, [jwt.getUserId()]);

    useEffect(() => {
        if (conversations.length === 0) return;

        const conversationIds = conversations.map((conversation) => conversation._id);
        socket.emit('join-conversations', conversationIds);
    }, [conversations]);
    useEffect(() => {
        socket.on('new-message', (conversationId, message) => {
            if (jwt.getUserId() !== message.user._id) dispatch(rerenderMessage(message));
        });
    }, []);

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    useWindowUnloadEffect(async () => {
        async function leaveApp() {
            socket.emit('leave', jwt.getUserId());
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
