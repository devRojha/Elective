"use client"

import { logedinState, userCourse, userEmail, userName } from "@/state/atom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";


export default function Profile(){
    const [render , setRender] = useState<boolean>(false);
    const [Admin , setAdmin] = useState<boolean>(false);
    const [Name , setName] = useState<string>("");
    const [Email, setEmail] = useState<string>("");
    const [AppPassword, setAppPassword] = useState<string>("");
    const [Course , setCourse] = useState<string | undefined>("");
    const setLoginAtom = useRecoilState(logedinState)[1];
    const username = useRecoilValue(userName);
    const useremail = useRecoilValue(userEmail);
    const usercourse = useRecoilValue(userCourse);
    const router = useRouter();

    useEffect(()=>{
        
    },[render])

    const updateProfile = async ()=>{
        let admin = 0;
        if(Admin){
            admin = 1;
        }
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update`,{
            Name,
            Email,
            Admin : admin, 
            AppPassword,
            Course,
        },{
            headers : {
                token : localStorage.getItem("Token")
            }
        })
        if(response.data){
            alert("User Data Updated")
            localStorage.setItem("Token" , response.data.Token);
            setRender(!render);
        }
    }

    const DeleteProfile = async ()=>{
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/delete`,{
            headers : {
                token : localStorage.getItem("Token")
            }
        })
        if(response.data){
            setLoginAtom(false);
            localStorage.removeItem("Token");
            router.push("/")
        }
    }

    return (
        <div className="h-screen text-black">
            <div className="h-full flex flex-col justify-center">
                <div className="flex justify-center">
                    <div className="flex flex-col border border-black rounded-lg px-10 py-10 mb-4">
                        <div className=" text-center text-2xl font-bold font-serif">Profile</div>
                        <div className="flex space-x-2 text-slate-500 my-2">
                            <label className="">Name :</label>
                            <div>{username}</div>
                        </div>
                        <input onChange={(e)=>{setName(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]" placeholder="Enter your updated name here"/>

                        <div className="flex space-x-2 text-slate-500 mb-4">
                            <label className="">Email :</label>
                            <div>{useremail}</div>
                        </div>

                        <div className="flex">
                            <div className="flex flex-col text-slate-500 my-2">
                                <label className="">Courses :</label>
                                <div>{usercourse}</div>
                            </div>
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
                        <div className={`${(Admin)?" flex ":" hidden "}  flex-col`}>
                            <label className="my-2">App Password</label>
                            <a className="text-[10px] mb-2 underline text-blue-900" href="https://youtu.be/MkLX85XU5rU?si=6IR-iZLc8GntZd29" target="blank">How to get an App Password ?</a>
                            <input onChange={(e)=>{setAppPassword(e.target.value)}} className="border border-black rounded-md py-2 px-2  w-[300px]"/>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={()=> updateProfile()} className={`${Admin? "hidden" : ""} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Update</button>
                            <button onClick={()=> updateProfile()} className={`${Admin? "" : "hidden"} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Request for / Update as Admin</button>
                            <button onClick={()=> DeleteProfile()} className={` border px-4 py-2 rounded-lg active:text-black hover:border-black bg-red-700 text-white ml-4`}>Delete Account</button>
                        </div>
                    </div>
                    
                </div>
            </div>  
        </div>
    )
}