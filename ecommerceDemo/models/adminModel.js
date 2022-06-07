import { DataTypes } from "sequelize";
import connection from "../config/connection.js";
import bcrypt from "bcrypt"

const SALT_ROUTNDS=10;

const adminModel = connection.define(
  "admins",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        set(value){
          const hashPass=bcrypt.hashSync(value,SALT_ROUTNDS);
          this.setDataValue("password",hashPass)
        },
        allowNull:false
    },
  },
  {
    timestamps: false,
  }
);

export default adminModel;