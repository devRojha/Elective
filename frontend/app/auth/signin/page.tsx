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
    const setLoginAtom = useRecoilState(logedinState)[1];
    const loginfun = async ()=>{
        if(!Email || !Password){
            alert("Fill Credential")
        }
        else{
            const response = await axios.post("http://localhost:4000/api/users/signin",{
                Email, 
                Password
            })
            if(response.data){
                localStorage.setItem("Token" , response.data.Token);
                setLoginAtom(true);
                router.push("/")
            }
        }
    }
    return (
        <div className="h-screen text-black">
            <div className="h-full flex flex-col justify-center">
                <div className="flex justify-center">
                    <div className="flex flex-col border border-black rounded-lg px-10 py-10">
                        <div className=" text-center text-2xl font-bold font-serif">Signin</div>
                        <div className=" text-center text-lg mb-10 font-thin font-serif">Only For Admin</div>
                        <label className="my-2">Email</label>
                        <input onChange={(e)=>{setEmail(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]"/>

                        <label className="my-2">App Password</label>
                        <input onChange={(e)=>{setPassword(e.target.value)}} className="border border-black rounded-md py-2 px-2  w-[300px]"/>
                        
                        <div className="mt-10 flex justify-center">
                            <button onClick={()=> loginfun()} className="border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white">Login</button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}