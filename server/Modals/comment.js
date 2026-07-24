import mongoose from "mongoose";

const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },

    commentbody: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    usercommented: {
      type: String,
      required: true,
    },

    commentedon: {
      type: Date,
      default: Date.now,
    },

    location: {
      type: String,
      default: "",
    },

    showLocation: {
      type: Boolean,
      default: false,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    reports: [
      {
        userid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        reason: {
          type: String,
          default: "Other",
        },
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    flaggedForReview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comment", commentschema);