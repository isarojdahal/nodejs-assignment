import Link from "next/link"
import ChatHead from "../../components/ChatHead"
import ChatList from "../../components/ChatList"
import { MdExitToApp, MdClose } from "react-icons/md"
import { useSidebarContext } from "../../context/SidebarContext"
import { useUserContext } from "../../context/UserContext"
import { logout } from "../../api/API"
import { useSocketContext } from "../../context/SocketContext"
import { useRouter } from "next/router"

interface Props {}
function Sidebar({}: Props) {
  const sidebarCxt = useSidebarContext()
  const userCxt = useUserContext()
  const socketCxt = useSocketContext()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error: any) {
      console.error(error.message)
    } finally {
      sidebarCxt?.handleOpen()
      socketCxt?.socket.close()
      userCxt?.setUser(null)

      localStorage.removeItem("auth_manager")
      router.replace("/", undefined, { shallow: true })
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 lg:hidden ${
          sidebarCxt?.open ? "visible" : "invisible"
        }`}
      ></div>
      <aside
        className={`bg-white border-r-2 fixed top-0 left-0 bottom-0 z-50  lg:static transition-all duration-300 ${
          sidebarCxt?.open
            ? "visible translate-x-0"
            : "invisible -translate-x-full"
        }`}
      >
        <div className='bg-gray-50 w-80 p-4 py-2'>
          <div className='grid grid-cols-[max-content_1fr_max-content] justify-between items-center gap-x-3'>
            <Link href='/'>
              <a
                className='button-effect rounded-full'
                title={userCxt?.user?.name}
              >
                <ChatHead name={userCxt!.user!.name} />
              </a>
            </Link>
            <h2 className='text-lg font-base flex justify-center items-center'>
              Messages
            </h2>
            <div className='flex gap-3'>
              {/* logout button */}
              <button
                className='bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus-within:bg-gray-300 button-effect'
                title='logout'
                onClick={handleLogout}
              >
                <MdExitToApp size={18} />
              </button>
              {/* Sidebar Close Button */}
              <button
                className='bg-gray-200 p-2 rounded-full hover:bg-gray-300 focus-within:bg-gray-300 button-effect lg:hidden lg:pointer-events-none'
                onClick={sidebarCxt?.handleOpen}
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>
          <input
            type='text'
            placeholder='Search People'
            className='border-2 rounded-full py-1.5 w-full px-4 mt-4 placeholder:text-sm button-effect bg-gray-200 placeholder:text-gray-400'
          />
        </div>
        <ChatList />
      </aside>
    </>
  )
}
export default Sidebar
