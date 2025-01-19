
"use client"

import axios from "axios";
import { useEffect, useState } from "react"


export default function Footer(){
    const [user, setUser] = useState<string>("0");
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response = await axios.get("http://localhost:4000/api/users/num");
                if(response.data){
                    setUser(response.data.num);
                }
            }
            catch(e){
                console.log(e);
            }
        }
        fetchData();
    },[])
    return (
        <div className="">
            <div className="px-20 max-lg:px-12 max-md:px-6 pt-4 text-zinc-600 bg-zinc-300">
                <div className="text-2xl text-center mb-10 font-bold mt-4">Contact us : </div>
                <div className="grid grid-cols-3 max-sm:grid-cols-1 max-sm:space-y-2">
                    {/* Layer 1 */}
                    <div className="text-sm  mt-4">
                        <div className="font-bold mb-1">Machine Learning</div>
                        <div>Dr. Gosh</div>
                        <div>Email: <a className="underline" href="mailto:iscesti2025@nitp.ac.in">devrajk.ug22.ee@nitp.ac.in</a></div>
                    </div>
                    <div className="text-sm  mt-4">
                        <div className="font-bold mb-1">Robotics</div>
                        <div>Dr. Gagandeep Meena</div>
                        <div>Email: <a className="underline" href="mailto:iscesti2025@nitp.ac.in">devrajk.ug22.ee@nitp.ac.in</a></div>
                    </div>
                    <div className="text-sm  mt-4">
                        <div className="font-bold mb-1">Modern Control Theory</div>
                        <div>Dr. Ruchi</div>
                        <div>Email: <a className="underline" href="mailto:iscesti2025@nitp.ac.in">devrajk.ug22.ee@nitp.ac.in</a></div>
                    </div>

                    {/* Layer 2*/}
                    <div className="text-sm  mt-6">
                        <div className="font-bold mb-1">Designed and Maintained by </div>
                        <div>Devraj Kumar</div>
                        <div>Email: <a className="underline" href="mailto:iscesti2025@nitp.ac.in">devrajk.ug22.ee@nitp.ac.in</a></div>
                        <div>College Website: <a className="underline" href="">www.nitp.ac.in</a></div>
                    </div>
                </div>

                <div className="w-full h-full flex justify-end font-mono text-sm font-bold mt-6">
                    <div className="h-full flex flex-col justify-end max-lg:text-[12px] max-sm:text-[10px]">Total Active Users : {user}</div>
                </div>
            </div>
            <div className="bg-green-800 w-full text-center text-white text-sm">@ All right reserved</div>
        </div>
    )
}