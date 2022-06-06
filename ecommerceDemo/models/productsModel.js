import { DataTypes } from "sequelize";
import connection from "../config/connection.js";


const productModel = connection.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
  },
  {
    timestamps: true,
  }
);

export default productModel;