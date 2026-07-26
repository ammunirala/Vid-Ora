import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  channelname: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  joinedon: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },
  dailyDownloadLimit: {
    type: Number,
    default: 1,
  },
});

export default mongoose.models.user || mongoose.model("user", userschema);