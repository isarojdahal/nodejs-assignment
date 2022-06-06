import jwt from "jsonwebtoken";
import "dotenv/config";

export default (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const isValid = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      if (isValid) next();
      else
        // return res
        //   .status(403)
        //   .json({ success: false, message: "Invalid Token" });
          res.redirect("/admin/login")

    } catch (err) {
      // return res.status(403).json(err);
      res.redirect("/admin/login")

    }
  } else
  {
    // res.status(403).json("Token not provided");
    res.redirect("/admin/login")
  } 
};
