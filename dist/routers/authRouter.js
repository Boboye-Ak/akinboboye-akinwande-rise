"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/signup", [authMiddleware_1.signupValidator], authController_1.signup_post);
router.post("/login", authController_1.login_post);
router.get("/myuser", [authMiddleware_1.userRequiresAuth], authController_1.getMyUser_get);
router.post("/logout", [authMiddleware_1.userRequiresAuth], authController_1.logout_post);
exports.default = router;
