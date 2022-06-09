import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import UserProvider, { useUserContext } from "../context/UserContext"
import Sidebar from "../layout/Sidebar"
import { useEffect, useRef } from "react"
import { UserType } from "../schemas"
import SidebarProvider from "../context/SidebarContext"
import SocketProvider from "../context/SocketContext"
import { useRouter } from "next/router"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider>
      <UserProvider>
        <SocketProvider>
          <AppWithContext>
            <Component {...pageProps} />
          </AppWithContext>
        </SocketProvider>
      </UserProvider>
    </SidebarProvider>
  )
}

const AppWithContext = ({ children }: { children: JSX.Element }) => {
  const router = useRouter()
  const userCxt = useUserContext()
  const callRef = useRef<boolean>(false)

  useEffect(() => {
    if (callRef.current !== false) return

    callRef.current = true
    const authFetch = localStorage.getItem("auth_manager")
    if (authFetch == null) {
      router.replace("/?auth=login", undefined, { shallow: true })
      return
    }

    const authManager: UserType = JSON.parse(authFetch)

    if (authManager.token == null) {
      router.replace("/?auth=login", undefined, { shallow: true })
      return
    }
    userCxt?.setUser(authManager)
  }, [])

  return (
    <>
      <ToastContainer pauseOnHover={false} />
      <div
        className={`w-full overflow-hidden h-screen  ${
          userCxt?.user !== null
            ? "relative grid lg:grid-cols-[max-content_1fr]"
            : ""
        }`}
      >
        {userCxt?.user !== null && <Sidebar />}
        {children}
      </div>
    </>
  )
}
export default MyApp
