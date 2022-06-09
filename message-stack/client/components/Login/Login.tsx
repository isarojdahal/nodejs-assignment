import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState, ChangeEvent } from "react"
import { toast } from "react-toastify"
import { login } from "../../api/API"
import { useUserContext } from "../../context/UserContext"
import { LoginFormData } from "../../schemas"
import Input from "../Input"

interface Props {}
function Login({}: Props) {
  const router = useRouter()
  const userCxt = useUserContext()
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target!.name]: e.target!.value,
    }))
  }

  const handleLogin = async (e: FormEvent) => {
    try {
      e.preventDefault()

      if (formData.username === "" || formData.password === "")
        throw new Error("Fill All Fields")

      const { data } = await login(formData)

      const { token, accessToken } = data

      if (token == null || accessToken == null) throw new Error("Invalid Login")

      localStorage.setItem("auth_manager", JSON.stringify({ ...data }))
      await router.replace("/", undefined, { shallow: true })
      userCxt?.setUser({ ...data })
    } catch (error: any) {
      const e = error?.response?.data?.message ?? error.message
      toast(e)
      console.error(e)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='bg-white p-8 rounded-md max-w-md shadow-[-0px_-1px_8px] shadow-cyan-400/60'>
        <h1 className='w-full text-center text-2xl font-bold text-blue-800 mb-6'>
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <Input name='username' changeCallback={handleInputChange} />
          <Input
            name='password'
            type='password'
            changeCallback={handleInputChange}
          />

          <button
            type='submit'
            className='mt-6 py-2 px-4 w-full text-center outline-none ring-2 ring-transparent focus:ring-blue-600/20 rounded bg-blue-900 text-white'
          >
            Login
          </button>
        </form>
      </div>

      <Link href='/?auth=signup'>
        <a className='mt-8 text-base self-center text-blue-500/90 outline-none focus-within:underline hover:underline'>
          Don't have an account? Click Here
        </a>
      </Link>
    </div>
  )
}
export default Login
