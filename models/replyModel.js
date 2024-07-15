const mongoose = require("mongoose");
const replyModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The item must have a owner"],
  },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    required: [true, "The review must have a product"],
  },
  replyMessage: {
    type: "String",
    required: [true, "The item must have a rating"],
  },
});

const Reply = mongoose.model("Reply", replyModel);
module.exports = Reply;
