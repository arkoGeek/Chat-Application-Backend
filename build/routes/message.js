"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const middleware = require("../middleware");
const msgControllers = require("../controllers/msgControllers");
const router = (0, express_1.Router)();
router.post("/", [middleware, [
        (0, express_validator_1.check)("content", "Please provide a content").trim().exists().notEmpty(),
        (0, express_validator_1.check)("chatId", "Please provide a proper chatId!").trim().notEmpty()
    ]], msgControllers.sendMessage);
router.get("/:chatId", middleware, msgControllers.getAllMessages);
module.exports = router;
