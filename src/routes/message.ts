import { Router } from "express";
import { check } from "express-validator";
const middleware = require("../middleware");
const msgControllers = require("../controllers/msgControllers")

const router = Router();

router.post("/", [middleware, [
  check("content", "Please provide a content").trim().exists().notEmpty(),
  check("chatId", "Please provide a proper chatId!").trim().notEmpty()
]], msgControllers.sendMessage);

router.get("/:chatId", middleware, msgControllers.getAllMessages);

module.exports = router;