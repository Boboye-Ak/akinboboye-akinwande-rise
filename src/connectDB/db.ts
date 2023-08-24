import { Sequelize } from "sequelize"

const db = new Sequelize(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost/${process.env.DB_NAME}`,
{logging:false})

export default db
