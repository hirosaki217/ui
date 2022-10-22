import './chatting.css';

import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { currentConversationSelector } from '../../store/reducers/conversationReducer/conversationSlice';
import { messagesSelector } from '../../store/reducers/messageReducer/messageSlice';
import { loginSelector } from '../../store/reducers/loginReducer/loginSlice';
import dateUtils from '../../utils/dateUtils';
import CustomizedInputBase from '../../components/CustomizedInputBase/CustomizedInputBase';

const ChattingPage = ({ socket }) => {
    const currentConversation = useSelector(currentConversationSelector);
    const messages = useSelector(messagesSelector);
    const user = useSelector(loginSelector);

    return (
        <div className="chatting">
            <div className="headerUser">Action</div>
            <div className="roomChat scrollbar" id="style-scroll">
                {messages.data &&
                    messages.data.map((msg) => (
                        <div key={msg._id} className={msg.user._id === user._id ? 'rightUser' : 'leftUser'}>
                            <div className="wrapperMessage">
                                <div className="messageUser">
                                    <Avatar />
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
                    <div className="sendOption"></div>
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
