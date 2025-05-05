import { Hono } from 'hono'
import { PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from '../middleware/authMiddleware';

type CustomContext = {
    Variables: {
        authorID: string; // Add authorID to the context type
        authorEmail: string; // Add authorEmail to the context type
        txt: string; // Add txt to the context type
        Admin: boolean; // Add Admin to the context type
    };
};

const router = new Hono<CustomContext & {
    Bindings: {
        SECRET_KEY: string;
        DATABASE_URL: string;
        APPPASS: string;
        APPEMAIL: string;
        REQUESTAPI: string;
    };
}>();


// get all admin requests
router.get("/all" , authMiddleware , async (c)=>{
    const Admin = c.get("Admin");
    if(Admin === false){
        c.status(401);
        return c.json({ "msg" : "Author is not an Admin" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const users = await prisma.request.findMany({
            select: {
                authorId: true,
                author : {
                    select : {
                        Name : true,
                        Email : true,
                    }
                }
            }
        })
        
        c.status(200);
        return c.json(users);
    }
    catch(e){
        console.error("Getting All user failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

// get all admin
router.get("/admin/all" , authMiddleware , async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const users = await prisma.admin.findMany({
            select: {
                authorId: true,
                author : {
                    select : {
                        Name : true,
                        Email : true,
                    }
                }
            }
        })
        c.status(200);
        return c.json(users);
    }
    catch(e){
        console.error("Getting All user failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

router.put("/access", authMiddleware, async (c)=>{
    const { id }  = await c.req.json();
    const authorId = c.get("authorID");
    const Admin = c.get("Admin");
    if(Admin === false){
        c.status(401);
        return c.json({ "msg" : "Author is not an Admin" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const user = await prisma.user.update({
            where: {id : id},
            data : { Admin : 1 }
        });
        const Makeadmin = await prisma.admin.create({
            data :{
                authorId : id,
                AccessId : authorId
            }
        })
        const removedRequest = await prisma.request.delete({where:{authorId :id}});
        c.status(200);
        return c.json({"msg" : "Access made"})
    }
    catch(e){
        console.error("Access made failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

router.put("/remove", authMiddleware, async (c)=>{
    const { id }  =  await c.req.json();
    const Admin = c.get("Admin");
    if(Admin === false){
        c.status(401);
        return c.json({ "msg" : "Author is not an Admin" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const removedRequest = await prisma.request.delete({where:{authorId :id}});
        c.status(200);
        return c.json({"msg" : "Access removed"})
    }
    catch(e){
        console.error("Access removing failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

export const adminRouter = router;