import { Dispatch, SetStateAction } from "react"

export interface LoginFormData {
  username: string
  password: string
}
export interface SignupFormData {
  name: string
  username: string
  password: string
}

export interface UserContextType {
  user: UserType | null
  setUser: Dispatch<SetStateAction<UserType | null>>
}

export interface UserType {
  name: string
  username: string
  token: string
  accessToken: string
}

export interface UserSocketType {
  name: string
  username: string
  id: string
}

export interface SidebarContextType {
  open: boolean
  handleOpen: () => void
}

export interface SocketContextType {
  socket: any
  onlineUsers: UserSocketType[] | []
  chats: [] | any
  updateChatList: () => Promise<void>
}
