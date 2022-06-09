import { useSocketContext } from "../../context/SocketContext"
import ChatCard from "../ChatCard"

interface Props {}
function ChatList({}: Props) {
  const socketCxt = useSocketContext()

  return (
    <div className='py-2 px-4'>
      {socketCxt?.chats?.length !== 0 ? (
        <>
          {socketCxt?.chats?.map((chat: any) => (
            <ChatCard key={chat.messageId} {...chat} />
          ))}
        </>
      ) : (
        <p className='text-gray-400 text-sm font-normal px-4'>
          No Message Found
        </p>
      )}
    </div>
  )
}
export default ChatList
