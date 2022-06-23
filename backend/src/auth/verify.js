export default function validateLogin (req, res, next){
    const token = req.cookies.jwt;
    token ? next() : res.json({ success: false, message: "Token Expired" });
  };