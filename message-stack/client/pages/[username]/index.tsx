import Head from "next/head"
import { useRouter } from "next/router"
import Chat from "../../components/Chat"
import ChatHead from "../../components/ChatHead"
import { IoPaperPlane } from "react-icons/io5"
import { MdMenu } from "react-icons/md"
import { useSidebarContext } from "../../context/SidebarContext"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useSocketContext } from "../../context/SocketContext"
import { useUserContext } from "../../context/UserContext"
import {
  createMessage,
  createMessageList,
  getMessageList,
  getMessages,
  getUser,
} from "../../api/API"
import { toast } from "react-toastify"

interface Props {}
function Conversation({}: Props) {
  const router = useRouter()
  const userCxt = useUserContext()
  const sidebarCxt = useSidebarContext()
  const socketCxt = useSocketContext()
  const [online, setOnline] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any>([])
  const [enteredMessage, setEnteredMessage] = useState<string>("")

  const callRef = useRef<boolean>(false)

  const fetchMessages = async () => {
    try {
      const { data } = await getMessages(user?.username)

      if (Array.isArray(data) === false) {
        setMessages([])
        return
      }

      setMessages(data)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    if (router.isReady == false) return
    if (socketCxt?.socket == null) return

    getUser(router.query.username as string)
      .then((res) => res.data)
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err.message)
        setUser(null)
        router.replace("/", undefined, { shallow: true })
      })
      .then(() => {
        setOnline({
          status: socketCxt.onlineUsers.some(
            (user) => user.username === router.query.username
          ),
        })
      })
      .then(() => {
        fetchMessages()
      })

    return () => {
      setMessages([])
      setOnline(false)
    }
  }, [router.isReady, router.pathname, socketCxt])

  useEffect(() => {
    if (socketCxt == null) return
    if (callRef.current != false) return

    callRef.current = true

    socketCxt.socket?.on(
      "receive-message",
      (message: string, senderId: string) => {
        setMessages((prev: any) => [
          ...prev,
          {
            message,
            createdAt: new Date().toISOString(),
            senderId,
          },
        ])
      }
    )
  }, [socketCxt])

  const createConversation = async () => {
    try {
      await createMessageList(user?.username)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const findConversation = () => {
    return socketCxt?.chats.find((chat: any) => chat.username === user.username)
  }

  const getConversationId = async () => {
    try {
      let result = findConversation()

      if (result == null) {
        await createConversation()
        await socketCxt?.updateChatList()
        result = findConversation()
        const userOnline = socketCxt?.onlineUsers.find(
          (online) => online.username === user.username
        )

        if (userOnline != null) {
          socketCxt?.socket.emit("message-call", userOnline?.id)
        }
      }

      return result.messageId
    } catch (error: any) {
      console.error(error.message)
    }
  }

  const sendMessage = async (e: FormEvent) => {
    try {
      e.preventDefault()
      if (enteredMessage === "") {
        toast("Enter message")
        return
      }
      const conversationId = await getConversationId()

      const userOnline = socketCxt?.onlineUsers.find(
        (online) => online.username === user.username
      )

      if (userOnline != null) {
        socketCxt?.socket.emit(
          "send-message",
          enteredMessage,
          userOnline.id,
          userCxt?.user?.username
        )
      }

      const { data } = await createMessage(
        { senderId: userCxt?.user?.username, message: enteredMessage },
        conversationId
      )

      setMessages((prev: any) => [...prev, data])
      setEnteredMessage("")
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <>
      <Head>
        <title>{user?.name ?? ""} | Message</title>
      </Head>
      <section className='grid grid-rows-[max-content_1fr_max-content] overflow-hidden'>
        <header className='border-b-2 py-2 px-4 bg-white flex gap-4 items-center'>
          <button
            className='button-effect px-2 py-2 bg-gray-200 rounded-md focus-within:bg-gray-300 lg:pointer-events-none lg:hidden'
            onClick={sidebarCxt?.handleOpen}
          >
            <MdMenu size={24} />
          </button>
          <div className='grid grid-cols-[max-content_max-content] items-center gap-x-3'>
            <ChatHead online={online?.status} name={user?.name} />
            <div>
              <h2 className='text-base'>{user?.name}</h2>
              <p className='text-gray-400 text-sm'>{user?.username}</p>
            </div>
          </div>
        </header>

        {/* chat body */}
        <div className='overflow-auto'>
          <div className='overflow-x-hidden'>
            <div className='p-4 grid grid-cols-2 gap-y-4'>
              {messages?.length !== 0 ? (
                messages?.map((message: any, index: number) => (
                  <Chat
                    key={index}
                    {...message}
                    other={user?.username === message?.senderId}
                  />
                ))
              ) : (
                <div className='w-full px-6 py-4 col-span-2'>
                  <p className='text-center text-xl font-bold text-gray-300'>
                    Let's Start Chat
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Input System */}
        <div className='bg-white py-2 px-3'>
          <form className='flex gap-2' onSubmit={sendMessage}>
            <input
              type='text'
              value={enteredMessage}
              onChange={(e) => setEnteredMessage(e.target.value)}
              placeholder='Type message here...'
              className='py-2 rounded-xl px-4 w-full bg-gray-200 placeholder:text-gray-400 text-gray-800 outline-none focus-within:ring-1 focus-within:ring-gray-600/30'
            />
            <button
              type='submit'
              className='bg-gray-200 px-4 rounded-xl outline-none focus-within:ring-1 focus-within:ring-gray-600/30'
            >
              <IoPaperPlane size={20} />
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
export default Conversation
