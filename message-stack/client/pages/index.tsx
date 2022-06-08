import type { NextPage } from "next"
import Head from "next/head"
import { useUserContext } from "../context/UserContext"

import Auth from "../layout/Auth"
import BlankMessage from "../components/BlankMessage"
import { useEffect, useRef } from "react"
import { useRouter } from "next/router"

const Home: NextPage = () => {
  const userCxt = useUserContext()
  const router = useRouter()

  const callRef = useRef(false)

  useEffect(() => {
    if (userCxt == null) return

    if (callRef.current !== false) return
    callRef.current = true

    router.replace("/", undefined, { shallow: true })
  }, [userCxt])

  return (
    <>
      <Head>
        <title>Message</title>
      </Head>
      {userCxt?.user !== null ? <BlankMessage /> : <Auth />}
    </>
  )
}

export default Home
