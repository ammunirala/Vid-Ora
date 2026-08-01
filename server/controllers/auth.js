import mongoose from "mongoose";
import users from "../Modals/Auth.js";

export const login = async (req, res) => {
  const { email, name, image } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({ email, name, image });
      return res.status(201).json({ result: newUser });
    } else {
      return res.status(200).json({ result: existingUser });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(500).json({ message: "User unavailable..." });
  }

  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname,
          description,
        },
      },
      { new: true }
    );

    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const upgradePlan = async (req, res) => {
  try {
    const { userId, plan } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({
        message: "User ID and Plan are required",
      });
    }

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let updateData = {
      plan,
      planStartDate: new Date(),
      planExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    switch (plan) {
      case "bronze":
        updateData.dailyDownloadLimit = 10;
        updateData.watchTimeLimit = 0;
        updateData.adFree = true;
        updateData.premiumAccess = true;
        break;

      case "silver":
        updateData.dailyDownloadLimit = 25;
        updateData.watchTimeLimit = 0;
        updateData.adFree = true;
        updateData.premiumAccess = true;
        break;

      case "gold":
        updateData.dailyDownloadLimit = 9999;
        updateData.watchTimeLimit = 0;
        updateData.adFree = true;
        updateData.premiumAccess = true;
        break;

      default:
        updateData.plan = "free";
        updateData.dailyDownloadLimit = 1;
        updateData.watchTimeLimit = 30;
        updateData.adFree = false;
        updateData.premiumAccess = false;
        updateData.planStartDate = null;
        updateData.planExpiryDate = null;
    }

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};