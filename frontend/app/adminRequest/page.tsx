"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface requestType{
    Name : string,
    Email : string,
    authorId : string,
    _id : string
}

export default function Page() {
    const router = useRouter();
    const [render, setRender] = useState<boolean>(false);
    const [requestList , setReqestList] = useState<requestType[]>([]);

  useEffect(()=>{
    const fetchData = async ()=>{
        if(localStorage.getItem("Token")){
            try{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/request/all`,{
                    headers : {
                        token : localStorage.getItem("Token")
                    }
                })
                if(response.data){
                    setReqestList(response.data);
                }
            }
            catch(e){
                console.log("Somthing went wrong " + e);
            }
        }
    }
    fetchData();
  },[render])

  return (
    <div className="text-black h-screen overflow-auto pb-10">
        <div className="text-center text-2xl font-bold font-serif mb-20">Admin Request</div>
        <div className="flex justify-center">
            <div className="flex flex-col justify-center space-y-4">
                {requestList.map(list =>{
                    return (
                        <Compo key={list._id} Name={list.Name} Email={list.Email} id={list.authorId} render={render} setRender={setRender}/> 
                    )
                })}
          </div>
        </div>
    </div>
  );
}

interface CompoType{
    Name : string ,
    Email : string ,
    id : string,
    render : boolean ,
    setRender: (value: boolean) => void;
}

function Compo({Name , Email , id, render , setRender}:CompoType){
    const accept  = async()=>{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/request/access`,{
            id : id
        },{
            headers : {
                token : localStorage.getItem("Token")
            }
        })
        if(response.data.msg === "Access made"){
            alert("Access Granted");
            setRender(!render);
        }
    }
    const reject  = async()=>{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/request/remove`,{
            id : id
        },{
            headers : {
                token : localStorage.getItem("Token")
            }
        })
        if(response.data.msg === "Access removed"){
            // alert("Access Granted");
            setRender(!render);
        }
    }
    return (
        <div  className="text-center px-4 py-3 border border-black rounded-lg w-[375px] flex justify-between">
            <div className="flex flex-col">
                <div className="flex justify-start">{Name}</div>
                <div className="flex justify-start">{Email}</div>
            </div>
            <div className="">
                <button onClick={()=>accept()} className="text-green-500 font-bold">,/</button>
                <button onClick={()=>reject()} className="ml-4 text-red-700 font-bold">X</button>
            </div>
        </div>
    )
}