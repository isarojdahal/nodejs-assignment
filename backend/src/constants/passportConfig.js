import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import "dotenv/config";
import userModel from "../models/userModel.js";
const opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRETE,
};
const strategy = passport.use(
  new Strategy(opt, async function (payload, done) {
    try {
      const checked = await userModel.findOne({
        where: { email: payload.data.email },
      });
      if (checked) {
        return done(null, payload.data);
      }
      return done(null, false);
    } catch (error) {
      return done(err, null);
    }
  })
);
