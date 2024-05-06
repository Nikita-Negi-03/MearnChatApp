import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const navigation = useNavigate();

    useEffect(()=> {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo)
        if(!userInfo){
            navigation("/")
        }
    },[navigation])

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat,setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState = () => {
    return useContext(ChatContext)
};

export default ChatProvider;