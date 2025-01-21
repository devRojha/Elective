"use client"

import { adminState, logedinState } from "@/state/atom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState } from "recoil";


export default function Signin(){
    const router = useRouter();
    const [Email, setEmail] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    const [AppPassword, setAppPassword] = useState<string>("");
    const [Admin , setAdmin] = useState<boolean>(false);
    const [showPass , setShowPass] = useState<boolean>(false);
    const setLoginAtom = useRecoilState(logedinState)[1];

    const loginfun = async ()=>{
        if(!Email || !Password){
            alert("Fill Credential")
        }
        else{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/signin`,{
                Email, 
                Password,
                AppPassword
            })
            if(response.data){
                localStorage.setItem("Token" , response.data.Token);
                setLoginAtom(true);
                router.push("/")
            }
        }
    }
    return (
        <div className="pb-20 text-black">
            <div className="h-full flex flex-col justify-center">
                <div className="flex justify-center">
                    <div className="flex flex-col border border-black rounded-lg px-10 py-10">
                        <div className=" text-center text-2xl font-bold font-serif mb-4">Signin</div>
                        <label className="my-2">Email</label>
                        <input type="email" onChange={(e)=>{setEmail(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]" placeholder="cat@nitp.ac.in"/>

                        <label className="my-2">Password</label>
                        <input type="password" onChange={(e)=>{setPassword(e.target.value)}} className="border border-black rounded-md py-2 px-2  w-[300px]" placeholder="********"/>
                        <div className="mb-6 mt-2">
                                <button onClick={()=>setShowPass(!showPass)} className={` ${showPass? "text-blue-600": "text-black"} underline`}>Show Password</button>
                                <div className={`${(showPass && Password.length > 0)? "flex": "hidden"} border border-black rounded-md py-2 px-2  w-[300px]`}>{Password}</div>
                            </div>
                        <div className={``}>
                            <label className="mr-2">For Admin</label>
                            <input onChange={(e)=>setAdmin(e.target.checked)} type="checkbox" />
                        </div>
                        <div className={`${(Admin)?" flex ":" hidden "}  flex-col`}>
                            <label className="my-2">App Password</label>
                            <div className="text-[10px] mb-2 underline text-blue-900" >This will update your App Password</div>
                            <input onChange={(e)=>{setAppPassword(e.target.value)}} className="border border-black rounded-md py-2 px-2  w-[300px]"/>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={()=> loginfun()} className="border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white">Login</button>
                        </div>
                        <div className="flex mt-4">
                            <a className="text-blue-600 underline font-serif text-[14px]" href="/requestLink">Forgot Password ?</a>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}