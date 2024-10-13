import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  text: { type: String, require: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  // Comment - One thread can have multiple threads as children
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread"
    },
  ],
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;