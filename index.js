const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log("Database error : ",err.message);
  });  

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, process.env.PUBLIC_DIR)));
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});
