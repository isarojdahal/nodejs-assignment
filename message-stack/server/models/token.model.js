import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"

const token = sequelize.define(
  "token",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    updatedAt: false,
  }
)

export default token
