import {Request, Response} from "express";
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
import dotenv from "dotenv";
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");

dotenv.config();

type userBody = {
  username : string,
  email : string,
  password : string
}

exports.signup = async(req: Request, res : Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()});
  }
  try{
    const userCheck = await User.findOne({email : req.body.email});

    if(userCheck){
      return res.status(401).json({msg : "User already exists. Please log in!"})
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    const userBody : userBody = {
      username : req.body.username,
      email : req.body.email,
      password : hashedPassword
    }

    const user = new User(userBody);
    await user.save();

    const payload = {id : user._id};

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : '12h'});
    res.status(201).json({token : token,
    id : user._id,
    username : user.username,
    email : user.email});

  }catch(err){
    res.status(500).json({err : "Server not functioning"})
  }
}

exports.login = async(req: Request, res : Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors : errors.array()});
  }
  try{
    const userCheck = await User.findOne({email : req.body.email});

    if(!userCheck){
      return res.status(401).json({msg : "User does not exist. Please sign up."});
    }

    const compareResult = await bcryptjs.compare(req.body.password, userCheck.password);
    if(!compareResult){
      return res.status(401).json({msg : "Password is wrong. Enter the correct one!"});
    }

    const payload = {id : userCheck._id};

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : '12h'});
    res.status(201).json({token : token,
      id : userCheck._id,
      username : userCheck.username,
      email : userCheck.email});

  }catch(err){
    res.status(500).json({err : "Server not functioning"})
  }
}