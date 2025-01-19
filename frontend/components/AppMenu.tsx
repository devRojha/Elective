"use Client"

import { adminState, appMenu, logedinState, userName } from "@/state/atom";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

import { useRecoilState, useRecoilValue } from "recoil";





export default function AppMenu(){
    const username = useRecoilValue(userName);
    const [loginAtom , setLoginAtom] = useRecoilState(logedinState);
    const setAdminAtom = useRecoilState(adminState)[1];
    const [appmenu , setAppMenu] = useRecoilState(appMenu);
    const router = useRouter();
    useEffect(()=>{

    },[loginAtom])
    return (
        <div className={`${appmenu ? "fixed" : "hidden"}  top-[50px] pt-8 px-4  right-0 h-[300px] w-[200px] rounded-r-none shadow-lg shadow-black rounded-b-lg bg-slate-200 z-10`}>
            <div className="text-black flex w-full justify-end mb-12"><button onClick={()=>setAppMenu(false)}>X</button></div>
            <div className="flex flex-col space-y-4 justify-start">
                <div><button onClick={()=> router.push("/mail")} className=" text-slate-600 hover:text-blue-700 hover:underline">Send Notification</button></div>
                <div><button onClick={()=> router.push("")} className=" text-slate-600 hover:text-blue-700 hover:underline">Admin Request</button></div>
                <div><button onClick={()=>{
                        setLoginAtom(false);
                        setAdminAtom(false);
                        setAppMenu(false);
                        router.push("/")
                        localStorage.removeItem("Token")
                    }} className=" text-slate-600 hover:text-blue-700 hover:underline">Logout</button></div>
                <div><button onClick={()=> router.push("/profile")} className=" text-slate-600 hover:text-blue-700 hover:underline">{username}</button></div>
            </div>
        </div>
    )
}