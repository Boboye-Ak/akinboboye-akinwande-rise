"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
dotenv_flow_1.default.config();
const swagger_ui_express_1 = require("swagger-ui-express");
const swaggerFile = __importStar(require("./swagger_output.json"));
const express_session_1 = __importDefault(require("express-session"));
const sequelize_1 = __importDefault(require("sequelize"));
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const local_strategy_1 = require("./auth strategies/local-strategy");
const passport_1 = __importDefault(require("passport"));
const PORT = process.env.PORT;
const USER_SESSION_SECRET = process.env.USER_SESSION_SECRET || "";
const db_1 = __importDefault(require("./connectDB/db"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const fileRouter_1 = __importDefault(require("./routers/fileRouter"));
// ConnectDB
db_1.default.authenticate()
    .then(() => {
    console.log("Database connected...");
})
    .catch((e) => {
    console.log(e);
    console.log("error connecting to the database...");
});
// Create a session store
exports.Session = db_1.default.define("session", {
    sid: {
        type: sequelize_1.default.STRING,
        primaryKey: true,
    },
    expires: sequelize_1.default.DATE,
    data: sequelize_1.default.TEXT,
});
const sessionStore = new ((0, connect_session_sequelize_1.default)(express_session_1.default.Store))({
    db: db_1.default,
    table: "session",
});
// Middleware
app.use("/doc", swagger_ui_express_1.serve, (0, swagger_ui_express_1.setup)(swaggerFile));
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: USER_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
app.use((0, cookie_parser_1.default)(USER_SESSION_SECRET));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Serialize and deserialize users
passport_1.default.serializeUser(async (user, done) => {
    return done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    return done(null, id);
});
// Configure Passport with local strategy
passport_1.default.use(local_strategy_1.localStrategy);
// Routing
app.use("/api/auth", authRouter_1.default);
app.use("/api/files", fileRouter_1.default);
// Test endpoint
app.get("/test", (req, res) => {
    res.status(200).json({ message: "hello there", status: 200, error: false });
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
exports.default = app;
