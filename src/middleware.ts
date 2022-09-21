import {Request, Response, NextFunction} from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();

const auth = async (req : Request, res : Response, next : NextFunction) => {
  const token = req.headers["authorization"];
  if(!token){
    return res.status(401).json({msg : "Unauthorized"})
    //token present but method not allowed > 403, forbidden
  }
  try{
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userID = decodedData.id; 
    next();
  }catch(err){
    console.log(err);
    res.status(500).json({msg : "ISE"});
  }
}

module.exports = auth;