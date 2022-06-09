import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { signup } from "../../api/API"
import { useUserContext } from "../../context/UserContext"
import { SignupFormData } from "../../schemas"
import Input from "../Input"

interface Props {}
function SignUp({}: Props) {
  const router = useRouter()
  const userCxt = useUserContext()
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    name: "",
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target!.name]: e.target!.value,
    }))
  }

  const handleSignUp = async (e: FormEvent) => {
    try {
      e.preventDefault()

      if (
        formData.username === "" ||
        formData.password === "" ||
        formData.name == ""
      )
        throw new Error("Fill All Fields")

      const { data } = await signup(formData)

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
          Sign Up
        </h1>
        <form onSubmit={handleSignUp}>
          <Input name='name' changeCallback={handleInputChange} />
          <Input name='username' changeCallback={handleInputChange} />
          <Input
            name='password'
            changeCallback={handleInputChange}
            type='password'
          />

          <button
            type='submit'
            className='mt-6 py-2 px-4 w-full text-center outline-none ring-2 ring-transparent focus:ring-blue-600/20 rounded bg-blue-900 text-white'
          >
            Signup
          </button>
        </form>
      </div>

      <Link href='/?auth=login'>
        <a className='mt-8 text-base self-center text-blue-500/90 outline-none focus-within:underline hover:underline'>
          Already have an account? Click Here
        </a>
      </Link>
    </div>
  )
}
export default SignUp
