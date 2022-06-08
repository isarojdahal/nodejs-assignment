import express from "express"
import jwt from "jsonwebtoken"
import AuthController from "../controllers/auth.controller.js"
import validateToken from "../middleware/validateToken.js"
const router = express.Router()
const user = new AuthController()

router.get("/check", (req, res) => {
  const { token, accessToken } = req.body
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY)

    res.status(200).json({ status: ok })
  } catch (error) {
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET_KEY)
    res.json({ status: ok })
  }
})

router.post("/login", user.loginUser.bind(user))
router.post("/signup", user.signupUser.bind(user))
router.post("/token", user.tokenUpdater.bind(user))
router.post("/logout", validateToken, user.logout.bind(user))
router.get("/:username", validateToken, user.getUser.bind(user))
export default router
