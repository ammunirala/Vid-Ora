import comment from "../Modals/comment.js";
import mongoose from "mongoose";

// Basic abusive words filter.
// Internship demo ke liye list ko baad me expand kar sakte ho.
const abusiveWords = [
  "idiot",
  "stupid",
  "abuse",
  "hate",
];

// Check abusive words
const containsAbusiveWords = (text) => {
  const words = text.toLowerCase().split(/\s+/);

  return abusiveWords.some((badWord) =>
    words.includes(badWord.toLowerCase())
  );
};

// Detect repeated special characters such as !!!!!, @@@@@, #####
const containsSpecialCharacterSpam = (text) => {
  return /([!@#$%^&*()_+=\-])\1{4,}/.test(text);
};

// Detect excessive repeated text such as hahahahahahaha
const containsRepeatedSpam = (text) => {
  return /(.)\1{9,}/i.test(text);
};

// POST COMMENT
export const postcomment = async (req, res) => {
  try {
    const {
      userid,
      videoid,
      commentbody,
      usercommented,
      location,
      showLocation,
    } = req.body;

    if (!commentbody || !commentbody.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    if (containsAbusiveWords(commentbody)) {
      return res.status(400).json({
        message: "Comment contains inappropriate language",
      });
    }

    if (
      containsSpecialCharacterSpam(commentbody) ||
      containsRepeatedSpam(commentbody)
    ) {
      return res.status(400).json({
        message: "Spam comment detected",
      });
    }

    const newComment = new comment({
      userid,
      videoid,
      commentbody: commentbody.trim(),
      usercommented,
      location: showLocation ? location || "" : "",
      showLocation: Boolean(showLocation),
    });

    const savedComment = await newComment.save();

    return res.status(201).json(savedComment);
  } catch (error) {
    console.error("Post comment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// GET VIDEO COMMENTS
export const getallcomment = async (req, res) => {
  const { videoid } = req.params;

  try {
    const comments = await comment
      .find({ videoid })
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// DELETE COMMENT
export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      message: "Comment unavailable",
    });
  }

  try {
    await comment.findByIdAndDelete(_id);

    return res.status(200).json({
      comment: true,
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// EDIT COMMENT
export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      message: "Comment unavailable",
    });
  }

  if (!commentbody || !commentbody.trim()) {
    return res.status(400).json({
      message: "Comment cannot be empty",
    });
  }

  if (containsAbusiveWords(commentbody)) {
    return res.status(400).json({
      message: "Comment contains inappropriate language",
    });
  }

  if (
    containsSpecialCharacterSpam(commentbody) ||
    containsRepeatedSpam(commentbody)
  ) {
    return res.status(400).json({
      message: "Spam comment detected",
    });
  }

  try {
    const updatedComment = await comment.findByIdAndUpdate(
      _id,
      {
        $set: {
          commentbody: commentbody.trim(),
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Edit comment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// LIKE COMMENT
export const likecomment = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(userid)
    ) {
      return res.status(400).json({
        message: "Invalid comment or user",
      });
    }

    const existingComment = await comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const alreadyLiked = existingComment.likes.some(
      (user) => user.toString() === userid
    );

    if (alreadyLiked) {
      existingComment.likes = existingComment.likes.filter(
        (user) => user.toString() !== userid
      );
    } else {
      existingComment.likes.push(userid);

      // Remove dislike if user previously disliked
      existingComment.dislikes = existingComment.dislikes.filter(
        (user) => user.toString() !== userid
      );
    }

    await existingComment.save();

    return res.status(200).json(existingComment);
  } catch (error) {
    console.error("Like comment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// DISLIKE COMMENT
export const dislikecomment = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(userid)
    ) {
      return res.status(400).json({
        message: "Invalid comment or user",
      });
    }

    const existingComment = await comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const alreadyDisliked = existingComment.dislikes.some(
      (user) => user.toString() === userid
    );

    if (alreadyDisliked) {
      existingComment.dislikes = existingComment.dislikes.filter(
        (user) => user.toString() !== userid
      );
    } else {
      existingComment.dislikes.push(userid);

      // Remove like if user previously liked
      existingComment.likes = existingComment.likes.filter(
        (user) => user.toString() !== userid
      );
    }

    // IMPORTANT:
    // No automatic deletion based on dislikes.

    await existingComment.save();

    return res.status(200).json(existingComment);
  } catch (error) {
    console.error("Dislike comment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// REPORT COMMENT
export const reportcomment = async (req, res) => {
  const { id } = req.params;
  const { userid, reason } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(userid)
    ) {
      return res.status(400).json({
        message: "Invalid comment or user",
      });
    }

    const existingComment = await comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const alreadyReported = existingComment.reports.some(
      (report) => report.userid?.toString() === userid
    );

    if (alreadyReported) {
      return res.status(400).json({
        message: "You have already reported this comment",
      });
    }

    existingComment.reports.push({
      userid,
      reason: reason || "Other",
    });

    // Flag for review instead of deleting.
    existingComment.flaggedForReview = true;

    await existingComment.save();

    return res.status(200).json({
      message: "Comment reported and flagged for review",
      comment: existingComment,
    });
  } catch (error) {
    console.error("Report comment error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};