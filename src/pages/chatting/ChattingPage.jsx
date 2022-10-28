import './chatting.css';

import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import {
    currentAConverSelector,
    currentConversationSelector,
} from '../../store/reducers/conversationReducer/conversationSlice';
import { messagesSelector } from '../../store/reducers/messageReducer/messageSlice';
import dateUtils from '../../utils/dateUtils';
import CustomizedInputBase from '../../components/CustomizedInputBase/CustomizedInputBase';
import jwt from '../../utils/jwt';
import { useEffect, useRef } from 'react';
import HeaderUser from '../../components/ChatHeaderUser/HeaderUser';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { Button } from '@material-ui/core';
const ChattingPage = ({ socket }) => {
    // file image
    const inputRef = useRef(null);
    const handleClickChooseFile = () => {
        // 👇️ open file input box on click of other element
        inputRef.current.click();
    };

    const handleFileChange = (event) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }
    };
    // end file

    const currentConversation = useSelector(currentConversationSelector);
    const conversation = useSelector(currentAConverSelector);
    const messages = useSelector(messagesSelector);
    const user = { _id: jwt.getUserId() };
    const scroll = useRef();
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
                    messages.data.map((msg) => (
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
                                    <div style={{ fontWeight: '300', fontSize: '13px' }}>
                                        {dateUtils.toTimeSent(msg.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                {/* <div className="rightUser">
                    <div className="wrapperMessage">
                        <div className="messageUser">
                            <Avatar />
                        </div>
                        <div className="content">
                            <div className="isMessageGroup messageName" style={{ fontSize: '13px', textIndent: '2px' }}>
                                Huy
                            </div>
                            <div style={{ padding: '5px 0' }}>message</div>
                            <div style={{ fontWeight: '300', fontSize: '13px' }}>time</div>
                        </div>
                    </div>
                </div> */}
            </div>
            {currentConversation ? (
                <div className="chatAction">
                    <div className="sendOption">
                        <input style={{ display: 'none' }} ref={inputRef} type="file" onChange={handleFileChange} />
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

const ChatlogicStyling = (id, userId) => {
    if (id != userId) {
        return 'left-msg';
    }
    return 'right-msg';
};
export default ChattingPage;
