import { Sequelize } from "sequelize"

const DB_URL: string = process.env.DB_URL!
const NODE_ENV = process.env.NODE_ENV

const db = new Sequelize(DB_URL, { logging: NODE_ENV == "test" && false })

db.sync({ force: false })
    .then(() => {
        console.log("Database synced.")
    })
    .catch((error) => {
        console.error("Error syncing database:", error)
    })

export default db
