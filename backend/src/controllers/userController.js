import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

export default class UserController {
  async registerUser(req, res) {
    try {
      const data = { ...req.body };
      const userExist = await userModel.findOne({
        where: {
          email: data.email,
        },
      });

      if (userExist)
        res.json({
          success: false,
          message: "User already Exists, Please Login!!",
        });
      else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(data.password, salt);
        data.password = hashedPassword;

        const result = await userModel.create(data);
        if (result) {
          res.status(201).json({
            success: true,
            message: "Registered Successfully!!",
          });
        }
      }
    } catch (error) {
      res.json({ success: false, message: "Registeration failed" });
    }
  }
  async login(req, res) {
    try {
      const data = { ...req.body };
      const checkUser = await userModel.findOne({
        where: {
          email: data.email,
        },
      });
      if (!checkUser)
        res.json({ success: false, message: "User Not Registerd" });
      const passwordMatch = bcrypt.compareSync(
        data.password,
        checkUser.password
      );
      if (!passwordMatch)
        res.json({ success: false, message: "Email or password is invalid" });
      const payload = {
        data: {
          name: checkUser.name,
          email: checkUser.email,
          address: checkUser.address,
        },
      };
      const expiresIn = new Date(Date.now() + 900000);
      const token = jsonwebtoken.sign(payload, process.env.JWT_SECRETE, {
        expiresIn: "15m",
      });

      //setting http only browser cookie

      res

        .cookie("jwt", `${token}`, {
          expires: expiresIn,
          domain: "localhost",
          httpOnly: true,
        })
        .send({
          success: true,
          message: "Login success",
        });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }
}
