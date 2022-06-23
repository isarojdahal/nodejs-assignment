import express from "express";
import connection from "./models/index.js";
import bookRoute from "./routes/bookRoute.js";
import userRoute from "./routes/userRoute.js";
import passport from "passport";
import "./constants/passportConfig.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials : true
 }


const app = express();
app.use(express.json());
const { SESSION_SECRETE_KEY } = process.env;
app.use(
  session({
    secret: SESSION_SECRETE_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.use(function (req, res, next) {	
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-type,Accept');   
    res.setHeader('Access-Control-Allow-Credentials', true);    
    next();
});
// app.use(cors());
app.use(express.static("public"));

app.use("/user", userRoute);
app.use("/book", bookRoute);
app.get("/",(req,res)=>{
res.send("Backend is working")
})

app.use(passport.session());
app.use(passport.initialize());
app.listen(process.env.PORT || 8000, async () => {
  console.log("Server has started 🚀");

  try {
    await connection.authenticate();
    connection.sync();
    console.log("Successfully connected to DB");
  } catch (err) {
    console.error("Error during connection to database ", err);
  }
});
