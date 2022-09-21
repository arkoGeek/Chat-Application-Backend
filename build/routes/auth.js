"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = require("../controllers/authControllers");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("/signup", [
    (0, express_validator_1.check)("username", "Please give a proper username").trim().notEmpty(),
    (0, express_validator_1.check)("email", "Please provide an email").trim().isEmail(),
    (0, express_validator_1.check)("password", "Please provide a proper password").trim().isLength({ min: 8 })
], authController.signup);
router.post("/login", [
    (0, express_validator_1.check)("email", "Please provide an email").trim().isEmail(),
    (0, express_validator_1.check)("password", "Please provide a proper password").trim().isLength({ min: 8 })
], authController.login);
module.exports = router;
