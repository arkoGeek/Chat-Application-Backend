import mongoose from "mongoose";
const dotenv = require("dotenv");
dotenv.config()

const connection = async () => {
  try{
    const connString = process.env.DB_CONNECT;
    await mongoose.connect(connString!);
    console.log("Database connected");
  }catch(err){
    console.log("Not connected. Error : ", err);
  }
}

module.exports = connection;