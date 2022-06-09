import axios from "axios"
import jwtDecode from "jwt-decode"
import dayjs from "dayjs"
import { LoginFormData, SignupFormData } from "../schemas"

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const api = axios.create({ baseURL })

api.interceptors.request.use(async (req) => {
  try {
    const fetch = localStorage.getItem("auth_manager")

    if (fetch == null) return

    const auth = JSON.parse(fetch)

    req.headers!.token = auth.token
    req.headers!.accesstoken = auth.accessToken

    const decodedJWT: any = jwtDecode(auth.token)

    const isExpired = dayjs.unix(decodedJWT.exp).diff(dayjs()) < 1
    if (!isExpired) return

    if (auth.accessToken == null || auth.accessToken == "")
      throw new Error("Invalid Token")

    const {
      data: { token, accessToken },
    } = await newToken(auth.accessToken)

    localStorage.setItem(
      "auth_manager",
      JSON.stringify({ ...auth, token, accessToken })
    )

    req.headers!.token = token
    req.headers!.accesstoken = accessToken
  } catch (e: any) {
    console.error(e.message)
    if (e?.response?.status !== 403) return
    localStorage.clear()
    window.location.replace("/login")
  } finally {
    return req
  }
})

api.interceptors.response.use((res) => {
  const token = res?.headers["x-token"]
  const accessToken = res?.headers["x-refresh-token"]

  if (token == null || accessToken == null) return res

  const auth = localStorage.getItem("auth_manager")
  if (auth == null) return res
  const parsedAuth = JSON.parse(auth)

  localStorage.setItem(
    "auth_manager",
    JSON.stringify({ ...parsedAuth, token, accessToken })
  )
  return res
})

export const testToken = async (tokens: any) =>
  await api.get("auth/check", tokens)

export const login = async (formData: LoginFormData) =>
  await api.post("auth/login", formData)

export const logout = async () => await api.post("auth/logout")

export const signup = async (formData: SignupFormData) =>
  await api.post("auth/signup", formData)

export const newToken = async (accessToken: string) =>
  await api.post("auth/token", { accessToken })

export const getUser = async (username: string) =>
  await api.get(`auth/${username}`)

// message routes
export const getMessageList = async () => await api.get("messages")

export const getMessages = async (username: string) =>
  await api.get(`messages/${username}`)

export const createMessage = async (formData: any, conversationId: number) =>
  await api.post(`messages`, { ...formData, conversationId })

export const createMessageList = async (username: string) =>
  await api.post("messages/create", { username })
