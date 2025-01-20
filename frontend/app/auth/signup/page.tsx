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
    const [AppPassword, setAppPassword] = useState<string>("");
    const [otp, setotp] = useState<string>("");
    const [OTP, setOTP] = useState<string>("");
    const [OTPBox, setOTPBox] = useState<boolean>(false);
    const [Course , setCourse] = useState<string | undefined>("");
    const setLoginAtom = useRecoilState(logedinState)[1];
    const router = useRouter();

    const Registerfun = async ()=>{
        if(!Email || !Password || !Name || !Course){
            alert("Fill Credential")
            return;
        }
        else{
            const rn = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const otp1 = rn.toString();
            setotp(otp1);
            try{
                const sendMail = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/otp`,{
                    Email,
                    OTP : otp1,
                    Name
                })
                if(sendMail.data.msg === "OTP Sent"){
                    setOTPBox(true);
                }
                else{
                    alert("please try again later");
                }
            }
            catch(e){
                console.log(e);
                alert("Internal Server Down");
            }
        }
    }

    const SendRequest = async()=>{
        if(!Email || !Password || !Name || !Course){
            alert("Fill Credential")
            return;
        }
        let admin = 0;
        if(Admin){
            admin = 1;
        }
        if(otp === OTP){
            try{
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/signup`,{
                    Name,
                    Admin : admin,
                    Email, 
                    Password,
                    AppPassword,
                    Course,
                })
                alert(response.data.msg);
                if(response.data){
                    localStorage.setItem("Token" , response.data.Token);
                    setLoginAtom(true);
                    router.push("/")
                }
            }
            catch(e){
                console.log(e);
                alert("User allready Exist");
            }
        }
        else{
            // failed with multiple user hit simultaneously
            alert("OTP not matched");
            // setOTPBox(false);
        }
    }
    return (
        <div className=" text-black">
            <div className="h-full flex flex-col justify-center">
                <div className="flex justify-center">
                    <div className="flex flex-col border border-black rounded-lg px-10 py-10 mb-4">
                        <div className=" text-center text-2xl font-bold font-serif">Signup</div>
                        <label className="my-2">Name</label>
                        <input onChange={(e)=>{setName(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]"/>

                        <label className="my-2">Email</label>
                        <input onChange={(e)=>{setEmail(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]"/>
                        
                        <div className={`flex flex-col`}>
                            <label className="my-2">Password</label>
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
                        <div className={`${(Admin)?" flex ":" hidden "}  flex-col`}>
                            <label className="my-2">App Password</label>
                            <a className="text-[10px] mb-2 underline text-blue-900" href="https://youtu.be/MkLX85XU5rU?si=6IR-iZLc8GntZd29" target="blank">How to get an App Password ?</a>
                            <input onChange={(e)=>{setAppPassword(e.target.value)}} className="border border-black rounded-md py-2 px-2  w-[300px]"/>
                        </div>
                        <div className={`${OTPBox ? "flex" : "hidden"} border justify-center mt-8`}>
                            <div className="flex flex-col">
                                <label>OTP : </label>
                                <div className="w-full text-[10px] text-slate-400 font-serif mb-2">An otp will send on your Email</div>
                                <input onChange={(e)=>setOTP(e.target.value)} className="border border-black rounded-md p-2" placeholder="123456"/>
                                <div className="flex justify-center mt-2">
                                    <button onClick={()=> SendRequest()} className={`border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Verify</button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={()=> Registerfun()} className={`${(OTPBox) ? "hidden" : ""} ${(Admin)?"hidden":""} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Register</button>
                            <button onClick={()=> Registerfun()} className={`${(OTPBox) ? "hidden" : ""} ${(Admin)?"":"hidden"} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Request for Admin</button>
                            <button onClick={()=> Registerfun()} className={`${(OTPBox) ? "" : "hidden"} ${(Admin)?"":"hidden"} border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white`}>Resend OTP</button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}