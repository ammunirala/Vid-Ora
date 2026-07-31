import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
    enum: ["free", "bronze", "silver", "gold"],
    default: "free",
  },

  planStartDate: {
    type: Date,
    default: null,
  },

  planExpiryDate: {
    type: Date,
    default: null,
  },

  dailyDownloadLimit: {
    type: Number,
    default: 1,
  },

  watchTimeLimit: {
    type: Number,
    default: 30,
  },

  adFree: {
    type: Boolean,
    default: false,
  },

  premiumAccess: {
    type: Boolean,
    default: false,
  },

  razorpayOrderId: {
    type: String,
    default: "",
  },

  razorpayPaymentId: {
    type: String,
    default: "",
  },

  razorpaySignature: {
    type: String,
    default: "",
  },
});

export default mongoose.models.user || mongoose.model("user", userschema);