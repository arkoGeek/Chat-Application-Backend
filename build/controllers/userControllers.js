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
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/User");
exports.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find({}, { username: 1, email: 1, _id: 0 });
        res.status(200).json({ users: users });
    }
    catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});
exports.getLoggedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield User.findById(req.body.userID)
            .select("username email -_id")
            .select("-password");
        res.status(200).json({ loggedUser: userDetails });
    }
    catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});
