import { Avatar } from '@material-ui/core';
import { AvatarGroup } from '@mui/material';
import './headerUser.css';

const HeaderUser = ({ conversation }) => {
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
            <div>{/* <div className="conversationOption">option</div> */}</div>
        </div>
    );
};

export default HeaderUser;
