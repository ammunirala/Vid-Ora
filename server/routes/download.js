import express from "express";
import {
  downloadVideo,
  getUserDownloads,
  getDownloadStatus,
} from "../controllers/download.js";

const router = express.Router();

router.post("/", downloadVideo);
router.get("/user/:userid", getUserDownloads);
router.get("/status/:userid", getDownloadStatus);

export default router;