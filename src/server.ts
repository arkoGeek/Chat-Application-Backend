const express = require("express");
const cors = require("cors");
const http = require("http")
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const connection = require("./connection");
const chatRoutes = require("./routes/chats");
const messageRoutes = require("./routes/message")

const app = express();


connection();
app.use(cors());

app.use(express.urlencoded({extended : false}))
app.use(express.json())

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);

const server = app.listen(4000, () => {
  console.log("Server started at PORT 4000!");
})

const io = require("socket.io")(server, {
  cors : {
    origin : "http://localhost:3000"
  }
});

io.on("connection", (socket:any) => {
  socket.on("setup", (userData : any) => {
    socket.join(userData.id);
    socket.emit("connected");
    });
  socket.on("join chat", (room : any) => {
    socket.join(room);
  });
  socket.on("new message", (newMessageRecieved : any) => {
    const chat = newMessageRecieved.chat;
    if (!chat.members) return console.log("chat.users not defined");
    chat.members.forEach((user : any) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
})

