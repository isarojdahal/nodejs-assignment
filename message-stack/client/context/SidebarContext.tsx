import { createContext, useContext, useEffect, useState } from "react"
import { SidebarContextType } from "../schemas"

const SidebarContext = createContext<null | SidebarContextType>(null)

export const useSidebarContext = () => useContext(SidebarContext)

interface SidebarProps {
  children: JSX.Element
}

export default function SidebarProvider({ children }: SidebarProps) {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener("resize", () => {
      window.innerWidth >= 1024 ? setOpen(true) : setOpen(false)
    })

    window.dispatchEvent(new Event("resize"))
  }, [])

  const handleOpen = () => {
    setOpen((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ open, handleOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}
