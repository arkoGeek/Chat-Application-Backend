"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers = require("../controllers/userControllers");
const auth = require("../middleware");
const router = (0, express_1.Router)();
router.get("/", auth, userControllers.getAll);
router.get("/me", auth, userControllers.getLoggedUser);
module.exports = router;
