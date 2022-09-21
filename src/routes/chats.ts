import { Router } from "express";
import { check } from "express-validator";
const middleware = require("../middleware");
const chatControllers = require("../controllers/chatControllers");

const router = Router();

router.get("/", middleware, chatControllers.getAllChats);

router.post("/", [middleware, [
  check("senderID", "Please provide a sender ID!").trim().exists().notEmpty()
]], chatControllers.createOrAccessChat);

router.post("/group", [middleware, [
  check("members", "Please provide stringified input!").trim().isJSON(),
  check("chatName", "Please provide a chatName").trim().exists().notEmpty()
]], chatControllers.createGroupChat);

router.put("/removeFromGroup", [middleware, [
  check("chatId", "Provide a chat ID!").trim().exists().notEmpty(),
  check("userId", "Please provide a proper user ID!").trim().exists().notEmpty()
]], chatControllers.removeFromGroup);

router.put("/addToGroup", [middleware, [
  check("chatId", "Provide a chat ID!").trim().exists().notEmpty(),
  check("userId", "Please provide a proper user ID!").trim().exists().notEmpty()
]], chatControllers.addToGroup);

module.exports = router;