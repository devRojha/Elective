"use client"

import { logedinState } from "@/state/atom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function Signup(){
    const [Admin , setAdmin] = useState<boolean>(false);
    const [Name , setName] = useState<string>("");
    const [Email, setEmail] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    const [Course , setCourse] = useState<string | undefined>("");
    const setLoginAtom = useRecoilState(logedinState)[1];
    const router = useRouter();
    const Registerfun = async ()=>{
        if(!Email || !Password || !Name || !Course){
            alert("Fill Credential")
        }
        else{
            const response = await axios.post("http://localhost:4000/api/users/signup",{
                Name,
                Email, 
                Password,
                Course,
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
                        <div className=" text-center text-2xl font-bold font-serif">Signup</div>
                        <label className="my-2">Name</label>
                        <input onChange={(e)=>{setName(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]"/>

                        <label className="my-2">Email</label>
                        <input onChange={(e)=>{setEmail(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]"/>
                        
                        <div className={`flex flex-col`}>
                            <label className="my-2">App Password</label>
                            <input onChange={(e)=>{setPassword(e.target.value)}} className="border mb-8 border-black rounded-md py-2 px-2  w-[300px]"/>
                        </div>
                        
                        <div className="flex">
                            <label>Course</label>
                            <select onChange={(e) => setCourse(e.target.value)} className="ml-2 border rounded-lg border-black">
                                <option value="">--Select--</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Robotics">Robotics</option>
                                <option value="Modern Control Theory">Modern Control Theory</option>
                            </select>
                        </div>
                        <div className={`mt-4`}>
                            <label className="mr-2">For Admin</label>
                            <input onChange={(e)=>setAdmin(e.target.checked)} type="checkbox" />
                        </div>
                        <div className="mt-10 flex justify-center">
                            <button onClick={()=> Registerfun()} className={`${(Admin)?"hidden":""} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Register</button>
                            <button onClick={()=> Registerfun()} className={`${(Admin)?"":"hidden"} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Request for Admin</button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}