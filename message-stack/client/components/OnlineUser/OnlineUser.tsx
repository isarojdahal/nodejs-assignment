import Link from "next/link"

interface Props {
  name?: string
  username?: string
}
function OnlineUser({ name, username }: Props) {
  return (
    <Link href={`/${username}`}>
      <a className='px-4 py-2 border-b border-b-gray-600/30 w-full button-effect text-center'>
        {name}
      </a>
    </Link>
  )
}
export default OnlineUser
