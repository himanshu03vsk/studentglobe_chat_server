

const mongoose = require("mongoose"); //uses the package


// define the schema here, this is the tenetative one rn
const MessageSchema = new mongoose.Schema({
  chatroom_id: { type: String, required: true },
  sender_id: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
