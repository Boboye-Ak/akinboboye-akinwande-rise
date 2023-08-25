import { Sequelize } from "sequelize"

const DB_URL: string = process.env.DB_URL!

const db = new Sequelize(DB_URL, { logging: false })

export default db
