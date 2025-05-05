import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';


export const authMiddleware = async (c: Context, next: Next) => {
    const token = c.req.header('token');
    if (!token) {
        c.status(401);
        return c.json({ msg: "No token provided" });
    }

    let decoded: any;
    try {
        decoded = await verify(token, c.env.SECRET_KEY);
    } catch (err) {
        c.status(401);
        return c.json({ msg: 'Invalid token' });
    }

    try {
        const userId = decoded.userId;
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userFound = await prisma.user.findUnique({
            where: {
                id : userId
            }
        })
        if (!userFound) {
            c.status(404);
            return c.json({ msg: 'User not found' });
        }

        // Attach user information to the context for further use in other routes
        c.set('authorID', userId);
        const adminSatus = (userFound.Admin === 0) ? false : true;
        c.set('Admin' , adminSatus);
        await next(); // Pass control to the next middleware or route handler
    } catch (e) {
        console.error('Error while getting user details:', e);
        c.status(500);
        return c.json({ msg: 'Error while getting user details' });
    }
};