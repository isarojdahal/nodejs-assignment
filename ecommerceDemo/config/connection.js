import { Sequelize } from "sequelize";
import "dotenv/config";

const con = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 10000,
    },
  }
);
 
// con.authenticate().then(
//   res=>{
//     console.log("Successfully connected to DB");
//     con.sync();
//   }
// ).catch(
//   err=>{
//     console.log("Error Connecting to Database")
//   }
// );

export default con;