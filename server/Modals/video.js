import mongoose from "mongoose";

const videoschema = new mongoose.Schema(
  {
    videotitle: {
      type: String,
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    filetype: {
      type: String,
      required: true,
    },

    filepath: {
      type: String,
      required: true,
    },

    filesize: {
      type: String,
      required: true,
    },

    videochanel: {
      type: String,
      required: true,
    },

    Like: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    uploader: {
      type: String,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    minimumPlan: {
      type: String,
      enum: ["free", "bronze", "silver", "gold"],
      default: "free",
    },

    adFreeOnly: {
      type: Boolean,
      default: false,
    },

    watchTimeLimit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.videofiles ||
  mongoose.model("videofiles", videoschema);