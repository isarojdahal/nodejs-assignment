import jwt from "jsonwebtoken"

export function generateTokens(username, expiry = "1hr") {
  const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiry,
  })
  const accessToken = jwt.sign(
    { username },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  )
  return {
    token,
    accessToken,
  }
}
