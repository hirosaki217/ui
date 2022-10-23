import SearchInput from '../SearchInput/SearchInput';
import SelectMyChat from '../SelectMyChat/SelectMyChat';
import ListConversation from './List/ListConversation';
import './myChat.css';

const MyChat = () => {
    return (
        <div className="myChat">
            <div className="myChatHeader">
                <SearchInput />
                {/* <div style={{ flex: '1' }}>tag</div> */}
            </div>
            <div className="myChatList scrollbar" id="style-scroll">
                <SelectMyChat />
            </div>
        </div>
    );
};

export default MyChat;
