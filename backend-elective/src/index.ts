import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { mainRouter }  from './routes/index'


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

app.use('/*', cors())

app.route("/api", mainRouter); 

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
