import connection from "./index.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export default connection.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      set(value) {
        //console.log("value : " + value);
        const hashedPassword = bcrypt.hashSync(value, 10);

        //console.log("from end value : " + value);
        this.setDataValue("password", hashedPassword);
      },
    },
  },
  {
    timestamps: false,
  }
);
