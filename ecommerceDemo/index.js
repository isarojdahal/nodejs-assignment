import express from "express";
import "dotenv/config";
import cors from "cors";
import con from "./config/connection.js"
import userRouter from "./routes/userRoutes.js"
import adminRouter from "./routes/adminRoutes.js"
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use("*",(req,res)=>{
  res.send("<center>Page Not Found</center>")
})

app.use("/",userRouter);
app.use("/admin",adminRouter);

app.listen(process.env.PORT || 5000, async (req,res) => {
  console.log("Server has started");
    await con.authenticate().then(
      res=>{
        console.log("Successfully connected to DB");
        con.sync();
      }
    ).catch(
      err=>{
        console.log("Error Connecting to Database")
      }
      );
  }
);