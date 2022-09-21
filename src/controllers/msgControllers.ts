import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Chat from "../models/Chat";
import Message from "../models/Message";
const User = require("../models/User")

exports.sendMessage = async(req : Request, res : Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(422).json({errors : errors.array()})
  }
  const {content, chatId, userID} = req.body;
  try{
    let msg = new Message({
      sender : userID,
      content : content,
      chat : chatId
    });
    await msg.save();
    msg = await msg.populate("sender", "-password");
    msg = await msg.populate("chat");
    msg = await User.populate(msg, {
      path : "chat.members",
      select : "-password"
    })

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage : msg
    })

    res.status(200).json(msg);
  }catch(err){
    console.log(err);
    res.status(500).send("ISE");
  }
}

exports.getAllMessages = async(req : Request, res : Response) => {
  try{
    const messages = await Message.find({chat : req.params.chatId})
    .populate("sender", "-password")
    .populate("chat");
    res.status(200).json(messages);
  }catch(err){
    console.log(err);
    res.status(500).send("ISE");
  }
}