const express = require("express")
const dotenv = require("dotenv")
const {chats} = require("./data/data");
const connectDB=require("./config/db");
const {notFound, errorHandler} = require("./middleware/errorMiddleware")
const path = require('path')

dotenv.config();
connectDB()
const app = express();

app.use(express.json()); // to accept JSON data



app.use('/api/user', require("./routes/userRoutes"))
app.use('/api/chat', require("./routes/chatRoutes"))
app.use('/api/message', require("./routes/messageRoutes"))

// ---------------Deployment--------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){

    app.use(express.static(path.join(__dirname1,'/frontend-code/build')))
    
    app.get('*',(req,res)=> {
        res.sendFile(path.join(__dirname1,'/frontend-code/','build','index.html'))
    })

} else {
    app.get("/", (req, res) => {
        res.send("API is running")
    })
}

// ---------------Deployment--------------

app.use(notFound)
app.use(errorHandler)

const  PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server started on ${PORT}`))

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket)=> {
    console.log(`connected to socket.io`);

    socket.on('setup', (userData)=> {
        socket.join(userData._id);
        socket.emit('connected')
    })

    socket.on('join chat', (room)=>{
        socket.join(room)
        console.log(room)
    })

    socket.on('typing', (room)=> {socket.in(room).emit("typing")})
    socket.on('stop typing', (room)=> {socket.in(room).emit("stop typing")})

    socket.on('new message', (newMessageRecieved)=> {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log('chat.user nit defined')

        chat.users.forEach(user => {
            if(user._id===newMessageRecieved.sender._id) return;
            
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })

    socket.off('setup', ()=> {
        console.log("USER DISCONNECTED", userData);
        socket.leave(userData._id)
    })

})