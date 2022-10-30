import './chatting.css';

import { Avatar, AvatarGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    currentAConverSelector,
    currentConversationSelector,
    // updateLastViewOfMembers,
} from '../../store/reducers/conversationReducer/conversationSlice';
import { messagesSelector, sendImage, sendImages } from '../../store/reducers/messageReducer/messageSlice';
import dateUtils from '../../utils/dateUtils';
import CustomizedInputBase from '../../components/CustomizedInputBase/CustomizedInputBase';
import jwt from '../../utils/jwt';
import { useEffect, useRef, useState } from 'react';
import HeaderUser from '../../components/ChatHeaderUser/HeaderUser';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { Button } from '@material-ui/core';
import { apiMessage } from '../../api/apiMessage';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { friendSelector } from '../../store/reducers/friendReducer/friendReducer';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { meSelector } from '../../store/reducers/userReducer/meReducer';
const ChattingPage = ({ socket }) => {
    const dispatch = useDispatch();
    const me = useSelector(meSelector);
    const tabInfoRef = useRef();
    const currentConversation = useSelector(currentConversationSelector);
    const conversation = useSelector(currentAConverSelector);
    const messages = useSelector(messagesSelector);
    const user = { _id: jwt.getUserId() };
    const friendProfile = useSelector(friendSelector);
    const [frProfile, setFrProfile] = useState('');
    const scroll = useRef();
    const dispath = useDispatch();
    const [usersTyping, setUsersTyping] = useState([]);

    useEffect(() => {
        setFrProfile(friendProfile);
    }, [friendProfile]);

    useEffect(() => {
        socket.on('typing', (conversationId, user) => {
            console.log('typing....');
            if (conversationId === currentConversation) {
                const index = usersTyping.findIndex((ele) => ele._id === user._id);

                if (usersTyping.length === 0 || index < 0) {
                    setUsersTyping([...usersTyping, user]);
                }
            }
        });

        socket.on('not-typing', (conversationId, user) => {
            console.log('not-typing....');
            if (conversationId === currentConversation) {
                const index = usersTyping.findIndex((ele) => ele._id === user._id);
                const newUserTyping = usersTyping.filter((ele) => ele._id !== user._id);

                setUsersTyping(newUserTyping);
            }
        });

        // socket.on('user-last-view', ({ conversationId, userId, lastView }) => {
        //     if (userId != user._id) {
        //         dispatch(
        //             updateLastViewOfMembers({
        //                 conversationId,
        //                 userId,
        //                 lastView,
        //             }),
        //         );
        //     }
        // });
    }, [currentConversation]);

    // file image
    const inputRef = useRef(null);
    const handleClickChooseFile = () => {
        // 👇️ open file input box on click of other element
        inputRef.current.click();
    };
    const handleFileChange = async (event) => {
        const files = event.target.files;
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
        const formData = new FormData();
        const callback = (percentCompleted) => {
            console.log(percentCompleted);
        };
        console.log('fileObj is', fileObj);

        if (files.length > 1) {
            for (let file of files) {
                formData.append('files', file);
            }
            const attachInfo = {
                type: 'GROUP_IMAGE',
                conversationId: currentConversation,
            };

            try {
                dispath(sendImages({ formData, attachInfo, callback }));
            } catch (error) {
                console.log(error);
            }
        } else {
            formData.append('file', fileObj);
            const attachInfo = {
                type: 'IMAGE',
                conversationId: currentConversation,
            };

            try {
                dispath(sendImage({ formData, attachInfo, callback }));
            } catch (error) {
                console.log(error);
            }
        }

        // console.log('form data', formData.getAll('files'));
        // 👇️ reset file input
        event.target.value = null;

        // 👇️ is now empty
        // console.log(event.target.files);

        // // 👇️ can still access file object here
        console.log(fileObj);
        console.log(fileObj.name);
    };
    // end file

    useEffect(() => {
        const scrollToBottom = (node) => {
            node.scrollTop = node.scrollHeight;
        };
        scrollToBottom(scroll.current);
        scroll.current.scrollIntoView({ behavior: 'smooth' });
    });

    return (
        <div className="wrapChatting">
            <div className="chatting">
                <div className="headerUser">
                    {messages.data && <HeaderUser tabInfoRef={tabInfoRef} conversation={conversation} />}
                </div>
                {/* message */}
                <div ref={scroll} className="roomChat scrollbar" id="style-scroll">
                    {messages.data &&
                        messages.data.map((msg) => {
                            if (msg.type === 'TEXT') return Chatlogic.messageText(msg, user);
                            else if (msg.type === 'IMAGE') return Chatlogic.messageImage(msg, user);
                            else if (msg.type === 'GROUP_IMAGE') return Chatlogic.messageGroupImage(msg, user);
                        })}

                    {/* typing check */}
                    {usersTyping.length > 0 && (
                        <div key={currentConversation} className="typing-message">
                            {usersTyping.map((ele, index) => (
                                <span key={ele._id}>
                                    {index < 3 && (
                                        <>{index === usersTyping.length - 1 ? `${ele.name} ` : `${ele.name}, `}</>
                                    )}
                                </span>
                            ))}
                            {usersTyping.length > 3 ? `và ${usersTyping.length - 3} người khác` : ''}
                            <span>&nbsp;đang nhập</span>
                            <div className="snippet" data-title=".dot-flashing">
                                <div className="stage">
                                    <div className="dot-flashing"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* chat */}
                {currentConversation ? (
                    <div className="chatAction">
                        <div className="sendOption">
                            <input
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                ref={inputRef}
                                type="file"
                                onChange={handleFileChange}
                            />
                            <Button onClick={handleClickChooseFile} className="btnOption">
                                <InsertPhotoOutlinedIcon />
                            </Button>
                            <Button className="btnOption">
                                <AttachFileOutlinedIcon />
                            </Button>
                        </div>
                        <div className="sendMessage">
                            <CustomizedInputBase me={me} socket={socket} conversationId={currentConversation} />
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
            {/* info */}
            <div className="infoConversation">
                <div ref={tabInfoRef} className="infoContainer hide scrollbar" id="style-scroll">
                    <h5 className="titleInfo">Thông tin {conversation.type ? 'nhóm' : 'hội thoại'}</h5>
                    <div>
                        <div className="wrapInfoAvatar">
                            {conversation.type ? (
                                <AvatarGroup className="group" total={conversation.totalMembers}>
                                    <Avatar
                                        className="iconAvatar"
                                        alt="A"
                                        src={`${conversation.avatar[0].avatar ? conversation.avatar[0].avatar : '0'}`}
                                    />
                                    <Avatar
                                        className="iconAvatar"
                                        alt="B"
                                        src={`${conversation.avatar[1].avatar ? conversation.avatar[1].avatar : '1'}`}
                                    />
                                    <Avatar
                                        className="iconAvatar"
                                        alt="C"
                                        src={`${conversation.avatar[2].avatar ? conversation.avatar[2].avatar : '2'}`}
                                    />

                                    {conversation.avatar.length > 3 && (
                                        <Avatar
                                            className="iconAvatar"
                                            alt="D"
                                            src={`${
                                                conversation.avatar[3].avatar ? conversation.avatar[3].avatar : '3'
                                            }`}
                                        />
                                    )}
                                </AvatarGroup>
                            ) : (
                                <Avatar
                                    sx={{ width: 56, height: 56 }}
                                    className="conversationAvatar"
                                    src={conversation.avatar ? conversation.avatar : ''}
                                />
                            )}
                        </div>
                        <h5>
                            {conversation.name ? conversation.name : 'name'}
                            <span className="btnEditName">
                                <BorderColorOutlinedIcon />{' '}
                            </span>
                        </h5>
                    </div>
                    <div className="infoGroupCommon">
                        {conversation.type === false ? (
                            <p>
                                <GroupsOutlinedIcon style={{ margin: '0 5px' }} />{' '}
                                {frProfile ? frProfile.numberCommonGroup : 0}nhóm chung
                            </p>
                        ) : (
                            <p>
                                <PeopleOutlinedIcon style={{ margin: '0 5px' }} />
                                thành viên
                            </p>
                        )}
                    </div>
                    <div className="infoMedia">
                        <h5>Ảnh/Video</h5>
                    </div>
                    <div className="infoFile">
                        <h5>File</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Chatlogic = {
    messageText: (msg, user) => (
        <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
            <div className="wrapperMessage">
                <div className="messageUser">
                    <Avatar src={msg.user.avatar ? msg.user.avatar : ''} />
                </div>
                <div className="content">
                    <div className={`messageName`} style={{ fontSize: '13px', textIndent: '2px' }}>
                        {msg.user.name}
                    </div>
                    <div
                        style={{
                            padding: '5px 0',
                            wordWrap: 'break-word',
                            contain: 'style',
                            wordBreak: 'break-word',
                        }}
                    >
                        {msg.content}
                    </div>
                    <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                </div>
            </div>
        </div>
    ),

    messageImage: (msg, user) => (
        <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
            <div className="wrapperMessage">
                <div className="messageUser">
                    <Avatar src={msg.user.avatar ? msg.user.avatar : ''} />
                </div>
                <div className="content">
                    <div className="isMessageGroup messageName" style={{ fontSize: '13px', textIndent: '2px' }}>
                        {msg.name}
                    </div>
                    <div style={{ padding: '5px 0' }}>
                        <img src={msg.content} alt="không tải được ảnh" className="imageMessage" />
                    </div>
                    <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                </div>
            </div>
        </div>
    ),
    messageGroupImage: (msg, user) => {
        const listImage = msg.content.split(';');
        listImage.splice(listImage.length - 1, 1);

        return (
            <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
                <div className="wrapperMessage">
                    <div className="messageUser">
                        <Avatar src={msg.user.avatar ? msg.user.avatar : ''} />
                    </div>
                    <div className="content">
                        <div className="isMessageGroup messageName" style={{ fontSize: '13px', textIndent: '2px' }}>
                            {msg.name}
                        </div>
                        <div style={{ padding: '5px 0' }}>
                            <div className="groupImage">
                                {listImage &&
                                    listImage.map((image) => (
                                        <img key={image} src={image} alt={image} className="imageMessage" />
                                    ))}
                            </div>
                        </div>
                        <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                    </div>
                </div>
            </div>
        );
    },
};
export default ChattingPage;
