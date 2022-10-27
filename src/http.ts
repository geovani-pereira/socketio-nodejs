import express from 'express'
import path from 'path'
import cors from 'cors';
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use('/chat', express.static(path.join(__dirname, "..", "public", "chat.html")));

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: '*' } });

export { httpServer, io }