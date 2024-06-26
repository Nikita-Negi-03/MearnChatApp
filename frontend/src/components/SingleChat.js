import React, {useEffect, useState} from 'react';
import {ChatState} from '../context/chatProvider';
import {Box, FormControl, IconButton, Input, Spinner, Text, useToast} from '@chakra-ui/react';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {getSender, getSenderFull} from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './style.css'
import ScrollbarChat from './UserAvatar/ScrollbarChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animation/typing.json'

const ENDPOINT = "https://mearnchatapp.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessages, setNewMessages] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    
    const defaultOption = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderSettings: {
            preserveAspectRatio: 'xMilYMid slice'
        }
    }

    const {user, selectedChat, setSelectedChat,notification, setNotification} = ChatState();
    const toast = useToast();

    const fetchMessages = async() => {
        if(!selectedChat) return;
        try {
            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`
                },
            }

            setLoading(true)
            const {data} = await axios.get(`api/message/${selectedChat._id}`, config)

            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast({
                title:"Error Occured!",
                description:"Failed to load the chats",
                status:"error",
                duration:5000,
                isClosable:true,
                position: "bottom"
            });
            return
        }
    };

    useEffect(()=> {
        socket = io(ENDPOINT);
        socket.emit('setup',user)
        socket.on('connected', ()=> setSocketConnected(true) )
        socket.on('typing', ()=> setIsTyping(true))
        socket.on('stop typing', ()=> setIsTyping(false))
    },[])

    useEffect(()=> {
        fetchMessages();

        selectedChatCompare = selectedChat;
    },[selectedChat]);

    

    useEffect(()=> {
        console.log("notification",notification)
       socket.on('message recieved',(newMessageRecieved)=> {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)  {
            if(!notification.includes(newMessageRecieved)){
                setNotification([newMessageRecieved,...notification])
                setFetchAgain(!fetchAgain)
            }
        }  
        else {
            setMessages([...messages,newMessageRecieved])
        }
       })
    });

    const sendMessage = async(event) => {
        if(event.key==="Enter" && newMessages){
            socket.emit('stop typing',selectedChat._id)
            try {
                const config = {
                    headers : {
                        "Content-type": "application/json" ,
                        Authorization: `Bearer ${user.token}`
                    },
                }

                const {data} = await axios.post(`api/message`, {
                    content: newMessages,
                    chatId: selectedChat._id
                }, config)

                setNewMessages("")

                socket.emit('new message', data)

                setMessages([...messages,data])

            } catch (error) {
                toast({
                    title:"Error Occured!",
                    description:"Failed to load the chats",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position: "bottom"
                });
                return
            }
        }
    };

    

    const typingHandler = (e) => {
        setNewMessages(e.target.value)

        //Typing Indicator logic
        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit('typing',selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=> {
            var timeNow = new Date().getTime()
            var timeDifference = timeNow - lastTypingTime;

            if(timeDifference>= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }

        }, timerLength)

    }

    return (
        <> {
                selectedChat? (
                    <>
                        <Text
                            fontSize={{base: "28px", md: "30px"}}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{base: "space-between"}}
                            alignItems="center"
                        >
                            <IconButton 
                                display={{base: "flex" , md:"none"}} 
                                icon={<ArrowBackIcon />}
                                onClick={()=> setSelectedChat("")}
                            />
                            {!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ):(
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                </>
                            )}
                        </Text>
                        <Box 
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) :(
                                <div className='messages'>
                                    <ScrollbarChat messages={messages} />
                                </div>
                            )}

                            <FormControl
                                onKeyDown={sendMessage}
                                isRequired
                                mt={3}
                            >
                                {isTyping ? <div>
                                    <Lottie
                                        options={defaultOption}
                                        width={70}
                                        style={{marginBottom: 15, marginLeft: 0}}
                                    /> 
                                 </div>:<></>}
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder='Enter a message...'
                                    onChange={typingHandler}
                                    value={newMessages}
                                />
                            </FormControl>

                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    );
}

export default SingleChat;