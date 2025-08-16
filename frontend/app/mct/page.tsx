"use client"

import HeadingTheme from "@/components/HeadingTheme";
import NavigationButton from "@/components/NavigationButton";
import { adminState } from "@/state/atom";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

interface ListItem {
    id: string;    // Adjust the type to your needs
    Title: string; // Assuming Title is a string
}
export default function MCT() {
    const [uploader , setuploader] = useState<boolean>(false);
    const [lists , setList] = useState<[]>([])
    const router = useRouter();
    const AdminState = useRecoilValue(adminState);
    useEffect(()=>{
        const fetchData = async()=>{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/all`,{
                Courses : "Modern Control Theory"
            })
            if(response.data){
                setList(response.data.list);
            }
        }
        fetchData();
    },[uploader])
    return (
      <div className="text-black h-screen overflow-auto">
            <div className={`${(uploader)?"fixed":"hidden"} h-screen w-full  flex justify-center z-10`}>
                <UploaderCompo setuploader={setuploader}/>
            </div>
          <div className="text-center text-2xl font-bold font-serif mb-20 flex justify-center">
            <button  onClick={()=>router.push("/")} className=" absolute left-10 max-sm:left-2">
              <Image src={"/back.png"} height={30} width={30} alt="loading.."/>
            </button>
            {/* <div>Modern Control Theory</div> */}
            <div><HeadingTheme first="Modern " second="Control " third="Theory"/></div>
            <button onClick={()=> setuploader(true)} className={`${(AdminState)? "": "hidden"} absolute right-10 max-sm:right-2 text-white`}>+</button>
          </div>
          <div className="flex justify-center mb-10 z-10">
              <div className="flex flex-col justify-center space-y-4">
              {lists.map((list : ListItem) => (

                    <NavigationButton  key={list.id} url={`/individual/${list.id}`} name={list.Title}/>
                ))}
            </div>
          </div>
      </div>
    );
  }

interface UploaderCompoProps {
  setuploader: (value: boolean) => void,

}

function UploaderCompo({ setuploader }: UploaderCompoProps) {
    const [res, setRes] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [file, setFile] = useState<string>("");
    const AdminState = useRecoilValue(adminState);


    const submit = async()=>{
        try {
            const token = localStorage.getItem("Token");
            if (!token) {
                console.error("Token not found in localStorage");
                return;
            }
            if (!AdminState) {
                alert("You are not an admin")
                return;
            }
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/upload`,{
                file,
                Title : title,
                Text : res,
                Courses : "Modern Control Theory"
            },{
                headers:{
                    token : localStorage.getItem("Token")
                }
            }
            );
            if(response.data.msg === "Data uploaded"){
                alert("uploaded")
            }
            else{
                alert("uploading failed")
            }
            console.log("Upload response:", response.data);
        } catch (error) {
            console.error("Error uploading data:", error);
        }
    }
    return (
      <div className="rounded-md shadow-lg bg-zinc-200 h-[600px] w-[800px] p-10">
        <div className="flex w-full justify-end">
          <button onClick={() => setuploader(false)}>X</button>
        </div>
          <div className="flex space-x-2">
            <label className="p-2">Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 bg-zinc-200 border border-black rounded-md w-[300px]"
            />
          </div>
          <div className="mb-4 mt-10 flex space-x-2">
            <label className="p-2">Drive Link of File: </label>
            <input className="p-2 bg-zinc-200 border border-black rounded-md w-[300px]"
              onChange={(e) => setFile(e.target.value)}
            />
          </div>
          <div className="mb-4 text-[13px]">
            Note: If your file is large, then please upload your file on Google
            Drive and paste the link in resources.
          </div>
          <textarea
            onChange={(e) => setRes(e.target.value)}
            className="bg-zinc-200 border border-black rounded-lg h-[250px] w-full p-4"
            placeholder="Resources..."
          />
          <button
            onClick={()=>submit()}
            className="border border-black rounded-lg mt-2 px-3 py-2"
          >
            Upload
          </button>
      </div>
    );
  }
