"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function ChangePassword(){
    const router = useRouter();
    const [Email, setEmail] = useState<string>("");

    const sendLink = async ()=>{
        if(!Email || !Email.includes("@nitp.ac.in")){
            alert("Fill Credential")
        }
        else{
            try{
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/link`,{
                    Email, 
                })
                alert(response.data.msg);
                if(response.data.msg === "Link Sent"){
                    router.push("/");
                }
            }
            catch(e){
                console.log(e);
                alert("Internal Server Down");
            }
        }
    }
    return (
        <div className="h-screen text-black">
            <div className="h-full flex flex-col justify-center">
                <div className="flex justify-center">
                    <div className="flex flex-col border border-black rounded-lg px-10 py-10">
                        <div className=" text-center text-2xl font-bold font-serif mb-4">Forgot Password</div>
                        <label className="my-2">Email</label>
                        <input onChange={(e)=>{setEmail(e.target.value)}} className="mb-8 border border-black rounded-md py-2 px-2  w-[300px]"/>
                        <div className="text-slate-500 text-[10px]">Note : A Password reset link has been sent after pressing the button</div>
                        <div className="mt-8 flex justify-center">
                            <button onClick={()=> sendLink()} className="border px-4 py-2 rounded-lg border-blue-500 hover:text-blue-900 hover:border-black active:text-white">Send Link</button>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}