import { format } from "timeago.js"

interface Props {
  other?: boolean
  message: string
  createdAt: string
}
const Chat = ({ message, createdAt, other = false }: Props) => {
  return (
    <div
      className={`col-span-2 flex flex-col
    ${other ? "items-start" : "items-end"}`}
    >
      <p className='text-sm text-gray-400'>{format(createdAt)}</p>
      <p
        className={` p-2.5 rounded-md max-w-[70%] md:max-w-[60%] lg:max-w-[54%] ${
          other ? "bg-gray-200 text-gray-800" : "bg-slate-500 text-white"
        }`}
      >
        {message ?? "?"}
      </p>
    </div>
  )
}
export default Chat
