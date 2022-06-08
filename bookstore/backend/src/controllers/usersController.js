import userModel from "../models/userModels.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class userController {
  async login(req, res) {
    try {
      const response = await userModel.findOne({
        where: {
          email: req.body.email,
          // email:req.body.email,
        },
      });
      console.log(req.body.email);
      //
      if (response === null)
        return res.json({ success: false, message: "User doesnot exist" });
      else {
        const match = bcrypt.compareSync(req.body.password, response.password);
        console.log(match);
        if (match) {
          //JWT

          const token = jwt.sign({ id: response.id }, process.env.JWT_SECRET, {
            expiresIn: "3600000", // 1hr.
          });

          delete response.dataValues.password;
          response.dataValues.token = token;
          res.json(response);
        } else {
          res
            .status(403)
            .json({ success: false, message: "Invalid Credentials" });
        }
      }
    } catch (err) {
      res.json(err);
    }
  }
  async signup(req, res) {
    try {
      const response = await userModel.create({ ...req.body });
      if (response === null) return res.json([]);
      else return res.json(response);
    } catch (err) {
      res.json(err);
    }
  }
}
