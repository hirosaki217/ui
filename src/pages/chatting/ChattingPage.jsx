import './chatting.css';

import { Avatar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    currentAConverSelector,
    currentConversationSelector,
} from '../../store/reducers/conversationReducer/conversationSlice';
import { messagesSelector, sendImage, sendImages } from '../../store/reducers/messageReducer/messageSlice';
import dateUtils from '../../utils/dateUtils';
import CustomizedInputBase from '../../components/CustomizedInputBase/CustomizedInputBase';
import jwt from '../../utils/jwt';
import { useEffect, useRef } from 'react';
import HeaderUser from '../../components/ChatHeaderUser/HeaderUser';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { Button } from '@material-ui/core';
import { apiMessage } from '../../api/apiMessage';
const ChattingPage = ({ socket }) => {
    const currentConversation = useSelector(currentConversationSelector);
    const conversation = useSelector(currentAConverSelector);
    const messages = useSelector(messagesSelector);
    const user = { _id: jwt.getUserId() };
    const scroll = useRef();
    const dispath = useDispatch();

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
        console.log('fileObj is', fileObj);

        // formData.append('file', fileObj);
        for (let file of files) {
            formData.append('files', file);
        }

        // console.log('form data', formData.getAll('files'));
        // 👇️ reset file input
        event.target.value = null;

        // 👇️ is now empty
        // console.log(event.target.files);

        // // 👇️ can still access file object here
        console.log(fileObj);
        console.log(fileObj.name);
        const attachInfo = {
            type: 'GROUP_IMAGE',
            conversationId: currentConversation,
        };
        const callback = (percentCompleted) => {
            console.log(percentCompleted);
        };
        try {
            dispath(sendImages({ formData, attachInfo, callback }));
        } catch (error) {
            console.log(error);
        }
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
        <div className="chatting">
            <div className="headerUser">{messages.data && <HeaderUser conversation={conversation} />}</div>
            <div ref={scroll} className="roomChat scrollbar" id="style-scroll">
                {messages.data &&
                    messages.data.map((msg) => {
                        if (msg.type === 'TEXT') return Chatlogic.messageText(msg, user);
                        else if (msg.type === 'IMAGE') return Chatlogic.messageImage(msg, user);
                        else if (msg.type === 'GROUP_IMAGE') return Chatlogic.messageGroupImage(msg, user);
                    })}
            </div>
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
                        <CustomizedInputBase socket={socket} conversationId={currentConversation} />
                    </div>
                </div>
            ) : (
                ''
            )}
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
