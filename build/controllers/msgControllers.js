"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const User = require("../models/User");
exports.sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }
    const { content, chatId, userID } = req.body;
    try {
        let msg = new Message_1.default({
            sender: userID,
            content: content,
            chat: chatId
        });
        yield msg.save();
        msg = yield msg.populate("sender", "-password");
        msg = yield msg.populate("chat");
        msg = yield User.populate(msg, {
            path: "chat.members",
            select: "-password"
        });
        yield Chat_1.default.findByIdAndUpdate(chatId, {
            lastMessage: msg
        });
        res.status(200).json(msg);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("ISE");
    }
});
exports.getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.default.find({ chat: req.params.chatId })
            .populate("sender", "-password")
            .populate("chat");
        res.status(200).json(messages);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("ISE");
    }
});
