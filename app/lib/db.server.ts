import { PrismaClient } from "@prisma/client";
import { z } from "zod"
import { nanoid } from 'nanoid';
import bcrypt from "bcrypt";
export const prisma = new PrismaClient();
import { signupUserInputs, loginInputs } from "~/lib/validation"


export const createUser = async (data: z.infer<typeof signupUserInputs>) => {
    const validationData = signupUserInputs.parse(data)
    const { name, email, username, password } = validationData;
    try {
        const emailExist = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        const usernameExist = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (emailExist && usernameExist) {
            throw new Error("Email or username already exist")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const createUser = await prisma.user.create({
            data: {
                id: nanoid(),
                name: name,
                email: email,
                username: username,
                hashPassword: hashedPassword
            }
        })
        const { hashPassword: p, ...returnWithoutPassword } = createUser;
        p
        return returnWithoutPassword;
    } catch (error) {
        console.log("got error creating new user", error)
        throw error
    }
}

export const verifyLogin = async (data: z.infer<typeof loginInputs>) => {
    const validateUser = loginInputs.parse(data)
    const { email, password } = validateUser;
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!findUser) {
            throw new Error("NO user found")
        }
        const verifyPassword = await bcrypt.compare(password, findUser.hashPassword)
        if (!verifyPassword) {
            throw new Error("Password didn't mach")
        }

        return {
            id: findUser.id,
            username: findUser.username
        }
    } catch (error) {
        console.log("got error verifying user", error)
        throw error
    }
}

export const getUserById = async (id: string) => {
    if (!id) {
        throw new Error("No Id found")
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                createdAt: true
            }
        })
        if (!user) {
            throw new Error("No such user is found")
        }
        return user;
    } catch (error) {
        console.log("got error getting user", error)
        throw error
    }
}

export const getUserFriends = async (userID: string) => {
    try {
        if (!userID) {
            throw new Error("No id found")
        }
        const usersFriends = await prisma.friendship.findMany({
            where: {
                // conditional fetching
                AND: [
                    {
                        OR: [
                            { senderId: userID },
                            { receiverId: userID }
                        ],
                    },
                    { status: "ACCEPTED" }
                ]
            }, include: {
                sender: {
                    select: {
                        name: true,
                        id: true,
                        username: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                }
            }
        })

        const friends = usersFriends.map((friendship) => {
            return friendship.senderId === userID ? friendship.receiver : friendship.sender;
        })
        return friends;
    } catch (error) {
        console.log("got error getting user friends", error)
        throw error;
    }
}

//getting the chat between friend and current user
export const getDirectChatMessages = async (currentUserId: string, friendId: string) => {
    if (!currentUserId || !friendId) {
        throw new Error("Both user IDs are required");
    }
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUserId, receiverId: friendId },
                    { receiverId: friendId, senderId: currentUserId }
                ]
            }
            ,
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return messages
    } catch (error) {
        console.log("got error getting user chats", error);
        throw error;
    }
}

//ideas is to get list of people to in chat app accept user's not friends
//app currentUserId in action in dashboard
// ...existing code...
//ideas is to get list of people to in chat app accept user's not friends
//app currentUserId in action in dashboard
export const getAllUsers = async (currentUserId: string) => {
    try {
        // First get all friend IDs of the current user
        const friendships = await prisma.friendship.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { senderId: currentUserId },
                            { receiverId: currentUserId }
                        ]
                    },
                    { status: "ACCEPTED" }
                ]
            },
            select: {
                senderId: true,
                receiverId: true
            }
        });

        // Extract friend IDs
        const friendIds = friendships.map(friendship =>
            friendship.senderId === currentUserId ? friendship.receiverId : friendship.senderId
        );

        const users = await prisma.user.findMany({
            where: {
                NOT: {
                    OR: [
                        { id: currentUserId }, // Exclude current user
                        { id: { in: friendIds } } // Exclude existing friends
                    ]
                }
            },
            select: {
                id: true,
                username: true,
                name: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return users;
    } catch (error) {
        console.log("got an error while fetching all the users", error)
        throw error;
    }
}

export async function sendFriendRequest(senderId: string, receiverId: string) {
    try {
        const existingFriendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        })

        if (existingFriendship) throw new Error("Friendship request already exist")

        return await prisma.friendship.create({
            data: {
                senderId,
                receiverId,
                status: "PENDING"
            }, include: {
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        name: true
                    }
                }
            }
        })
    } catch (error) {
        console.log("Error sending friend request", error)
        throw error
    }
}

export async function acceptFriendRequest() {
    try {

    } catch (error) {

    }
}
export async function rejectFriendRequest() {
    try {

    } catch (error) {

    }
}
export async function getPendingFriendRequest() {
    try {

    } catch (error) {

    }
}

