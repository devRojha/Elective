


// app/pages/problemset/problem/[id]/index.tsx
"use client"

import { adminState } from "@/state/atom";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";


export default function Page() {
    const [uploader , setuploader] = useState<boolean>(false);
    const param = useParams();
    const id = param.id;
    const router = useRouter();
    const [file , setFile] = useState<string>("")
    const [text , setText] = useState<string>("")
    const [title , setTitle] = useState<string>("")
    const [Course , setCourse] = useState<string>("")
    const AdminState = useRecoilValue(adminState)

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/info`,{
                headers : {
                    id
                }
            })
            if(response.data.data){
                // console.log(response.data)
                setTitle(response.data.data.Title);
                const crs = response.data.data.Courses
                if(crs === "Modern Control Theory"){
                    setCourse("mct");
                }
                else if(crs === "Robotics"){
                    setCourse("robotics");
                }
                else if(crs === "Machine Learning"){
                    setCourse("ml");
                }
                if(response.data.data.Text){
                    setText(response.data.data.Text);
                }
                if(response.data.data.PDF){
                    setFile(response.data.data.PDF);
                }
            }
        }
        fetchData();
    },[uploader])
    const deleteFile = async()=>{
        try{
            if(!localStorage.getItem("Token") || !AdminState){
                alert("Authentication Required");
                return;
            }
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/delete`,{
                headers : {
                    token : localStorage.getItem("Token")
                },
                data :{
                    id,
                }
            })
            if(response.data.msg === "Deleted"){
                alert("Deleted");
                router.push(`/${Course}`);
            }
            else{
                alert("Cant Delete")
            }
        }
        catch (e){
            console.log(e);
        }
    }

    const formatText = (text: string): string => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        // Replace URLs with clickable links and preserve newlines
        return text
            .replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${url}</a>`;
            })
            .replace(/\n/g, "<br>"); // Replace newlines with <br> tags
    };

    return (
        <div className="  text-zinc-400">
            <div className={`${(uploader)?"fixed":"hidden"} h-screen w-full  flex justify-center border-green-400 z-10`}>
                <UploaderCompo setuploader={setuploader}/>
            </div>
            <div className="text-center text-2xl font-bold font-serif flex justify-center">
                <button  onClick={()=>{router.push(`/${Course}`)}} className=" absolute left-10 max-sm:left-2">
                    <Image src={"/back.png"} height={30} width={30} alt="loading.."/>
                </button>
                <div className="px-4 mt-10 text-white">{title}</div>
                <div className="">
                    <button onClick={()=>deleteFile()}  className={`${(AdminState)? "": "hidden"} absolute right-20 max-sm:right-10 `}>
                        <Image src={"/delete.png"} height={25} width={25} alt="loading.."/>
                    </button>
                    <button onClick={()=>setuploader(true)}  className={`${(AdminState)? "": "hidden"} absolute right-10 max-sm:right-2 `}>+</button>
                </div>
            </div>
          {(file.length > 0)?
                <div className=" flex justify-center mt-20">
                    <a className="border border-white px-2 py-1 rounded-md hover:text-blue-300 hover:border-blue-900 font-bold" href={file} target="blank">Get Resources</a>

                </div>
            : <div></div>
            }

            {(text.length > 0)?
                <div className={`${(file.length > 0)?"mt-10":"mt-20"} flex justify-center overflow-auto`}>
                    <div className=" px-10"> 
                        <div className="max-md:w-[600px] max-sm:w-[400px] px-4">Instructions : </div>
                        <div
                            className="w-[800px] mb-10 rounded-md max-md:w-[600px] max-sm:w-[400px] shadow-md shadow-slate-600 h-[500px] p-4 overflow-y-auto"
                            style={{ whiteSpace: "pre-wrap" }}
                            dangerouslySetInnerHTML={{
                                __html: formatText(text),
                            }}
                        />
                    </div>
                </div>
            : <div className="bg-transparent h-[400px] text-center"></div>
            }
      </div>
    )
}
    
interface UploaderCompoProps {
    setuploader: (value: boolean) => void,
}
  
function UploaderCompo({ setuploader }: UploaderCompoProps) {
      const [res, setRes] = useState<string>("");
      const [title, setTitle] = useState<string>("");
      // const [file, setFile] = useState<File | null>(null);
      const [file, setFile] = useState<string>("");
      const AdminState = useRecoilValue(adminState);
      const router = useRouter();
      const param = useParams();
      const id = param.id;

    const updateTitle = async()=>{
        if(!localStorage.getItem("Token") || !AdminState){
            alert("Authentication Required");
            return;
        }
        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/updateTitle`,
                {   
                    Title : title,
                    id,
                },{
                    headers : {
                        token : localStorage.getItem("Token")
                    }
                })
            if(response.data.msg === "Title updated"){
                alert("Title updated");
            }
            else{
                alert("Can not update")
            }
        }
        catch (e){
            console.log(e);
        }
    }
    const updateText = async()=>{
        if(!localStorage.getItem("Token") || !AdminState){
            alert("Authentication Required");
            return;
        }
        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/updateText`,
                {   
                    Text : res,
                    id,
                },{
                    headers : {
                        token : localStorage.getItem("Token")
                    }
                })
            if(response.data.msg === "Text updated"){
                alert("Text updated");
            }
            else{
                alert("Can not update")
            }
        }
        catch (e){
            console.log(e);
        }
    }
    const updateDrive = async()=>{
        if(!localStorage.getItem("Token") || !AdminState){
            alert("Authentication Required");
            return;
        }
        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/data/updatePDF`,
                {   
                    file,
                    id,
                },{
                    headers : {
                        token : localStorage.getItem("Token")
                    }
                })
            if(response.data.msg === "PDF updated"){
                alert("PDF updated");
            }
            else{
                alert("Can not update")
            }
        }
        catch (e){
            console.log(e);
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
            <button onClick={()=>{updateTitle()}} className="border p-2 bg-blue-600 hover:bg-blue-900 active:text-black text-white rounded-md mt-2">update Title</button>
            <div className="mb-4 mt-10 flex space-x-2">
              <label className="p-2">Drive Link of File: </label>
              <input className="p-2 bg-zinc-200 border border-black rounded-md w-[300px]"
                onChange={(e) => setFile(e.target.value)}
              />
            </div>
            <button onClick={()=>{updateDrive()}} className="border p-2 bg-blue-600 hover:bg-blue-900 active:text-black text-white rounded-md mt-2 mr-4">update Drive</button>
            <button onClick={()=>{updateText()}} className="border p-2 bg-blue-600 hover:bg-blue-900 active:text-black text-white rounded-md mt-2">update Text</button>
            <div className="mb-4 text-[13px]">
              Note: If you have more the One Link please use below Text box in Resources
            </div>
            <textarea
              onChange={(e) => setRes(e.target.value)}
              className="bg-zinc-200 border border-black rounded-lg h-[250px] w-full p-4"
              placeholder="Comment or some other Resources..."
            />

        </div>
      );
}