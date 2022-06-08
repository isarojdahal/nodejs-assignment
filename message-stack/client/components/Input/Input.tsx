import { ChangeEvent } from "react"

interface Props {
  name: string
  type?: string
  changeCallback: (e: ChangeEvent<HTMLInputElement>) => void
}
function Input({ name, type = "text", changeCallback, ...rest }: Props) {
  return (
    <>
      <div className='mt-4 flex flex-col'>
        <label className='text-blue-600/60'>{`${name
          .charAt(0)
          .toUpperCase()}${name.substring(1)}`}</label>
        <input
          className='border-2 py-2 px-4 rounded-md mt-1 outline-none ring-2 ring-transparent  focus:ring-blue-500/20'
          type={type}
          name={name}
          onChange={(e) => changeCallback(e)}
          {...rest}
        />
      </div>
    </>
  )
}
export default Input
