import { MdMenu } from "react-icons/md"
import { useSidebarContext } from "../../context/SidebarContext"
import { useSocketContext } from "../../context/SocketContext"
import OnlineUser from "../OnlineUser"

interface Props {}
function BlankMessage({}: Props) {
  const sidebarCxt = useSidebarContext()
  const socketCxt = useSocketContext()

  return (
    <div className='w-full h-full bg-gray-300 flex items-center justify-center p-4 text-center'>
      <div className='flex flex-col gap-5 items-center'>
        <button
          className='lg:hidden lg:pointer-events-none px-4 py-2 bg-gray-200 rounded-md button-effect w-fit font-medium text-gray-600'
          onClick={sidebarCxt?.handleOpen}
          type='button'
          title='open sidebar'
        >
          <MdMenu />
        </button>
        <p className='text-2xl font-medium text-gray-400/70  tracking-wide select-none'>
          Select a chat or start new conversation
        </p>
        <section className='rounded-md bg-gray-200 w-full max-w-xl'>
          <header className='border-b border-b-gray-400/20 py-2 px-4 flex'>
            <h2 className='text-base text-gray-600 font-semibold'>
              Online Users
            </h2>
          </header>
          <div className='flex flex-col items-start'>
            {socketCxt?.onlineUsers.length !== 0 ? (
              socketCxt?.onlineUsers.map((user, index) => (
                <OnlineUser key={index} {...user} />
              ))
            ) : (
              <p className='py-2 px-4 flex text-sm text-gray-400'>
                No Online Users
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
export default BlankMessage
