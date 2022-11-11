import './chatting.css';

import {
    Avatar,
    AvatarGroup,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    addManager,
    currentAConverSelector,
    currentConversationSelector,
    leaveGroup,
    listMemberSelector,
    removeMember,
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { apiMessage } from '../../api/apiMessage';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { friendSelector } from '../../store/reducers/friendReducer/friendReducer';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import { meSelector } from '../../store/reducers/userReducer/meReducer';

const TYPE_MATCH_MEDIA = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'];

const TYPE_MATCH = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'video/mp3',
    'video/mp4',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/zip',
];

const ChattingPage = ({ socket }) => {
    const dispatch = useDispatch();
    const me = useSelector(meSelector);
    const listMember = useSelector(listMemberSelector);
    const [members, setMembers] = useState([]);
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
    const [option, setOption] = useState({
        option: 0,
        id: '',
    });
    useEffect(() => {
        setFrProfile(friendProfile);
    }, [friendProfile]);
    // members
    const membersRef = useRef();

    const handleShowMember = () => {
        membersRef.current.classList.toggle('showMembers');
    };

    useEffect(() => {
        setMembers(listMember);
    }, [listMember]);
    // end members
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

        if (files.length > 1) {
            for (let file of files) {
                for (let type of TYPE_MATCH_MEDIA) {
                    if (file.type === type) {
                        formData.append('files', file);
                    }
                }
            }
            const attachInfo = {
                type: 'GROUP_IMAGE',
                conversationId: currentConversation,
            };

            try {
                if (formData.has('files')) dispath(sendImages({ formData, attachInfo, callback }));
            } catch (error) {
                console.log(error);
            }
        } else {
            let mineType = 'IMAGE';

            if (!checkFileMedia(fileObj)) return;
            if (fileObj.type === TYPE_MATCH_MEDIA[3]) mineType = 'VIDEO';
            formData.append('file', fileObj);
            const attachInfo = {
                type: mineType,
                conversationId: currentConversation,
            };

            try {
                if (formData.has('file')) dispath(sendImage({ formData, attachInfo, callback }));
            } catch (error) {
                console.log(error);
            }
        }

        event.target.value = null;
    };
    function checkFileMedia(file) {
        for (let type of TYPE_MATCH_MEDIA) {
            if (file.type === type) {
                return true;
            }
        }
        return false;
    }
    // end file
    useEffect(() => {
        const scrollToBottom = (node) => {
            node.scrollTop = node.scrollHeight;
        };
        scrollToBottom(scroll.current);
        scroll.current.scrollIntoView({ behavior: 'smooth' });
    });
    // event group
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        if (id === user._id) {
            setOption({
                option: 1,
                id,
            });
        } else if (id !== user._id && conversation.leaderId === user._id) {
            setOption({
                option: 2,
                id,
            });
        } else if (id !== user._id && conversation.managerIds.includes(user._id)) {
            setOption({
                option: 3,
                id,
            });
        } else {
            setOption({
                option: 0,
                id: '',
            });
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLeaveGroup = () => {
        dispatch(leaveGroup({ conversationId: conversation._id }));
        setAnchorEl(null);
    };

    const handleRemoveMember = () => {
        dispatch(removeMember({ conversationId: conversation._id, userId: option.id }));
        setAnchorEl(null);
    };

    const handleAddManager = () => {
        dispatch(addManager({ conversationId: conversation._id, managerIds: [option.id] }));
        setAnchorEl(null);
    };
    // end event group

    //
    const MemberSelect = (option) => {
        if (option.option === 1)
            return (
                <div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleLeaveGroup}>
                            Rời khỏi nhóm
                        </MenuItem>
                    </Menu>
                </div>
            );
        if (option.option === 2)
            return (
                <div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleAddManager}>
                            Thêm phó nhóm
                        </MenuItem>
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveMember}>
                            Xóa khỏi nhóm
                        </MenuItem>
                    </Menu>
                </div>
            );
        if (option.option === 3)
            return (
                <div>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveMember}>
                            Xóa khỏi nhóm
                        </MenuItem>
                    </Menu>
                </div>
            );
        return <></>;
    };
    //
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
                            else if (msg.type === 'VIDEO') return Chatlogic.messageImage(msg, user);
                            else if (msg.type === 'GROUP_IMAGE') return Chatlogic.messageGroupImage(msg, user);
                            else if (msg.type === 'NOTIFY') return Chatlogic.messageNotify(msg);
                        })}

                    {/* <div className="leftUser">
                        <div className="wrapperMessage">
                            <div className="content messageDelete">
                                <div
                                    className="contentDeleted"
                                    style={{
                                        padding: '5px 0',
                                        wordWrap: 'break-word',
                                        contain: 'style',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    this is message deleted
                                </div>
                            </div>
                        </div>
                    </div> */}

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
                                accept="image/*,video/mp4,video/x-m4v,video/*"
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
                            <p onClick={handleShowMember}>
                                <PeopleOutlinedIcon style={{ margin: '0 5px' }} />
                                {conversation.totalMembers ? conversation.totalMembers : 0} thành viên
                            </p>
                        )}
                        <div ref={membersRef} className="containerMembers">
                            <List className="listMember scrollbar" id="style-scroll">
                                {members.map((member) => (
                                    <ListItem key={member._id}>
                                        <ListItemAvatar>
                                            <Avatar src={member.avatar && member.avatar} alt={member.name}></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={member.name} />

                                        <ListItemIcon>
                                            <MoreVertIcon
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={(e) => handleClick(e, member._id)}
                                            />
                                        </ListItemIcon>
                                    </ListItem>
                                ))}
                                {MemberSelect(option)}
                            </List>
                        </div>
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
                        {checkType(msg.content) === 'VIDEO' ? (
                            <video controls src={msg.content} alt="không tải được video" className="imageMessage" />
                        ) : (
                            <img src={msg.content} alt="không tải được ảnh" className="imageMessage" />
                        )}
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
                                    listImage.map((file) => {
                                        if (checkType(file) === 'VIDEO')
                                            return (
                                                <video
                                                    controls
                                                    key={file}
                                                    src={file}
                                                    alt={file}
                                                    className="imageMessage"
                                                />
                                            );
                                        else return <img key={file} src={file} alt={file} className="imageMessage" />;
                                    })}
                            </div>
                        </div>
                        <div style={{ fontWeight: '300', fontSize: '13px' }}>{dateUtils.toTimeSent(msg.createdAt)}</div>
                    </div>
                </div>
            </div>
        );
    },
    messageNotify: (msg) => (
        <div key={msg._id} style={{ position: 'relative' }}>
            <hr />
            <span
                style={{
                    position: 'absolute',
                    margin: 0,
                    top: '50%',
                    left: '50%',
                    msTransform: 'translate(-50%, -50%)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 999,
                    backgroundColor: '#f7f7f7',
                    borderRadius: '10px',
                    color: '#000',
                    padding: '0 10px',

                    alignItems: 'center',
                }}
            >
                {msg.content}
            </span>
        </div>
    ),
};

const checkType = (content) => {
    const splitTempt = content.split('.');
    const fileExtension = splitTempt[splitTempt.length - 1];
    if (fileExtension === 'mp4') return 'VIDEO';
    return 'IMAGE';
};

export default ChattingPage;
