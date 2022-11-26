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
    getLastViewOfMembers,
    getListMembers,
    leaveGroup,
    listMemberSelector,
    removeManager,
    removeMember,
    updateAvatarWhenUpdateMember,
    updateMemberInconver,
    // updateLastViewOfMembers,
} from '../../store/reducers/conversationReducer/conversationSlice';
import {
    getMessagesByPage,
    messagesSelector,
    sendImage,
    sendImages,
} from '../../store/reducers/messageReducer/messageSlice';
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
import { apiConversations } from '../../api/apiConversation';
import { useCallback } from 'react';
import ModalProfileFriend from '../../components/MyChat/ListFriend/ModalProfileFriend';
import ModalProfile from '../../components/SideNavbar/ModalProfile/ModalProfile';
import { apiUser } from '../../api/apiUser';
import { apiFriend } from '../../api/apiFriend';
import ModalRename from './ModalRename/ModalRename';

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

let currentId = "";

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
    const [isType, setType] = useState(false);
    const [option, setOption] = useState({
        option: 0,
        id: '',
    });
    const [openProfile, setOpenProfile] = useState(false);
    const [friendProfilee, setFriendProfilee] = useState();
    const [openMyProfile, setOpenMyProfile] = useState(false);
    const [openModalRename, setOpenModalRename] = useState(false);
    const [infoRoom, setInfoRoom] = useState();
    const handleOpenModalRename = () => {
        setOpenModalRename(true);
    };
    const handleCloseModalRename = () => {
        setOpenModalRename(false);
    }
    const handleCloseProfile = () => {
        setOpenProfile(false);
        setOpenMyProfile(false);
    };
    const getFriendIdOption = async (optionId) => {
        const temp = optionId
        console.log("idoption", temp)
        if (temp && temp !== user._id) {
            const fen = await apiFriend.findFriendById(temp)
            setFriendProfilee(fen.data);
            setOpenProfile(true);
        } else if (temp && temp === user._id)
            setOpenMyProfile(true)
    }
    // useEffect(()=> {
    //     scroll.current.addEventListener("scroll", (event)=>{
    //         const scrollTop = event.target.scrollTop;
    //     let page = messages.page;
    //     const totalPages = messages.totalPages;

    //     if (scrollTop === 0 && page < totalPages) {
    //         page += 1;

    //         dispatch(getMessagesByPage({ id: currentConversation, page }));
    //     }
    //     })
    // }, [currentConversation])
    const handleScroll = (event) => {
        
        const scrollTop = event.target.scrollTop;
        let page = messages.page;
        const totalPages = messages.totalPages;
        
        if (scrollTop === 0) {
            
            if (page <= totalPages) {

                page += 1;

                dispatch(getMessagesByPage({ id: currentConversation, page }));
            }
        }
        // console.log('scrollTop: ', event.currentTarget.scrollTop, scrollTop === 0);
        // console.log('offsetHeight: ', event.currentTarget.offsetHeight);
    };

    useEffect(() => {
        setFrProfile(friendProfile);
    }, [friendProfile]);
    // members
    const membersRef = useRef();
    const fileRef = useRef();
    const handleShowMember = () => {
        membersRef.current.classList.toggle('showMembers');
    };
    const handleShowPic = () => {
        fileRef.current.classList.toggle('showPics');

    };
    useEffect(() => {
        setMembers(listMember);
    }, [listMember]);
    // end members

    useEffect(() => {

        socket.on('typing', (conversationId, user) => {
            console.log('typing....', currentId);
            currentId = conversationId;

            const index = usersTyping.findIndex((ele) => ele._id === user._id);
            if (usersTyping.length === 0 || index < 0) {
                setUsersTyping([...usersTyping, user]);
            }



        });

        socket.on('not-typing', (conversationId, user) => {
            currentId = conversationId;
            console.log('not-typing....');

            const index = usersTyping.findIndex((ele) => ele._id === user._id);
            const newUserTyping = usersTyping.filter((ele) => ele._id !== user._id);

            setUsersTyping(newUserTyping);



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
        socket.on('update-member', async (conversationId) => {
            if (conversationId === conversation._id) {
                await dispatch(getLastViewOfMembers({ conversationId }));
                const { data } = await apiConversations.getListMember(conversation._id);
                console.log("LIST MEMB", data);
                dispatch(updateMemberInconver({ conversationId, newMember: data }));
            }
        });

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
        setTimeout(() => {
            scrollToBottom(scroll.current);
        }, 1000);
        scroll.current.scrollIntoView({ behavior: 'smooth' });

    }, [currentConversation]);
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
        }
        else if (id !== user._id && conversation.leaderId === user._id) {
            setOption({
                option: 2,
                id,
            });
        } else if (id !== user._id && conversation.managerIds.includes(user._id)) {
            setOption({
                option: 3,
                id,
            });
        } else if ((id !== user._id && conversation.leaderId !== user._id) && !conversation.managerIds.includes(user._id)) {
            setOption({
                option: 4,
                id,
            })
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

    const handleRemoveMember = async () => {
        dispatch(removeMember({ conversationId: conversation._id, userId: option.id }));
        setAnchorEl(null);
    };

    const handleAddManager = () => {
        dispatch(addManager({ conversationId: conversation._id, managerIds: [option.id] }));
        setAnchorEl(null);
    };

    const handleRemoveManager = () => {
        console.log('Removing ', [option.id]);
        dispatch(removeManager({ conversationId: conversation._id, managerIds: [option.id] }));
        setAnchorEl(null);
    };
    // end event group

    //
    const MemberSelect = (option) => {

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
                    <MenuItem
                        style={{ padding: '5px 5px' }}
                        onClick={getFriendIdOption.bind(this, option.id)}
                    >
                        Xem thông tin
                    </MenuItem>

                    {(option.id === user._id && option.id !== conversation.leaderId) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleLeaveGroup}>
                            Rời khỏi nhóm
                        </MenuItem>
                    }

                    {(option.option === 2 && conversation.managerIds.includes(option.id)) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveManager}>
                            Xóa phó nhóm
                        </MenuItem>
                    }
                    {(option.option === 2 && !conversation.managerIds.includes(option.id)) &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleAddManager}>
                            Thêm phó nhóm
                        </MenuItem>
                    }
                    {
                        option.option === 2 &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveMember}>
                            Xóa khỏi nhóm
                        </MenuItem>
                    }
                    {
                        (option.option === 3 && (option.id !== conversation.leaderId || conversation.managerIds.includes(option.id)))
                        &&
                        <MenuItem style={{ padding: '5px 5px' }} onClick={handleRemoveMember}>
                            Xóa khỏi nhóm
                        </MenuItem>
                    }
                    <ModalProfile openProfilee={openMyProfile} closeProfile={handleCloseProfile} />
                    <ModalProfileFriend friend={friendProfilee} openProfilee={openProfile} closeProfile={handleCloseProfile} />
                </Menu>


            </div>
        );
    };
    //
    return (
        <div className="wrapChatting">
            <div className="chatting">
                <div className="headerUser">
                    {messages.data && (
                        <HeaderUser tabInfoRef={tabInfoRef} socket={socket} conversation={conversation} />
                    )}
                </div>
                {/* message */}
                <div onScroll={handleScroll} ref={scroll} className="roomChat scrollbar" id="style-scroll">
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

                </div>

                <div>

                    {(usersTyping.length > 0 && currentId === currentConversation) && (
                        <div key={currentConversation} className="typing-message ">
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

                    <div >
                        <div className="wrapInfoAvatar">
                            {conversation.type ? (
                                <AvatarGroup className="group" total={members.length > -1 ? members.length : conversation.totalMembers}>

                                    <Avatar
                                        className="iconAvatar"
                                        alt="A"
                                        src={`${members[0] ? members[0].avatar : ''}`}
                                    />
                                    {members.length > 1 && (
                                        <Avatar
                                            className="iconAvatar"
                                            alt="B"
                                            src={`${members[1] ? members[1].avatar : ''
                                                }`}
                                        />
                                    )}

                                    {members.length > 2 && (
                                        <Avatar
                                            className="iconAvatar"
                                            alt="C"
                                            src={`${members[2] ? members[2].avatar : ''
                                                }`}
                                        />
                                    )}

                                    {/* {conversation.avatar.length > 3 && (
                                        <Avatar
                                            className="iconAvatar"
                                            alt="D"
                                            src={`${
                                                conversation.avatar[3].avatar ? conversation.avatar[3].avatar : '3'
                                            }`}
                                        />
                                    )} */}
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
                                <BorderColorOutlinedIcon
                                    onClick={() => {
                                        setOpenModalRename(true);
                                        setInfoRoom(conversation)
                                    }
                                    } />{' '}
                            </span>
                            <ModalRename conversation={conversation} infoRoom={infoRoom} openModalRename={openModalRename} closeModalRename={handleCloseModalRename} />
                        </h5>
                    </div>
                    <div className="infoGroupCommon">
                        {conversation.type === false ? (
                            <p style={{ paddingTop: '12px' }}>
                                <GroupsOutlinedIcon style={{ margin: '0 5px' }} />{' '}
                                {frProfile ? frProfile.numberCommonGroup : 0}nhóm chung
                            </p>
                        ) : (
                            <p style={{ paddingTop: '12px' }} onClick={handleShowMember}>
                                <PeopleOutlinedIcon style={{ margin: '0 5px' }} />
                                {members.length > -1 ? members.length : 0} thành viên
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
                    <div className="infoMedia" >
                        <h5 onClick={handleShowPic}>Ảnh/Video</h5>
                        <div ref={fileRef} className='bao-info-pic scrollbar' id="style-scroll">

                            {messages.data &&
                                messages.data.map((msg) => {
                                    if (msg.type === 'IMAGE')
                                        return <div
                                            key={msg.content}
                                            style={{ width: '82px', height: '82px', padding: '10px'}}
                                        >
                                            <img
                                                style={{width:'100%',height:'100%'}}
                                                src={msg.content} alt=""
                                            />
                                        </div>
                                    else if (msg.type === 'VIDEO')
                                        return (<div
                                            key={msg.content}
                                            style={{ width: '82px', height: '82px', padding: '10px' }}
                                        >
                                            <video
                                                style={{ width: '100%', height: '100%' }}
                                                src={msg.content}>
                                            </video>
                                        </div>)
                                    else if (msg.type === 'GROUP_IMAGE') {
                                        const listImage = msg.content.split(';');
                                        listImage.splice(listImage.length - 1, 1);
                                        
                                            
                                        return listImage.map((file) => {
                                                if (checkType(file) === 'VIDEO')
                                                    return (
                                                        <div
                                                            key={file}
                                                            style={{ width: '82px', height: '82px', padding: '10px' }}
                                                        >
                                                            <video
                                                            style={{ width: '100%', height: '100%' }}
                                                                controls
                                                                key={file}
                                                                src={file}
                                                                alt={file}
                                                                className="imageMessage"
                                                            />
                                                        </div>
                                                    );
                                                else
                                                    return (
                                                        <div
                                                            key={file}
                                                            style={{ width: '82px', height: '82px', padding: '10px'}}
                                                        >
                                                            <img
                                                            style={{ width: '100%', height: '100%' }}
                                                              key={file} src={file} alt={file} className="imageMessage" />
                                                        </div>
                                                    );

                                                        
                                            })
                                        
                                    }
                                })}
                        </div>
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
