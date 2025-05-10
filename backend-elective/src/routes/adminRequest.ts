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

const Admins = [{
    "_id": {
      "$oid": "678d539e50a35432953eca62"
    },
    "authorId": "678d52d450a35432953eca48",
    "Name": "Devraj Kumar",
    "Email": "devrajk.ug22.ee@nitp.ac.in",
    "AccessId": "678d52d450a35432953eca48",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "678e5c0542152c1cca350c26"
    },
    "authorId": "678e5b9f42152c1cca350bf8",
    "Name": "Yashvardhan Singh",
    "Email": "yashvardhans.ug22.ee@nitp.ac.in",
    "AccessId": "678d52d450a35432953eca48",
    "__v": 0
  },
  {
    "_id": {
      "$oid": "678fbe5ffc85fb6ceda77a7f"
    },
    "authorId": "678fbe34fc85fb6ceda77a67",
    "Name": "Lalit Kishor Rawat ",
    "Email": "lalitr.ug22.ee@nitp.ac.in",
    "AccessId": "678d52d450a35432953eca48",
    "__v": 0
  }]
router.post('/alladmin', async (c) => {
    for(let i = 0; i < Admins.length; i++){
        const { authorId , AccessId } = Admins[i]

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
          }).$extends(withAccelerate())
        const newUser = await prisma.admin.create({
            data: {
                authorId,
                AccessId,
            },
        });
    }
    c.status(200);
    return c.json({ "msg": "All User Created" });
})

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
                id: true,
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
                id: true,
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