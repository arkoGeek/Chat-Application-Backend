import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Chat from "../models/Chat";
const User = require("../models/User");

exports.getAllChats = async (req: Request, res: Response) => {
  try{
    let chats = await Chat.find({
      members: { $elemMatch: { $eq: req.body.userID } },
    }).populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastMessage");
    chats = await User.populate(chats, {
      path: "lastMessage.sender",
      select: "username email",
    });
    res.status(200).json({chats})
  }catch(err){
    res.status(500).json({err})
  }
};

exports.createOrAccessChat = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { members: { $elemMatch: { $eq: req.body.userID } } },
      { members: { $elemMatch: { $eq: req.body.senderID } } },
    ],
  })
    .populate("members", "-password")
    .populate("lastMessage");

  isChat = await User.populate(isChat, {
    path: "lastMessage.sender",
    select: "username email",
  });

  if (isChat.length > 0) {
    return res.status(201).json({ chat: isChat[0] });
  } else {
    let chat = new Chat({
      chatName: "sender",
      isGroupChat: false,
      members: [req.body.userID, req.body.senderID],
    });
    try {
      await chat.save();
      const fullChat = await Chat.findById(chat._id).populate(
        "members",
        "-password"
      );
      return res.status(201).json({ fullChat });
    } catch (err) {
      console.log(err);
      res.status(500).json({msg : "ISE"});
    }
  }
};

exports.createGroupChat = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let users = JSON.parse(req.body.members);
  if(users.length < 2){
    return res.status(400).json({msg : "There should always be more than or equal to 2 added members!"});
  }
  users.push(req.body.userID);
  let groupChat = new Chat({
    chatName : req.body.chatName,
    members : users,
    isGroupChat : true,
    groupAdmin : req.body.userID
  });

  try{
    await groupChat.save();
    const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("members", "-password")
    .populate("groupAdmin", "-password")
    res.status(201).json({fullGroupChat});
  }catch(err){
    console.log(err);
    res.status(500).send("ISE")
  }
};

exports.removeFromGroup = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    req.body.chatId,
    {
      $pull : {members : req.body.userId}
    },
    {
      new :true
    }).populate("members", "-password")
    .populate("groupAdmin", "-password")

  if(!updatedChat){
    return res.status(404).json({msg : "Chat Not Found"})
  }else{
    return res.status(201).json(updatedChat)
  }
};

exports.addToGroup = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    req.body.chatId,
    {
      $push : {members : req.body.userId}
    },
    {
      new :true
    }).populate("members", "-password")
    .populate("groupAdmin", "-password")

  if(!updatedChat){
    return res.status(404).json({msg : "Chat Not Found"})
  }else{
    return res.status(201).json(updatedChat)
  }
};
