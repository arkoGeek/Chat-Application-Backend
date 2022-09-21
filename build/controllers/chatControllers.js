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
const User = require("../models/User");
exports.getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let chats = yield Chat_1.default.find({
            members: { $elemMatch: { $eq: req.body.userID } },
        }).populate("members", "-password")
            .populate("groupAdmin", "-password")
            .populate("lastMessage");
        chats = yield User.populate(chats, {
            path: "lastMessage.sender",
            select: "username email",
        });
        res.status(200).json({ chats });
    }
    catch (err) {
        res.status(500).json({ err });
    }
});
exports.createOrAccessChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let isChat = yield Chat_1.default.find({
        isGroupChat: false,
        $and: [
            { members: { $elemMatch: { $eq: req.body.userID } } },
            { members: { $elemMatch: { $eq: req.body.senderID } } },
        ],
    })
        .populate("members", "-password")
        .populate("lastMessage");
    isChat = yield User.populate(isChat, {
        path: "lastMessage.sender",
        select: "username email",
    });
    if (isChat.length > 0) {
        return res.status(201).json({ chat: isChat[0] });
    }
    else {
        let chat = new Chat_1.default({
            chatName: "sender",
            isGroupChat: false,
            members: [req.body.userID, req.body.senderID],
        });
        try {
            yield chat.save();
            const fullChat = yield Chat_1.default.findById(chat._id).populate("members", "-password");
            return res.status(201).json({ fullChat });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "ISE" });
        }
    }
});
exports.createGroupChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let users = JSON.parse(req.body.members);
    if (users.length < 2) {
        return res.status(400).json({ msg: "There should always be more than or equal to 2 added members!" });
    }
    users.push(req.body.userID);
    let groupChat = new Chat_1.default({
        chatName: req.body.chatName,
        members: users,
        isGroupChat: true,
        groupAdmin: req.body.userID
    });
    try {
        yield groupChat.save();
        const fullGroupChat = yield Chat_1.default.findById(groupChat._id)
            .populate("members", "-password")
            .populate("groupAdmin", "-password");
        res.status(201).json({ fullGroupChat });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("ISE");
    }
});
exports.removeFromGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const updatedChat = yield Chat_1.default.findByIdAndUpdate(req.body.chatId, {
        $pull: { members: req.body.userId }
    }, {
        new: true
    }).populate("members", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        return res.status(404).json({ msg: "Chat Not Found" });
    }
    else {
        return res.status(201).json(updatedChat);
    }
});
exports.addToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const updatedChat = yield Chat_1.default.findByIdAndUpdate(req.body.chatId, {
        $push: { members: req.body.userId }
    }, {
        new: true
    }).populate("members", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        return res.status(404).json({ msg: "Chat Not Found" });
    }
    else {
        return res.status(201).json(updatedChat);
    }
});
