import express from "express"
import validateToken from "../middleware/validateToken.js"
const router = express.Router()

import MessageController from "../controllers/message.controller.js"
const message = new MessageController()

router.get("/", validateToken, message.getMessageList.bind(message))
router.post("/create", validateToken, message.createMessageList.bind(message))
router.get("/:username", validateToken, message.getMessages.bind(message))
router.post("/", validateToken, message.createMessage.bind(message))

export default router
