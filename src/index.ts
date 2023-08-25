import dotenv from "dotenv-flow"
dotenv.config()
import { serve, setup } from "swagger-ui-express"
import * as swaggerFile from "./swagger_output.json"
import session from "express-session"
import Sequelize from "sequelize"
import SequelizeStore from "connect-session-sequelize"
import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import cors from "cors"
import { localStrategy } from "./auth strategies/local-strategy"
import passport from "passport"
const PORT = process.env.PORT
const USER_SESSION_SECRET = process.env.USER_SESSION_SECRET || ""
import db from "./connectDB/db"
import authRouter from "./routers/authRouter"
import fileRouter from "./routers/fileRouter"

// ConnectDB
db.authenticate()
    .then(() => {
        console.log("Database connected...")
    })
    .catch((e) => {
        console.log(e)
        console.log("error connecting to the database...")
    })

// Create a session store
export const Session = db.define("session", {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.TEXT,
})

const sessionStore = new (SequelizeStore(session.Store))({
    db: db,
    table: "session",
})

const app = express()

// Middleware
app.use("/doc", serve, setup(swaggerFile))
app.use(
    cors({
        //origin: FRONTEND_URL, // Update with your frontend URL
        credentials: true,
    }),
)
app.use(express.json())

app.use(
    session({
        secret: USER_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    }),
)
app.use(cookieParser(USER_SESSION_SECRET))

app.use(passport.initialize())
app.use(passport.session())

// Serialize and deserialize users
passport.serializeUser(async (user: any, done) => {
    return done(null, user.id)
})

passport.deserializeUser(async (id: number, done) => {
    return done(null, id)
})

// Configure Passport with local strategy
passport.use(localStrategy)

// Routing
app.use("/auth", authRouter)
app.use("/files", fileRouter)

// Test endpoint
app.get("/", (req: Request, res: Response) => {
    // #swagger.description = 'Endpoint to test the server'
    res.status(200).json({ hello: "hello" })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

export default app
