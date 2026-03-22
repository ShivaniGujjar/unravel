import express from 'express';
import { sendMessage, getChats, getMessages, deleteChat } from '../controllers/chat.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const chatRouter = express.Router();

chatRouter.post('/message',protect,sendMessage)

chatRouter.get('/',protect,getChats)

chatRouter.get('/:chatId/messages',protect,getMessages)

chatRouter.delete('/delete/:chatId',protect,deleteChat)

export default chatRouter