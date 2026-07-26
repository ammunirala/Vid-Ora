import Download from "../Modals/download.js";
import User from "../Modals/auth.js";
import Video from "../Modals/video.js";

const getTodayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

const getDailyLimit = (user) => {
  const plan = user.plan || "free";

  if (plan === "premium") {
    return user.dailyDownloadLimit || 10;
  }

  return 1;
};

export const downloadVideo = async (req, res) => {
  try {
    const { userid, videoid } = req.body;

    if (!userid || !videoid) {
      return res.status(400).json({
        allowed: false,
        message: "User ID and Video ID are required",
      });
    }

    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({
        allowed: false,
        message: "User not found",
      });
    }

    const video = await Video.findById(videoid);

    if (!video) {
      return res.status(404).json({
        allowed: false,
        message: "Video not found",
      });
    }

    const { startOfDay, endOfDay } = getTodayRange();

    const todayDownloads = await Download.countDocuments({
      userid,
      downloadedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const plan = user.plan || "free";
    const dailyLimit = getDailyLimit(user);

    if (todayDownloads >= dailyLimit) {
      return res.status(403).json({
        allowed: false,
        plan,
        dailyLimit,
        todayDownloads,
        remainingDownloads: 0,
        message:
          plan === "free"
            ? "Free users can download only 1 video per day."
            : `Your daily download limit of ${dailyLimit} videos has been reached.`,
      });
    }

    const download = await Download.create({
      userid: user._id,
      videoid: video._id,
      userPlan: plan,
      downloadedAt: new Date(),
    });

    return res.status(200).json({
      allowed: true,
      message: "Download allowed",
      plan,
      dailyLimit,
      todayDownloads: todayDownloads + 1,
      remainingDownloads: Math.max(
        dailyLimit - todayDownloads - 1,
        0
      ),
      download,
      video: {
        _id: video._id,
        videotitle: video.videotitle,
        filename: video.filename,
        filepath: video.filepath,
        filetype: video.filetype,
        filesize: video.filesize,
        videochanel: video.videochanel,
      },
    });
  } catch (error) {
    console.error("Download error:", error);

    return res.status(500).json({
      allowed: false,
      message: "Something went wrong",
    });
  }
};

export const getUserDownloads = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const downloads = await Download.find({ userid })
      .populate(
        "videoid",
        "videotitle filename filepath filetype filesize videochanel uploader createdAt"
      )
      .sort({ downloadedAt: -1 });

    return res.status(200).json({
      totalDownloads: downloads.length,
      downloads,
    });
  } catch (error) {
    console.error("Get downloads error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getDownloadStatus = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { startOfDay, endOfDay } = getTodayRange();

    const todayDownloads = await Download.countDocuments({
      userid,
      downloadedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const totalDownloads = await Download.countDocuments({
      userid,
    });

    const plan = user.plan || "free";
    const dailyLimit = getDailyLimit(user);

    return res.status(200).json({
      plan,
      dailyLimit,
      todayDownloads,
      totalDownloads,
      remainingDownloads: Math.max(
        dailyLimit - todayDownloads,
        0
      ),
      canDownload: todayDownloads < dailyLimit,
    });
  } catch (error) {
    console.error("Download status error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};