import { Hono } from 'hono'
import  { sign  }  from 'hono/jwt'
import { z } from 'zod'
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { authMiddleware } from '../middleware/authMiddleware';

type CustomContext = {
    Variables: {
        authorID: string; // Add authorID to the context type
        authorEmail: string; // Add authorEmail to the context type
        txt: string; // Add txt to the context type
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

router.get('/', (c) => {
    return c.text('Hello Developer!')
})

router.get('/num',  async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const user = await prisma.user.findMany({
            select:{
                id : true
            }
        })
        if(user){
            c.status(200);
            return c.json({"num" : user.length});
        }
        else{
            c.status(404);
            return c.json({"num" : 0})
        }
    }
    catch(e){
        console.error("Data showing failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})
router.get('/info', authMiddleware, async (c) => {
    const authorID = c.get("authorID"); // Assuming `authorID` is set in middleware
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const user = await prisma.user.findUnique({
            where : {id : authorID},
            select : {
                id : true,
                Name : true,
                Email : true,
                Course : true,
                Admin : true,
            }
        })
        if(user){
            c.status(200); 
            return c.json({user});
        }
        else{
            c.status(404); 
            return c.json({"msg" : "user not found"})
        }
    }
    catch(e){
        console.error("Data showing failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
})

router.get('/all', authMiddleware, async (c) => {
    const authorID = c.get("authorID"); // Assuming `authorID` is set in middleware
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const user = await prisma.user.findUnique({
            where: { id : authorID },
        });
        if (!user) {
            c.status(404);
            return c.json({ "msg" : "no any users are here" });
        }
        const users = await prisma.user.findMany({
            where: { Course : user.Course },
            select: {
                id: true,
                Name: true,
                Email: true,
            },
        });
        c.status(200);
        return c.json({users});
    } catch (e) {
        console.error("Users showing failed with error: ", e);
        c.status(500);
        return c.json({ "msg": "Internal Server down" });
    }
});

// signup
router.post('/signup', async (c ) => {
    const body = await c.req.json()
    const { Name, Email, Password, AppPassword, Admin, Course, OTP } = body
    
    const userSchema = z.object({
        Name : z.string().min(2),
        Email: z.string().email(),
        Password: z.string().min(6),
        Course: z.string().min(2),
    })
    
    const result = userSchema.safeParse({ Name, Email,Password, Course })
    
    if (!result.success || !(Email.includes("@nitp.ac.in"))) {
        c.status(409);
        return c.json({"msg" : "Wrong Credential"})
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const userFind = await prisma.user.findUnique({
            where:{
              Email: Email
            }
        })
        if (!userFind) {
            const OTPfind = await prisma.oTP.findUnique({
                where:{
                    Email: Email,
                    OTP: OTP
                }
            })
            // console.log(OTPfind)
            // if(OTPfind && (OTP == OTPfind.OTP) && OTP.length == 6){
                const hasPassword = await bcrypt.hash(Password , 10);
                const newUser = await prisma.user.create({
                    data: {
                        Name,
                        Email,
                        Password : hasPassword,
                        AppPassword,
                        Admin : 0,
                        Course
                    },
                });
                if((Admin === 1) && (AppPassword.length > 0)){
                    const adminReq = await prisma.request.create({
                        data: {
                            authorId : newUser.id,
                        },
                    })
                }
                const payload = {userId : newUser.id};
                const Token = await sign(payload , c.env.SECRET_KEY);
                c.status(200);
                return c.json({Token});
            }
            else{
                c.status(404);
                return c.json({"msg" : "OTP not Found"});
            }
        // }
        // else{
        //     c.status(409)
        //     return c.json({"msg" : "user Allready Exist"})
        // }
    }    
    catch (e) {
        const userFind = await prisma.user.findUnique({
            where:{
              Email: Email
            }
        })
        if(userFind) {
            await prisma.user.delete({
                where:{
                    Email: Email
                }
            })
        }
        console.error("Signup failed with error:", e);
        c.status(500);
        return c.json({ "msg": "Signup failed with error" });
    }
})

//signin
router.post('/signin', async (c) => {
    const body = await c.req.json()
    const { Email, Password, AppPassword } = body
    const userSchema = z.object({
        Email: z.string().email(),
        Password: z.string().min(6),
    })
    const result = userSchema.safeParse({ Email, Password })
    if (!result.success || !(Email.includes("@nitp.ac.in"))) {
        c.status(409);
        return c.json({"msg" : "Wrong Credential"})
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const user = await prisma.user.findUnique({
            where: {
                Email: Email
            }
        })
        if(user) {
            const isPasswordValid = await bcrypt.compare(Password, user.Password);
            if(isPasswordValid) {
                if(AppPassword.length > 0){
                    const updateUser = await prisma.user.update({
                        where: { Email },
                        data: { AppPassword }
                    });
                    console.log(updateUser);
                }
                const payload = { userId: user.id };
                const Token = await sign(payload, c.env.SECRET_KEY);
                c.status(200);
                return c.json({ Token });
            } else {
                c.status(409);
                return c.json({"msg" : "Wrong Credential"});
            }
        } else {
            c.status(404);
            return c.json({"msg" : "User not found"});
        }
    } catch (e) {
        console.error("Login failed with error:", e);
        c.status(500);
        return c.json({ "msg": "Login failed with error" });
    }
})

router.put('/update', authMiddleware, async (c) => {
    const body = await c.req.json();
    const { Name, AppPassword, Admin, Course } = body;
    const authorID = c.get("authorID"); // Assuming `authorID` is set in middleware
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const user = await prisma.user.findUnique({
            where: { id : authorID },
        });
        if (!user) {
            c.status(404);
            return c.json({ msg: 'User not found' });
        }
        const updatedData: Partial<User> = {};
        if (Name) updatedData.Name = Name;
        if (Course) updatedData.Course = Course;
        if (AppPassword) updatedData.AppPassword = AppPassword;

        if (Admin === 1 && user.Admin === 0 && AppPassword && AppPassword.length > 0) {
            await prisma.request.upsert({
                where: { id: authorID },
                update: {},
                create: {
                    authorId: authorID,
                },
            });
        }

        await prisma.user.update({
            where: { id : authorID },
            data: updatedData,
        });

        const payload = { userId: authorID };
        const Token = await sign(payload, c.env.SECRET_KEY);

        c.status(200);
        return c.json({ Token });
    } catch (e) {
        console.error('Update failed with error:', e);
        c.status(500);
        return c.json({ msg: 'Update failed with error' });
    }
});

router.put('/updatePassword',  async (c) => {
    const body = await c.req.json();
    const { id, Password } = body;
    if(!id || !Password || Password.length < 6){
        c.status(409);
        return c.json({"msg" : "Wrong Credential"})
    }
    const hashPassword = await bcrypt.hash(Password, 10);
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            c.status(404);
            return c.json({ msg: 'User not found' });
        }
        await prisma.user.update({
            where: { id },
            data: { Password: hashPassword },
        });
        c.status(200);
        return c.json({"msg" : "Password Updated"});
    } catch (e) {
        console.error("update failed with error:", e);
        c.status(500);
        return c.json({ "msg": "update failed with error" });
    }
});

router.delete('/delete', authMiddleware, async (c) => {
    const authorID = c.get("authorID"); // Assuming `authorID` is set in middleware
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const user = await prisma.user.findUnique({
            where: { id: authorID },
        });
        if (!user) {
            c.status(404);
            return c.json({ msg: 'User not found' });
        }
        await prisma.user.delete({
            where: { id: authorID },
        });
        c.status(200);
        return c.json({ "msg": "user deleted" });
    } catch (e) {
        console.error("user delete failed with error:", e);
        c.status(500);
        return c.json({ "msg": "user delete failed with error" });
    }
});


export const userRouter = router