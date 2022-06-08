interface Props {
  online?: boolean
  name?: string
}
function ChatHead({ online, name }: Props) {
  return (
    <div className='w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center relative'>
      {online && (
        <span className='absolute bottom-0.5 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></span>
      )}
      {name?.charAt(0).toUpperCase() ?? "?"}
    </div>
  )
}
export default ChatHead
