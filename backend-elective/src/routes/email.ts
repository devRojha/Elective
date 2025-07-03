import { Hono } from "hono";

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { EmailAuthMiddlewate } from "../middleware/EmailAuthMiddleware";


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

const SMTPURl = 'https://api-smtp.duckscript.tech/send-email'
// for backup
// const SMTPURl = 'https://smtp-server-wg4w.onrender.com/send-email'
// const SMTPURl = 'http://localhost:3012/send-email'

// brodcast email to all users
router.post('/', EmailAuthMiddlewate, async (c) => {
    const authorEmail = c.get('authorEmail');
    const authorTxt = c.get('txt');
    const {message, recivers } = await c.req.json();
    try{
        const response = await fetch(SMTPURl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({authorEmail, authorTxt, recivers, message}),
        });
        if(response.ok) {
            // const data = await response.json();
            c.status(200);
            return c.json({"msg" : "Mail Sent"});
        }
        else{
            c.status(500);
            return c.json({"msg": "email sent failed with error"});
        }
    }
    catch (e) {
        console.error("email sent failed with error:", e);
        c.status(500);
        return c.json({ "msg": "email sent failed with error" });
    }
});

// for changing password
router.post('/link', async (c) => {
    const { Email } = await c.req.json();
    let recivers = [];
    recivers.push(Email);
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const authorEmail = c.env.APPEMAIL;
        const authorTxt = c.env.APPPASS;
        const userFind = await prisma.user.findUnique({
            where : {
                Email
            },
            select : {
                id : true,
                Name : true,
            }
        })
        if(!userFind){
            c.status(404); 
            return c.json({"msg" : "user not found"});
        }
        console.log(userFind);
        const Api = c.env.REQUESTAPI;
        const message= 
            `
    Dear ${userFind.Name}
    
    You have requested for Password change.
    Please follow to below Link to update your Password
            
    Link : ${Api}/${userFind.id}
    
    Note : Please do not share this Link to anyone and this is an auto generated Mail so please do not reply to this mail. 
            ` ;
        
        const response = await fetch(SMTPURl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({authorEmail, authorTxt, recivers, message}),
        });
        if(response.ok) {
            // const data = await response.json();
            c.status(200);
            return c.json({"msg" : "Link Sent"});
        }
        else{
            console.log("Link sent failed with error from else");
            c.status(500);
            return c.json({"msg": "Link sent failed with error"});
        }
    }
    catch (e) {
        console.log("Link sent failed with error:", e);
        c.status(500);
        return c.json({"msg": `Link sent failed with error ${e}`});
    }
});

router.post("/otp" ,  async (c)=>{
    const {Email, Name} = await c.req.json();
    const rn = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const OTP = rn.toString();
    // console.log("OTP " + OTP);
    let recivers = [];
    recivers.push(Email);
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const authorEmail = c.env.APPEMAIL;
        const authorTxt = c.env.APPPASS;

        const message= 
        `
Hii ${Name}

You have requested for Registration.
Please find the OTP below. This OTP will be active for the next 5 minutes.
    
OTP : ${OTP}

Note : This is an auto generated Mail so please do not reply to this mail.
        ` ;
        const otpmade = await prisma.oTP.create({
            data : {
                Email,
                OTP
            }
        })
        setTimeout(async () => {
            await prisma.oTP.delete({
                where : { Email , OTP}
        });
        }, 300000);
        const response = await fetch(SMTPURl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({authorEmail, authorTxt, recivers, message}),
        });

        if(response.ok) {
            // const data = await response.json();
            c.status(200);
            return c.json({"msg" : "OTP Sent"});
        }
        else{
            console.log("Link sent failed with error from else");
            c.status(500);
            return c.json({"msg": "Link sent failed with error"});
        }
    }
    catch (e) {
        console.error("OTP sent failed with error:", e);
        c.status(500);
        return c.json({ "msg": "OTP sent failed with error" });
    }
})


export const emailRouter = router
