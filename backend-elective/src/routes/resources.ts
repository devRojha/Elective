import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
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

// get individual resource info
router.get("/info" , async (c)=>{
    const id = c.req.header("id");
    console.log(id)
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        if(id){
            const data = await prisma.resources.findUnique({where:{id}});
            if(data){
                c.status(200);
                return c.json({data});
            }
            else{
                c.status(404);
                return c.json({"msg" : "Empty Folder"})
            }
        }
        else{
            c.status(409);
            return c.json({"msg" : "id is empty"})
        }
    }
    catch(e){
        console.error("Data showing failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

// All info courses wise
router.post("/all" , async (c)=>{
    const { Courses } = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const AllData = await prisma.resources.findMany({where:{Courses}});
        const list = [];
        if(AllData){
            for(var i = 0 ; i < AllData.length ; i++){
                list.push({Title : AllData[i].Title , id : AllData[i].id});
            }
            c.status(200);
            return c.json({list});
        }
        else{
            c.status(404);
            return c.json({"msg" : "list not found"});
        }
    }
    catch(e){
        console.error("List showing failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

router.post("/upload" ,authMiddleware , async (c)=>{
    // use Multer
    const {Title, Text, Courses, file} = await c.req.json();
    const AuthorId = c.get('authorID');
    const Admin = c.get('Admin');
    if(Admin === false){
        c.status(401);
        return c.json({ "msg": "You are not authorized to upload" });
    }
    // const file = req.file;
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        if(file.length > 0 && Text.length > 0){
            const newData = await prisma.resources.create({
                data : {
                    Title,
                    AuthorId,
                    Text,
                    Courses ,
                    PDF : file
                    // PDF : file.path,
                }
            });
            c.status(200);
            return c.json({"msg" : "Data uploaded"});
        }
        else if(file.length == 0 && (Text.length > 0)){
            const newData = await prisma.resources.create({
                data : {
                    Title,
                    AuthorId,
                    Text,
                    Courses 
                }
            });
            c.status(200)
            return c.json({"msg" : "Data uploaded"});
        }
        else if(file && Text.length == 0){
            const newData = await prisma.resources.create({
                data : {
                    Title,
                    AuthorId,
                    Courses,
                    PDF : file
                    // PDF : file.path,
                }
            });
            c.status(200)
            return c.json({"msg" : "Data uploaded"});
        }
        else{
            c.status(400)
            return c.json({ message: "No Data uploaded" });
        }
    }
    catch (e) {
        console.error("upload failed with error:", e);
        c.status(500)
        return c.json({ "msg": "upload failed with error" });
    }
})

// router.put("/updatePDF" ,authMiddleware, upload.single("file"), async (req , res)=>{
router.put("/updatePDF" ,authMiddleware, async (c)=>{
    // use Multer
    const {id, file} = await c.req.json();
    const AuthorId = c.get("authorID") ;const Admin = c.get('Admin');
    if(Admin === false){
        c.status(401);
        return c.json({ "msg": "You are not authorized to upload" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        // const deletefile = await DeleteFile(filename);
        const newData = await prisma.resources.update({
            where : {
                id
            },
            data : {
                PDF : file,
                AuthorId
            }
        });
        c.status(200);
        return c.json({"msg" : "PDF updated"});
    }
    catch (e) {
        console.error("PDF updated failed with error:", e);
        c.status(500);
        return c.json({ "msg": "PDF updated failed with error" });
    }
})

router.put("/updateText" ,authMiddleware, async (c)=>{
    // use Multer
    const {id, Text} = await c.req.json();
    const AuthorId = c.get("authorID") ;
    const Admin = c.get('Admin');
    if(Admin === false){
        c.status(401);
        return c.json({ "msg": "You are not authorized to upload" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const newData = await prisma.resources.update({
            where : {
                id
            },
            data : {
                Text,
                AuthorId
            }
        });
        c.status(200);
        return c.json({"msg" : "Text updated"});
    }
    catch (e) {
        console.error("Text updated failed with error:", e);
        c.status(500);
        return c.json({ "msg": "Text updated failed with error" });
    }
})

router.put("/updateTitle" ,authMiddleware, async (c)=>{
    // use Multer
    const {Title, id} = await c.req.json();
    const AuthorId = c.get("authorID") ;
    const Admin = c.get('Admin');
    if(Admin === false){
        c.status(401);
        return c.json({ "msg": "You are not authorized to upload" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        if(Title){
            const newData = await prisma.resources.update({
                where : {
                    id
                },
                data : {
                    Title : Title,
                    AuthorId
                }
            });
            c.status(200);
            return c.json({"msg" : "Title updated"});
        }
    }
    catch (e) {
        console.error("Title updated failed with error:", e);
        c.status(500);
        return c.json({ "msg": "Title updated failed with error" });
    }
})

router.delete("/delete" ,authMiddleware, async (c)=>{
    // use Multer
    const { id } = await c.req.json();
    const Admin = c.get('Admin');
    if(Admin === false){
        c.status(401);
        return c.json({ "msg": "You are not authorized to upload" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        // const deletefile = await DeleteFile(filename);
        const resFound = await prisma.resources.delete({
            where : {
                id
            }
        });
        c.status(200);
        return c.json({"msg" : "Deleted"});
    }
    catch (e) {
        console.error("Signup failed with error:", e);
        c.status(500);
        return c.json({ "msg": "Signup failed with error" });
    }
})

export const resourceRouter = router;