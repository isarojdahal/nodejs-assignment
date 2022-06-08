import { createContext, useContext, useState } from "react"
import { UserContextType, UserType } from "../schemas"

const UserContext = createContext<null | UserContextType>(null)

export const useUserContext = () => useContext(UserContext)

interface UserProps {
  children: JSX.Element
}

export default function UserProvider({ children }: UserProps) {
  const [user, setUser] = useState<UserType | null>(null)

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
