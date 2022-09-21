import {Router} from "express";
const userControllers = require("../controllers/userControllers");
const auth = require("../middleware");
const router : Router = Router();

router.get("/", auth, userControllers.getAll);
router.get("/me", auth, userControllers.getLoggedUser);

module.exports = router;