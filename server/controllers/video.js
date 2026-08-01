import video from "../Modals/video.js";

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "Please upload an MP4 video file only." });
  }

  try {
    const file = new video({
      videotitle: req.body.videotitle,
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochanel: req.body.videochanel,
      uploader: req.body.uploader,

      isPremium: req.body.isPremium === "true",
      minimumPlan: req.body.minimumPlan || "free",
      adFreeOnly: req.body.adFreeOnly === "true",
      watchTimeLimit: req.body.watchTimeLimit || 0,
    });

    await file.save();

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: file,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getallvideo = async (req, res) => {
  try {
    const files = await video.find().sort({ createdAt: -1 });

    return res.status(200).json(files);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};