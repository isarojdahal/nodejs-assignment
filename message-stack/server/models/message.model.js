import { DataTypes } from "sequelize"
import sequelize from "../config/db.js"
import Users from "./auth.model.js"
export const Chat = sequelize.define(
  "Chat",
  {
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { updatedAt: false }
)

const Message = sequelize.define(
  "Message",
  {
    userone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usertwo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
)

export default Message
