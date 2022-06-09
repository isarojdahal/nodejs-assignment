import "dotenv/config"
import { Sequelize } from "sequelize"

const dbConnection = new Sequelize(
  process.env.DB,
  process.env.DB_USER_NAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
)




export default dbConnection
