import express from "express"
import { createServer } from "http"
import cors from "cors"
import { Server } from "socket.io"

import authRoute from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import dbConnection from "./config/db.js"

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
let onlineUsers = []

const updateOnlineUsers = (userData) => {
  onlineUsers.push(userData)
}

const removeOfflineUser = (userId) => {
  onlineUsers = onlineUsers.filter((user) => user.id !== userId)
}

// io.use((socket, next) => {})

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // removing the offline user and broadcast remain online users
    removeOfflineUser(socket.id)
    io.emit("onlineUsers", onlineUsers)
  })

  // Adding the users to online array
  socket.on("userDetails", (name, username) => {
    updateOnlineUsers({ name, username, id: socket.id })
    io.emit("onlineUsers", onlineUsers)
  })

  socket.on("send-message", (message, socketId, senderId) => {
    io.to(socketId).emit("receive-message", message, senderId)
  })

  socket.on("message-call", (socketId) => {
    io.to(socketId).emit("message-create")
  })
})

app.get("/", (req, res) => {
  res.json({ message: "Hi" })
})

// routes
app.use("/auth", authRoute)
app.use("/messages", messageRoute)

// listening the app
server.listen(8000, async () => {
  try {
    await dbConnection.authenticate()
    dbConnection.sync()
  } catch (error) {
    console.error(error.message)
  }
})
