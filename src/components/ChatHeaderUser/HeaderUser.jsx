import { Avatar } from '@material-ui/core';
import './headerUser.css';

const HeaderUser = ({ conversation }) => {
    return (
        <div className="conversation">
            <div className="conversationInfor">
                <Avatar className="conversationAvatar" />

                <div className="conversationName">
                    <h5 className="name">{conversation.name ? conversation.name : 'name'}</h5>
                    <p className="isOnline">1 phút trước</p>
                </div>
            </div>
            <div>{/* <div className="conversationOption">option</div> */}</div>
        </div>
    );
};

export default HeaderUser;
