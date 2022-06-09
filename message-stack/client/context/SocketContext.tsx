import { createContext, useContext, useEffect, useRef, useState } from "react"
import { SocketContextType, UserSocketType } from "../schemas"
import { useUserContext } from "./UserContext"
import { io } from "socket.io-client"
import { getMessageList } from "../api/API"
import { useRouter } from "next/router"

const SocketContext = createContext<null | SocketContextType>(null)

export const useSocketContext = () => useContext(SocketContext)

interface SocketProps {
  children: JSX.Element
}

export default function SocketProvider({ children }: SocketProps) {
  const router = useRouter()
  const userCxt = useUserContext()
  const [socket, setIO] = useState<any>()
  const [onlineUsers, setOnlineUsers] = useState<[] | UserSocketType[]>([])
  const [chats, setChats] = useState<[] | any>([])

  useEffect(() => {
    if (userCxt?.user === null) return

    setIO(
      io("http://localhost:8000", {
        extraHeaders: {
          token: userCxt!.user!.token,
        },
      })
    )
  }, [userCxt?.user])

  useEffect(() => {
    if (socket == null) return

    socket.on("onlineUsers", (users: any) => {
      setOnlineUsers(
        users.filter(
          (user: UserSocketType) =>
            socket.id !== user.id && userCxt?.user?.username !== user.username
        )
      )
    })

    socket.emit("userDetails", userCxt?.user?.name, userCxt?.user?.username)

    return () => {
      if (socket != null) socket.close()
    }
  }, [socket])

  const updateChatList = async () => {
    try {
      const { data } = await getMessageList()

      setChats(data)
    } catch (error: any) {
      console.error(error)
      setChats([])

      if (error?.response?.status !== 405) return

      localStorage.clear()
      router.replace("/", undefined, { shallow: true })
      userCxt?.setUser(null)
    }
  }

  useEffect(() => {
    if (userCxt == null) return
    if (userCxt.user?.token == null) return

    updateChatList()

    socket?.on("message-create", async () => {
      await updateChatList()
    })
  }, [userCxt, socket])

  return (
    <SocketContext.Provider
      value={{ socket, onlineUsers, chats, updateChatList }}
    >
      {children}
    </SocketContext.Provider>
  )
}
