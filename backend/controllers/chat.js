const generateToken=require("../config/generateToken");
const Chat=require("../models/chatModel");
const User=require("../models/userModel");
const bcrypt = require("bcrypt")

var functions = {
    accessChat : async (req, res) => {
        try {
            let {userId} = req.body;

            if(!userId) {
                // console.log("userId params npt send with request")
                return res.sendStatus(400);
            }

            let isChat = await Chat.find({
                isGroupChat:false,
                $and: [
                    {users:{$elemMatch:{$eq:req.user._id}}},
                    {users:{$elemMatch:{$eq:userId}}}
                ]
            }).populate("users","-password").populate("latestMessage");

            isChat = await User.populate(isChat, {
                path: 'latestMessage.sender',
                select: "name pic email"
            })

            if(isChat.length > 0 ){
                res.send(isChat[0]);
            } else {
                let chatData = {
                    chatName : "sender",
                    isGroupChat: false,
                    users: [req.user._id, userId]
                }

                let createdChat = await Chat.create(chatData);

                let fullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password");
                res.status(200).send(fullChat)
            }

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
    fetchChats : async (req, res) => {
        try {
            let chats = await Chat.find({ users: {$elemMatch: { $eq: req.user._id }} })
                .populate("users","-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")
                .sort({updatedAt:-1})

                chats = await User.populate(chats, {
                    path: 'latestMessage.sender',
                    select: "name pic email"
                })
            
            res.status(200).send(chats)

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
    createGroupChat : async (req, res) => {
        try {
            if(!req.body.users || !req.body.name) {
                return res.status(400).send({message:"Please fill all the fields"});
            }

            let users = JSON.parse(req.body.users)

            if(users.length<2){
                return res.status(400).send({message:"More than 2 users are required to form a group chat"});
            }

            users.push(req.user)

            let groupChat = await Chat.create({
                chatName:req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin:req.user
            })

            let fullGroupChat = await Chat.findOne({ _id: groupChat._id })
                .populate("users","-password")
                .populate("groupAdmin", "-password")

            res.status(200).send(fullGroupChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
    renameGroup : async (req, res) => {
        try {
            let {chatId, chatName} = req.body;

            let updatedChat = await Chat.findByIdAndUpdate(
                chatId,{ chatName, }, {new:true,}
            ).populate("users", "-password")
            .populate("groupAdmin", "-password")

            if(!updatedChat) {
                res.status(400)
                throw new Error("Chat not found")
            } else {
                res.status(200).send(updatedChat)
            }

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
    removeFromGroup : async (req, res) => {
        try {
            let {chatId, userId} = req.body;

            let removed =await Chat.findByIdAndUpdate(chatId,{
                $pull: {users: userId}
            },
            {new:true}
        ).populate("users", "-password")
        .populate("groupAdmin","-password");

        if(!removed){
            res.status(400)
            throw new Error("Chat not found")
        } else {
            res.status(200).send(removed)
        }

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
    addToGroup : async (req, res) => {
        try {
            let {chatId, userId} = req.body;

            let added =await Chat.findByIdAndUpdate(chatId,{
                $push: {users: userId}
            },
            {new:true}
        ).populate("users", "-password")
        .populate("groupAdmin","-password");

        if(!added){
            res.status(400)
            throw new Error("Chat not found")
        } else {
            res.status(200).send(added)
        }

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
}

module.exports = functions