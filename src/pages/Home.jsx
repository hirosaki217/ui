import MyChat from '../components/MyChat/MyChat';
import SideNavbar from '../components/SideNavbar/SideNavbar';

import ChattingPage from './chatting/ChattingPage';
import { socket } from '../utils/socketClient';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSelector } from '../store/reducers/loginReducer/loginSlice';
import {
    conversationSelector,
    getConversationById,
    getList,
    setLastMessageInConversation,
} from '../store/reducers/conversationReducer/conversationSlice';
import { rerenderMessage } from '../store/reducers/messageReducer/messageSlice';
import useWindowUnloadEffect from '../hooks/useWindowUnloadEffect';
import { useAuthContext } from '../contexts/AuthContext';
import jwt from '../utils/jwt';
import { useNavigate } from 'react-router-dom';
import { getProfile, meSelector } from '../store/reducers/userReducer/meReducer';
import {
    findFriend,
    getFriends,
    getListInvite,
    getListMeInvite,
    recieveInvite,
    setNewFriend,
} from '../store/reducers/friendReducer/friendReducer';

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
        dispatch(getListMeInvite());
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
        console.log('join join join');
        const conversationIds = conversations.map((conversation) => conversation._id);
        socket.emit('join-conversations', conversationIds);
    }, [conversations]);

    useEffect(() => {
        socket.on('create-individual-conversation', (converId) => {
            socket.emit('join-conversation', converId);
            dispatch(getConversationById(converId));
        });
    }, []);

    useEffect(() => {
        socket.on('create-individual-conversation-when-was-friend', (conversationId) => {
            dispatch(getConversationById(conversationId));
        });
    }, []);

    useEffect(() => {
        socket.on('new-message', (conversationId, message) => {
            if (jwt.getUserId() !== message.user._id) dispatch(rerenderMessage(message));

            dispatch(setLastMessageInConversation({ conversationId, message }));
        });
        socket.on('create-conversation', (conversationId) => {
            dispatch(getConversationById(conversationId));
        });
    }, []);

    useEffect(() => {
        socket.on('has-change-conversation-when-have-new-message', (conversationId, message) => {
            dispatch(setLastMessageInConversation({ conversationId, message }));
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

    useEffect(() => {
        socket.on('accept-friend', (value) => {
            dispatch(setNewFriend(value._id));
            // dispatch(setMyRequestFriend(value._id));
        });

        socket.on('send-friend-invite', (fq) => {
            console.log('recieved friend invite', fq);
            dispatch(recieveInvite(fq));
            // dispatch(setAmountNotify(amountNotify + 1));
        });

        // xóa lời mời kết bạn
        socket.on('deleted-friend-invite', (_id) => {
            // dispatch(updateMyRequestFriend(_id));
        });

        //  xóa gởi lời mời kết bạn cho người khác
        socket.on('deleted-invite-was-send', (_id) => {
            // dispatch(updateRequestFriends(_id));
        });

        // xóa kết bạn
        socket.on('deleted-friend', (_id) => {
            // dispatch(updateFriend(_id));
            // dispatch(updateFriendChat(_id));
        });
    }, []);

    return (
        <div className="home">
            <SideNavbar style={{ flex: 1 }} />
            <MyChat socket={socket}></MyChat>
            <ChattingPage socket={socket} />
        </div>
    );
};

export default Home;
