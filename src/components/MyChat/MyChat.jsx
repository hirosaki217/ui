import ListConversation from './List/ListConversation';
import './myChat.css';

const MyChat = () => {
    return (
        <div className="myChat">
            <div className="myChatHeader">Action</div>
            <div className="myChatList scrollbar" id="style-scroll">
                <ListConversation />
            </div>
        </div>
    );
};

export default MyChat;
