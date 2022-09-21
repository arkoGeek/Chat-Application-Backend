import {Router} from "express";
const authController = require("../controllers/authControllers");
import {check} from "express-validator"

const router : Router = Router();

router.post("/signup",[
  check("username", "Please give a proper username").trim().notEmpty(),
  check("email", "Please provide an email").trim().isEmail(),
  check("password", "Please provide a proper password").trim().isLength({min : 8})
], authController.signup);

router.post("/login",[
  check("email", "Please provide an email").trim().isEmail(),
  check("password", "Please provide a proper password").trim().isLength({min : 8})
], authController.login);

module.exports = router;