"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const passport_1 = __importDefault(require("passport"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/signup", authController_1.signup_post);
router.post("/login", (req, res, next) => {
    // #swagger.description = 'Endpoint for users to login'
    passport_1.default.authenticate("local", (err, user, info) => {
        console.log(user);
        if (err)
            throw err;
        if (!user)
            res.status(404).json({
                message: "Could not login. Check email address and password",
                status: 404,
            });
        else {
            req.logIn(user, (err) => {
                if (err)
                    throw err;
                console.log(req.user);
                res.status(200).json({ message: "Successfully Authenticated", status: 200 });
            });
        }
    })(req, res, next);
});
router.get("/myuser", [authMiddleware_1.userRequiresAuth], authController_1.getMyUser_get);
router.post("/logout", [authMiddleware_1.userRequiresAuth], authController_1.logout_post);
exports.default = router;
