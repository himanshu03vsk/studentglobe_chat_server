require("dotenv").config();
const express = require("express");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const Message = require("./models/Message");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chatdb"; //change this to our project

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// WebSocket server
const wss = new WebSocket.Server({ server });

let chatRooms = {};  // Store active connections

wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection");
  
  ws.on("message", async (data) => {
    const msg = JSON.parse(data);
    const { chatroom_id, sender_id, message } = msg;

    // Save message in MongoDB
    const newMessage = new Message({ chatroom_id, sender_id, message });
    await newMessage.save();

    // Broadcast message to all users in the chatroom
    if (!chatRooms[chatroom_id]) chatRooms[chatroom_id] = [];
    chatRooms[chatroom_id].forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    });

    // Store the new connection
    chatRooms[chatroom_id].push(ws);
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
    Object.keys(chatRooms).forEach(chatroom_id => {
      chatRooms[chatroom_id] = chatRooms[chatroom_id].filter(client => client !== ws);
    });
  });
});



