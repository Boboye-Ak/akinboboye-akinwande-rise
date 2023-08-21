require("dotenv").config()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const session = require("express-session")
const Sequelize = require("sequelize")
const SequelizeStore = require("connect-session-sequelize")(session.Store)
const cookieParser = require("cookie-parser")
const express = require("express")
const cors = require("cors")
const { localStrategy } = require("./auth strategies/local-strategy")
const passport = require("passport")
const PORT = process.env.PORT || 5000
const app = express()
const db = require("./connectDB/db")

const authRouter = require("./routers/authRouter")
const fileRouter = require("./routers/fileRouter")
//ConnectDB
db.authenticate()
    .then(() => { console.log("Database connected...") })
    .catch((e) => {
        console.log(e)
        console.log("error connecting to database...")
    })

    const Session = db.define('session', {
        sid: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        expires: Sequelize.DATE,
        data: Sequelize.TEXT,
    });

const sessionStore = new SequelizeStore({
    db: db,
    table: "session"
});


//Middleware
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(
    cors({
        //origin: process.env.FRONTEND_URL,
        credentials: true,
    })
)
app.use(express.json())

app.use(
    session({
        secret: process.env.USER_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
)
app.use(cookieParser(process.env.USER_SESSION_SECRET))

app.use(passport.initialize())
app.use(passport.session())

// Serialize and deserialize users
passport.serializeUser(async (user, done) => {
    console.log("serializing user")
    return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    console.log("deserializing user")
    return done(null, id)
})

// Configure Passport with local strategy
passport.use(localStrategy)

//Routing
app.use("/auth", authRouter)
app.use("/files", fileRouter)



//Test endpoint
app.get("/", (req, res) => {
    // #swagger.description = 'Endpoint to test the server'
    res.status(200).json({ hello: "hello" })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})