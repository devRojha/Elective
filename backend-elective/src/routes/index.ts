import { Hono } from 'hono'
import { userRouter } from './users'
import { emailRouter } from './email';
import { resourceRouter } from './resources';
import { adminRouter } from './adminRequest';

type CustomContext = {
    Variables: {
        authorID: string; // Add authorID to the context type
        authorEmail: string; // Add authorEmail to the context type
        txt: string; // Add txt to the context type
        Admin: boolean; // Add Admin to the context type
    };
};
const app = new Hono<CustomContext & {
    Bindings: {
        SECRET_KEY: string;
        DATABASE_URL: string;
        APPPASS: string;
        APPEMAIL: string;
        REQUESTAPI: string;
    };
}>();

app.route("/users", userRouter)
app.route("/email", emailRouter)
app.route("/data", resourceRouter)
app.route("/request", adminRouter)

export const mainRouter = app