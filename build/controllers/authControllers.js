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
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
dotenv_1.default.config();
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const userCheck = yield User.findOne({ email: req.body.email });
        if (userCheck) {
            return res.status(401).json({ msg: "User already exists. Please log in!" });
        }
        const salt = yield bcryptjs.genSalt(10);
        const hashedPassword = yield bcryptjs.hash(req.body.password, salt);
        const userBody = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };
        const user = new User(userBody);
        yield user.save();
        const payload = { id: user._id };
        const token = yield jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ token: token });
    }
    catch (err) {
        res.status(500).json({ err: "Server not functioning" });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const userCheck = yield User.findOne({ email: req.body.email });
        if (!userCheck) {
            return res.status(401).json({ msg: "User does not exist. Please sign up." });
        }
        const compareResult = yield bcryptjs.compare(req.body.password, userCheck.password);
        if (!compareResult) {
            return res.status(401).json({ msg: "Password is wrong. Enter the correct one!" });
        }
        const payload = { id: userCheck._id };
        const token = yield jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ token: token });
    }
    catch (err) {
        res.status(500).json({ err: "Server not functioning" });
    }
});
