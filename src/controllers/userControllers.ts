import { Request, Response } from "express";
const User = require("../models/User");

exports.getAll = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.search
      ? { username: { $regex: req.query.search, $options: "i" } }
      : {};
    const users = await User.find(keyword).find({
      _id: { $ne: req.body.userID },
    }).select("-password");
    res.status(200).json({ users: users });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getLoggedUser = async (req: Request, res: Response) => {
  try {
    const userDetails = await User.findById(req.body.userID)
      .select("username email _id")
      .select("-password");
    res
      .status(200)
      .json({
        id: userDetails._id,
        username: userDetails.username,
        email: userDetails.email,
      });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
