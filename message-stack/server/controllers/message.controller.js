import { Op } from "sequelize"
import Message, { Chat } from "../models/message.model.js"
import User from "../models/auth.model.js"
import Users from "../models/auth.model.js"
import sequelize from "sequelize"

class MessageController {
  async getMessageList(req, res) {
    try {
      const messageList = await Message.findAll({
        where: {
          [Op.or]: [
            {
              userone: res.username,
            },
            {
              usertwo: res.username,
            },
          ],
        },
      })

      // await Message.sequelize.query("SELECT * FROM ")

      if (messageList === null) {
        return res.json([])
      }

      let resWithDetails = await Promise.all(
        messageList.map(async ({ id, userone, usertwo }) => {
          const otherUser = res.username === userone ? usertwo : userone

          const otherUserDetails = await User.findOne({
            where: {
              username: otherUser,
            },
          })

          if (otherUserDetails == null) return

          return {
            messageId: id,
            username: otherUserDetails.username,
            name: otherUserDetails.name,
          }
        })
      )

      resWithDetails = resWithDetails.filter((u) => u)

      res.status(200).json(resWithDetails)
    } catch (error) {
      console.error(error.message)
      res.status(400).json({ message: "Something went Wrong" })
    }
  }

  async createMessageList(req, res) {
    try {
      const { username } = req.body
      const own = res.username

      if (username == null) {
        return res.status(404).json("Username not found")
      }

      const findExisting = await Message.findOne({
        where: {
          userone: {
            [Op.or]: [username, own],
          },
          usertwo: {
            [Op.or]: [username, own],
          },
        },
      })

      if (findExisting != null) return res.json({ status: true })
      await Message.create({ userone: own, usertwo: username })

      res.status(200).json({ status: true })
    } catch (error) {
      console.error(error.message)
      res.status(400).json({ message: "Something went Wrong" })
    }
  }

  async getMessages(req, res) {
    try {
      const { username } = req.params
      const ownUser = res.username

      if (username == null)
        return res.status(404).json({ message: "Username not found" })

      const hasMessage = await Message.findOne({
        where: {
          userone: {
            [Op.or]: [ownUser, username],
          },
          usertwo: {
            [Op.or]: [ownUser, username],
          },
        },
      })

      if (hasMessage == null)
        return res.json({
          message: "Start New Conversation",
        })

      const userMessages = await Chat.findAll({
        where: {
          conversationId: hasMessage.id,
        },
      })

      if (userMessages == null)
        return res.status(404).json({ message: "No message Found" })

      res.status(200).json(userMessages)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  async createMessage(req, res) {
    try {
      const { senderId, conversationId, message } = req.body

      if (senderId == null || conversationId == null || message == null)
        return res.status(404).json({ message: "All fields not found" })

      const generatedMessage = await Chat.create({
        senderId,
        conversationId,
        message,
      })

      res.status(200).json(generatedMessage)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default MessageController
