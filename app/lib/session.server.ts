import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("No session secret found")
}
const storage = createCookieSessionStorage({
    cookie: {
        name: "chat_session",
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
        httpOnly: true,
    }
})

//creating cookie the moment user login or signup
export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId)
    return redirect(redirectTo, {
        headers: { "Set-Cookie": await storage.commitSession(session) }
    })
}

//getting cookie from storage to verify
export async function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"))
}

//this is to get the userId in session 
export async function getUserId(request: Request): Promise<string | null> {
    const session = await getUserSession(request)
    const userId = session.get("userId")
    if (!userId || typeof userId !== "string") return null
    return userId
}

//checking each route for verification
export async function requireUserId(request: Request,
    redirectTo: string = "/login"
): Promise<string> {
    const userId = await getUserId(request)
    if (!userId) {
        const searchParams = new URLSearchParams([
            ["redirectTo", new URL(request.url).pathname]
        ])
        throw redirect(`${redirectTo}?${searchParams}`)
    }
    return userId
}


//
export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return null


    try {
        const { getUserById } = await import("~/lib/db.server")
        return getUserById(userId)
    } catch (error) {
        throw await logout(request)
    }
}

//normal logout
export async function logout(request: Request) {
    const session = await getUserSession(request)
    return redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session)
        }
    })
}