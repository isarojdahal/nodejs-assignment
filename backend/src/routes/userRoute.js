import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";
import "../auth/Oauth.js";
import validateLogin from "../auth/verify.js"
const router = Router();
const userController = new UserController();

router.post("/register", userController.registerUser);
router.post("/login", userController.login);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/error",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    const token = req.user;
    const expiresIn = new Date(Date.now() + 900000);

    //setting http only browser cookie
    res.cookie("jwt", token, {
      expires: expiresIn,
      domain:"localhost",
      httpOnly: true,
    });

    res.redirect("http://localhost:3000/dashboard/addBook");
  }
);

router.get("/logout",validateLogin,(req,res)=>{
  res.clearCookie("connect.sid");
  res.clearCookie("jwt");
  res.status(200).json({success:true,message:"Logout success. See you again!!"})

})

export default router;
