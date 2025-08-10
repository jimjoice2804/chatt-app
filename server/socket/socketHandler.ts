import { Server, Socket } from 'socket.io';
import { saveMessage } from '~/lib/db.server';

interface User {
    id: string;
    username: string;
    room?: string;
}

// Track connected users
const users: Map<string, User> = new Map();

export const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`New connection: ${socket.id}`);

        socket.on('register', ({ userId, username }: { userId: string, username: string }) => {
            users.set(socket.id, { id: userId, username });
            console.log(`User registered: ${username} (${userId})`);
            io.emit('onlineUsers', Array.from(users.values()));
        });


        socket.on('sendDirectMessage', async ({
            receiverId,
            text
        }: {
            receiverId: string,
            text: string
        }) => {
            const sender = users.get(socket.id)
            if (!sender) throw new Error("No sender id")
            try {
                const message = await saveMessage(sender.id, receiverId, text)
                socket.emit('directMessage', message)

                const receiverSocketId = findSocketByUserId(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('directMessage', message);
                }
            } catch (error) {
                console.error('Error saving direct message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        })

        // Handle disconnection
        socket.on('disconnect', () => {
            const user = users.get(socket.id);
            if (user) {
                console.log(`User disconnected: ${user.username}`);

                users.delete(socket.id);
                io.emit('userList', Array.from(users.values()));
            }
        });
    });
};

const findSocketByUserId = (userId: string): string | undefined => {
    for (const [socketId, user] of users.entries()) {
        if (user.id === userId) {
            return socketId;
        }
    }
    return undefined;
};