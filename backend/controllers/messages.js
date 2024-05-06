const generateToken=require("../config/generateToken");
const User=require("../models/userModel");
const Messages=require("../models/messageModel");
const bcrypt = require("bcrypt");
const Chat=require("../models/chatModel");

var functions = {
    sendMessage : async (req, res) => {
        try {
            const {content, chatId} = req.body;
            if(!content ||  !chatId) {
                // console.log("Invalid data pass into request")
                return res.sendStatus(400)
            }

            let newMessage = {
                sender: req.user._id,
                content: content,
                chat:chatId
            }

            let message = await Messages.create(newMessage)

            message = await message.populate("sender","name pic");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path : 'chat.users',
                select: 'name pic email'
            })

           await Chat.findByIdAndUpdate(req.body.chatId , {
            latestMessage: message,
           })

           res.json(message)
            

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
    allMessages : async (req, res) => {
        try {
            const messages = await Messages.find({ chat: req.params.chatId }).populate(
                "sender", "name pic email"
            ).populate("chat")
            res.json(messages)

        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    },
}

module.exports = functions

