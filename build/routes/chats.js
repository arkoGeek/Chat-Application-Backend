"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const middleware = require("../middleware");
const chatControllers = require("../controllers/chatControllers");
const router = (0, express_1.Router)();
router.get("/", middleware, chatControllers.getAllChats);
router.post("/", [middleware, [
        (0, express_validator_1.check)("senderID", "Please provide a sender ID!").trim().exists().notEmpty()
    ]], chatControllers.createOrAccessChat);
router.post("/group", [middleware, [
        (0, express_validator_1.check)("members", "Please provide stringified input!").trim().isJSON(),
        (0, express_validator_1.check)("chatName", "Please provide a chatName").trim().exists().notEmpty()
    ]], chatControllers.createGroupChat);
router.put("/removeFromGroup", [middleware, [
        (0, express_validator_1.check)("chatId", "Provide a chat ID!").trim().exists().notEmpty(),
        (0, express_validator_1.check)("userId", "Please provide a proper user ID!").trim().exists().notEmpty()
    ]], chatControllers.removeFromGroup);
router.put("/addToGroup", [middleware, [
        (0, express_validator_1.check)("chatId", "Provide a chat ID!").trim().exists().notEmpty(),
        (0, express_validator_1.check)("userId", "Please provide a proper user ID!").trim().exists().notEmpty()
    ]], chatControllers.addToGroup);
module.exports = router;
