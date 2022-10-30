import { Avatar, Button } from '@material-ui/core';
import { AvatarGroup } from '@mui/material';
import './headerUser.css';
import PhoneIcon from '@material-ui/icons/Phone';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';

const HeaderUser = ({ conversation, tabInfoRef }) => {
    const handleShowTabInfo = () => {
        // tabInfoRef.current.classList.add('')
        const hasClass = tabInfoRef.current.classList.contains('hide');
        if (hasClass) tabInfoRef.current.classList.remove('hide');
        else tabInfoRef.current.classList.add('hide');
    };

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
            <div>
                <div className="conversationOption">
                    <Button>
                        <PhoneIcon />
                    </Button>
                    <Button>
                        <VideoCallIcon />
                    </Button>
                    <Button onClick={handleShowTabInfo}>
                        <VerticalSplitIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeaderUser;
