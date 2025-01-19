


// app/pages/problemset/problem/[id]/index.tsx
"use client"

import { adminState } from "@/state/atom";
import axios from "axios";
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
    const AdminState = useRecoilValue(adminState)

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await axios.get("http://localhost:4000/api/data/info",{
                headers : {
                    id
                }
            })
            if(response.data.data){
                // console.log(response.data)
                setTitle(response.data.data.Title);
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
            const response = await axios.delete("http://localhost:4000/api/data/delete",{
                headers : {
                    token : localStorage.getItem("Token")
                },
                data :{
                    id,
                }
            })
            if(response.data.msg === "Deleted"){
                alert("Deleted");
                router.push("/");
            }
            else{
                alert("Cant Delete")
            }
        }
        catch (e){
            console.log(e);
        }
    }
    return (
        <div className=" bg-white text-black">
            <div className={`${(uploader)?"fixed":"hidden"} h-screen w-full  flex justify-center border-green-400`}>
                <UploaderCompo setuploader={setuploader}/>
            </div>
          <div className="text-center text-2xl font-bold font-serif mb-20 flex justify-center">
            <button  onClick={()=>router.push("/ml")} className=" absolute left-10 max-sm:left-2">--</button>
            <div>{title}</div>
            <button onClick={()=>deleteFile()}  className={`${(AdminState)? "": "hidden"} absolute right-20 max-sm:right-10`}>o</button>
            <button onClick={()=>setuploader(true)}  className={`${(AdminState)? "": "hidden"} absolute right-10 max-sm:right-2`}>+</button>
          </div>
          {(file.length > 0)?
                <div className=" flex justify-center mb-20">
                    <a className="border border-black px-2 py-1 rounded-md hover:text-blue-900 hover:border-blue-900 font-bold" href={file} target="blank">Get Document</a>

                </div>
            : <div></div>
            }

            {(text.length > 0)?
                <div className=" flex justify-center overflow-auto">
                    <div className="w-[800px] mb-10 rounded-md max-md:w-[600px] max-sm:w-[375px] shadow-lg shadow-slate-600 h-[500px] p-4">{text}</div>
                </div>
            : <div></div>
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


      // const submit = async (event: React.FormEvent<HTMLFormElement>) => {
      //   event.preventDefault();
    
      //   try {
      //     const token = localStorage.getItem("Token");
      //     if (!token) {
      //       console.error("Token not found in localStorage");
      //       return;
      //     }
    
      //     const formData = new FormData();
      //     formData.append("file", file as Blob);
      //     formData.append("Title", title);
      //     formData.append("Courses", "ML");
      //     formData.append("Text", res);
    
      //     const response = await axios.post(
      //       "http://localhost:4000/api/data/upload",
      //       formData,
      //       {
      //         headers: {
      //           token: token,
      //           "Content-Type": "multipart/form-data",
      //         },
      //       }
      //     );
    
      //     console.log("Upload response:", response.data);
      //   } catch (error) {
      //     console.error("Error uploading data:", error);
      //   }
      // };
    
    const updateTitle = async()=>{
        if(!localStorage.getItem("Token") || !AdminState){
            alert("Authentication Required");
            return;
        }
        try{
            const response = await axios.put("http://localhost:4000/api/data/updateTitle",
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
            const response = await axios.put("http://localhost:4000/api/data/updateText",
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
            const response = await axios.put("http://localhost:4000/api/data/updatePDF",
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
              Note: If your file is large, then please upload your file on Google
              Drive and paste the link in resources.
            </div>
            <textarea
              onChange={(e) => setRes(e.target.value)}
              className="bg-zinc-200 border border-black rounded-lg h-[250px] w-full p-4"
              placeholder="Resources..."
            />

        </div>
      );
}