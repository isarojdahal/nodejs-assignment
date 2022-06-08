import bcrypt from "bcrypt"
import { generateTokens } from "../helpers/tokenHandler.js"
import Auth from "../models/auth.model.js"
import Token from "../models/token.model.js"
import jwt from "jsonwebtoken"

class AuthController {
  async loginUser(req, res) {
    try {
      const { username, password } = req.body

      if (username == null || password == null) {
        return res
          .status(403)
          .json({ message: "All Input Fields values not provided!!!" })
      }

      const hasUser = await Auth.findByPk(username)
      if (hasUser == null) {
        return res.status(403).json({ message: "User Not Exists" })
      }

      const isVerifiedPassword = await this.#verifyPassword(
        password,
        hasUser.password
      )

      if (isVerifiedPassword !== true) {
        return res.status(401).json({ message: "Invalid Credentials" })
      }

      const tokens = generateTokens(username)
      await this.#saveToken(tokens.accessToken, username)

      res.json({ ...tokens, name: hasUser.name, username })
    } catch (error) {
      console.error(error.message)
      return res.status(400).json({ message: "Something Went Wrong!" })
    }
  }

  async signupUser(req, res) {
    try {
      const { username, name, password } = req.body

      if (username == null || password == null || name == null) {
        return res
          .status(403)
          .json({ message: "All Input Fields values not provided!!!" })
      }

      const hasUser = await Auth.findByPk(username)
      if (hasUser != null) {
        return res.status(403).json({ message: "User Already Exists" })
      }

      const hashedPassword = await this.#hashPassword(password)

      await Auth.create({
        username,
        name,
        password: hashedPassword,
      })

      const tokens = generateTokens(username)
      await this.#saveToken(tokens.accessToken, username)

      res.json({ ...tokens, name, username })
    } catch (error) {
      console.error(error.message)
      return res.status(400).json({ message: "Something Went Wrong!" })
    }
  }

  async tokenUpdater(req, res) {
    try {
      const { accessToken } = req.body

      const decodeResponse = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY
      )

      const tokenRes = await Token.findOne({
        where: { username: decodeResponse.username, accessToken },
      })

      if (tokenRes == null) {
        res.status(403).json({ message: "Invalid Token" })
        return
      }

      const tokens = generateTokens(decodeResponse.username)

      await Token.destroy({
        where: { username: decodeResponse.username, accessToken },
      })

      await this.#saveToken(tokens.accessToken, decodeResponse.username)

      res.json(tokens)
    } catch (error) {
      console.error(error.message)
      return res.status(403).json({ message: "Invalid Token" })
    }
  }

  async logout(req, res) {
    try {
      const accessToken = req.headers.accesstoken

      await Token.destroy({ where: { username: res.username, accessToken } })

      await Token.destroy({
        where: {
          username: res.username,
          accessToken: res.get("x-refresh-token"),
        },
      })

      res.set("x-token", null)
      res.set("x-refresh-token", null)
      res.status(200).json({ status: true })
    } catch (error) {
      console.error(error.message)
      res.status(400).json({ message: "Something Went Wrong" })
    }
  }

  async #hashPassword(password) {
    return await bcrypt.hash(password, 12)
  }

  async getUser(req, res) {
    try {
      const { username } = req.params

      if (username == null)
        return res.status(404).json({ message: "Username not found" })

      const userResponse = await Auth.findByPk(username)

      if (userResponse == null)
        return res.status(401).json({ message: "User not found" })

      res.status(200).json({
        username: userResponse.username,
        name: userResponse.name,
      })
    } catch (error) {
      res.status(500).json({ message: error })
    }
  }

  async #verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  async #saveToken(accessToken, username) {
    await Token.create({ username, accessToken })
  }
}

export default AuthController
