import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect } from "react"

import Login from "../../components/Login"
import { useUserContext } from "../../context/UserContext"
const SignUp = dynamic(() => import("../../components/SignUp"), { ssr: false })

interface Props {}
function Auth({}: Props) {
  const userCxt = useUserContext()
  const router = useRouter()
  const { auth } = router.query

  useEffect(() => {
    if (userCxt?.user !== null) {
      router.replace("/", undefined, { shallow: true })
      return
    }

    if (!router.isReady) return

    if (auth == undefined || auth !== "signup") {
      router.push("/?auth=login")
      return
    }
  }, [router.isReady, userCxt?.user])

  // if (router.isReady == false) return null

  return (
    <>
      <div className='w-full h-screen grid place-content-center'>
        {auth === "signup" ? <SignUp /> : <Login />}
      </div>
    </>
  )
}
export default Auth
