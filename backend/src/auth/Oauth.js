import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import "dotenv/config";
import userModel from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/user/auth/google/callback",
    },
   async function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        const {name,email} =profile._json;
       const checkUserInDb= await userModel.findOne({where:{
          email:email
        }});
        if(checkUserInDb){
          const payload = {
            data: {
              name: checkUserInDb.name,
              email: checkUserInDb.email,
            }
          };
          const token = jsonwebtoken.sign(payload, process.env.JWT_SECRETE, {
            expiresIn: "30m",
          });
       
          return cb(null, token);
        }
        else{
          return cb(null, null);
        }
      // await userModel.create({name,email});
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  cb(null, user);
});
