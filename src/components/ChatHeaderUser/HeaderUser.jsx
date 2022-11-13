import { Avatar, Button } from '@material-ui/core';
import { AvatarGroup } from '@mui/material';
import './headerUser.css';
import PhoneIcon from '@material-ui/icons/Phone';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { listMemberSelector } from '../../store/reducers/conversationReducer/conversationSlice';
import jwt from '../../utils/jwt';
import { useEffect } from 'react';

const HeaderUser = ({ conversation, tabInfoRef, socket }) => {
    const members = useSelector(listMemberSelector);
    const myId = jwt.getUserId();
    const navigate = useNavigate();
    const handleShowTabInfo = () => {
        // tabInfoRef.current.classList.add('')
        const hasClass = tabInfoRef.current.classList.contains('hide');
        if (hasClass) tabInfoRef.current.classList.remove('hide');
        else tabInfoRef.current.classList.add('hide');
    };
    const handleCall = () => {
        if (members.length === 2) {
            const { _id: userId } = members.find((member) => member._id !== myId);
            console.log(userId);
            socket.emit('has-call', userId, myId);
        }
    };
    useEffect(() => {
        if (members.length === 2) {
            const { _id: userId } = members.find((member) => member._id !== myId);
            socket.on('accept-call', (idCall) => {
                window.open(`/call/${userId}`, '_blank');
            });
        }
    }, []);
    return (
        <div className="conversation">
            <div className="conversationInfor">
                {conversation.type ? (
                    <AvatarGroup className="group" total={conversation.totalMembers}>
                        <Avatar
                            className="iconAvatar"
                            alt="A"
                            src={`${conversation.avatar[0].avatar ? conversation.avatar[0].avatar : '0'}`}
                        />
                        {conversation.avatar.length > 1 && (
                            <Avatar
                                className="iconAvatar"
                                alt="B"
                                src={`${conversation.avatar[1].avatar ? conversation.avatar[1].avatar : '1'}`}
                            />
                        )}

                        {conversation.avatar.length > 2 && (
                            <Avatar
                                className="iconAvatar"
                                alt="C"
                                src={`${conversation.avatar[2].avatar ? conversation.avatar[2].avatar : '2'}`}
                            />
                        )}

                        {conversation.avatar.length > 3 && (
                            <Avatar
                                className="iconAvatar"
                                alt="D"
                                src={`${conversation.avatar[3].avatar ? conversation.avatar[3].avatar : '3'}`}
                            />
                        )}
                    </AvatarGroup>
                ) : (
                    <Avatar className="conversationAvatar" src={conversation.avatar ? conversation.avatar : ''} />
                )}

                <div className="conversationName">
                    <h5 className="name">{conversation.name ? conversation.name : 'name'}</h5>
                    <p className="isOnline">1 phút trước</p>
                </div>
            </div>
            <div>
                <div className="conversationOption">
                    {!conversation.type && (
                        <Button onClick={handleCall}>
                            <PhoneIcon />
                        </Button>
                    )}

                    {/* <Button>
                        <VideoCallIcon />
                    </Button> */}
                    <Button onClick={handleShowTabInfo}>
                        <VerticalSplitIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeaderUser;
