import jwt from "jsonwebtoken"
import { generateTokens } from "../helpers/tokenHandler.js"
import Token from "../models/token.model.js"

export default async function validateToken(req, res, next) {
  try {
    const token = req.headers.token
    const accessToken = req.headers.accesstoken

    if (token == null) return res.json({ message: "Token not provided" })

    const verifyResponse = jwt.verify(token, process.env.JWT_SECRET_KEY)
    res.username = verifyResponse.username

    await Token.destroy({
      where: {
        username: verifyResponse.username,
        accessToken,
      },
    })

    const newToken = generateTokens(verifyResponse.username)

    await Token.create({
      username: verifyResponse.username,
      accessToken: newToken.accessToken,
    })

    res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token")
    res.set("x-token", newToken.token)
    res.set("x-refresh-token", newToken.accessToken)

    next()
  } catch (error) {
    console.error(error.message)
    res.status(405).json({ message: "Token Error" })
  }
}
