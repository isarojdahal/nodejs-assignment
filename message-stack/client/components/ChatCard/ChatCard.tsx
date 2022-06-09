import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSocketContext } from "../../context/SocketContext"
import ChatHead from "../ChatHead"

interface Props {
  username: string
  name: string
}
function ChatCard({ username, name }: Props) {
  const router = useRouter()
  const socketCxt = useSocketContext()
  const [currentActive, setCurrentActive] = useState<string>("")

  useEffect(() => {
    if (router.isReady === false) return

    setCurrentActive((router?.query!.username as string) ?? "")
  }, [router])

  return (
    <Link href={`/${username}`}>
      <a
        className={`grid grid-cols-[max-content_1fr] gap-x-2 items-center hover:bg-gray-100 focus-within:bg-gray-100 py-2 px-3 rounded-md button-effect ${
          currentActive === username ? "bg-gray-100" : ""
        }
      `}
      >
        <ChatHead
          online={socketCxt?.onlineUsers.some(
            (user) => user.username === username
          )}
          name={name}
        />
        <div>
          <p className='text-base font-medium text-gray-800'>{name}</p>
          <p className='text-sm text-gray-400'>{username}</p>
        </div>
      </a>
    </Link>
  )
}
export default ChatCard
