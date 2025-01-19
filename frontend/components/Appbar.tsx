"use client"

import { adminState, appMenu, logedinState, userCourse, userEmail, userID, userName } from "@/state/atom";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";



export default function Appbar() {
    const router = useRouter();
    const [loginAtom , setLoginAtom] = useRecoilState(logedinState);
    const [adminAtom, setAdminAtom] = useRecoilState(adminState);
    const setID = useRecoilState(userID)[1];
    const [Name, setName] = useRecoilState(userName);
    const setEmail = useRecoilState(userEmail)[1];
    const setCourse = useRecoilState(userCourse)[1];
    const [appmenu , setAppmenu] = useRecoilState(appMenu);
    useEffect(()=>{
        async function fetchData(){
            const token = localStorage.getItem("Token");
            if(token){
                try{
                    const response = await axios.get("http://localhost:4000/api/users/info",{
                        headers : {
                            token : localStorage.getItem("Token")
                        }
                    })
                    if(response.data){
                        setLoginAtom(true);
                        setID(response.data.user._id);
                        setName(response.data.user.Name);
                        setEmail(response.data.user.Email);
                        setCourse(response.data.user.Course);
                        setAdminAtom(response.data.user.Admin);
                    }
                    else{
                        setLoginAtom(false);
                        setAdminAtom(false);
                    }
                }
                catch(e){
                    setLoginAtom(false);
                    setAdminAtom(false);
                    console.log(e);
                }
            }
            else{
                setLoginAtom(false);
                setAdminAtom(false);
            }
        }
        fetchData();
    },[loginAtom, adminAtom])
    return (
      <div className="border z-30 fixed w-full bg-white text-black top-0 h-16 pl-4 pr-10 max-sm:pr-4">
        <div className="flex justify-between h-full py-2">
            <div className="flex flex-col = justify-center text-2xl font-bold font-serif">
                <a href="/">Elective</a>
            </div>
            <div className="flex flex-col = justify-center">
                <div className={`${!(loginAtom)?"flex" : "hidden"}`}>
                    <a className="mr-2 hover:underline" href="/auth/signin">Login</a> /
                    <a className="ml-2 hover:underline"  href="/auth/signup">Register</a>
                </div>
                {/* only user  */}
                <div className={`${(loginAtom && !adminAtom)?"flex" : "hidden"}`}>
                    <button onClick={()=>{
                        setLoginAtom(false);
                        setAdminAtom(false);
                        localStorage.removeItem("Token")
                    }} className="mr-2 hover:underline" >Logout</button> /
                    <a className="ml-2 hover:underline"  href="/profile">{Name.split(" ")[0]}</a>
                </div>
                {/* only admin  */}
                <div className={`${(loginAtom && adminAtom)?"flex" : "hidden"}`}>
                    <button onClick={()=>setAppmenu(!appmenu)} className=" max-sm:flex hidden">
                        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <svg className="absolute w-12 h-12 text-gray-300 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                    </button>
                    <div className="max-sm:hidden flex">
                        <button onClick={()=>router.push("/mail")} className="mr-2 hover:underline" >Send Notification</button> /
                        <button onClick={()=>router.push("/adminRequest")} className="mr-2 ml-2 hover:underline" >Admin Request</button> /
                        <button onClick={()=>{
                            setLoginAtom(false);
                            setAdminAtom(false);
                            localStorage.removeItem("Token")
                        }} className="mr-2 ml-2 hover:underline" >Logout</button> /
                        <a className="ml-2 hover:underline"  href="/profile">{Name.split(" ")[0]}</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }