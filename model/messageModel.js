const mongoose = require("mongoose");
const { Schema } = mongoose;

messageSchema = new Schema({
  message: {
    text: {
      type: String,
      required: true,
    },
  },
  users: Array,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},
{
    timestamps:true,
});

exports.Message = mongoose.models.Message
  ? mongoose.model("Message")
  : mongoose.model("Message", messageSchema);
