import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket/socketHandler';

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? 'https://yourproductiondomain.com'
            : 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

setupSocketHandlers(io)

const PORT = process.env.SOCKET_PORT || 3001
server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`)
})