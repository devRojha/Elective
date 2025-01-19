"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ListItem {
    id: string;    // Adjust the type to your needs
    Title: string; // Assuming Title is a string
}
export default function MCT() {
    const [uploader , setuploader] = useState<boolean>(false);
    const [lists , setList] = useState<[]>([])
    const router = useRouter();

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await axios.post("http://localhost:4000/api/data/all",{
                Courses : "MCT"
            })
            if(response.data){
                setList(response.data.list);
            }
        }
        fetchData();
    },[])
    return (
      <div className="text-black h-screen">
            <div className={`${(uploader)?"fixed":"hidden"} h-screen w-full  flex justify-center border-green-400`}>
                <UploaderCompo setuploader={setuploader}/>
            </div>
          <div className="text-center text-2xl font-bold font-serif mb-20 flex justify-between">
            <button onClick={()=>router.push("/")} className="ml-10">--</button>
            <div>Modern Control Theory</div>
            <button onClick={()=> setuploader(true)} className="mr-10">+</button>
          </div>
          <div className="flex justify-center">
              <div className="flex flex-col justify-center space-y-4">
              {lists.map((list : ListItem) => (
                    <button key={list.id} className="text-center px-4 py-3 border border-black rounded-lg w-[375px]">{list.Title}</button>
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
    const [file, setFile] = useState<File | null>(null);
  
    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }
  
        const formData = new FormData();
        formData.append("file", file as Blob);
        formData.append("Title", title);
        formData.append("Courses", "ML");
        formData.append("Text", res);
  
        const response = await axios.post(
          "http://localhost:4000/api/data/upload",
          formData,
          {
            headers: {
              token: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        console.log("Upload response:", response.data);
      } catch (error) {
        console.error("Error uploading data:", error);
      }
    };
  
    return (
      <div className="rounded-md shadow-lg bg-zinc-200 h-[600px] w-[800px] p-10">
        <div className="flex w-full justify-end">
          <button onClick={() => setuploader(false)}>X</button>
        </div>
        <form onSubmit={submit}>
          <div className="flex space-x-2">
            <label className="p-2">Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 bg-zinc-200 border border-black rounded-md w-[300px]"
            />
          </div>
          <div className="mb-4 mt-10 flex space-x-2">
            <label>Upload File: </label>
            <input
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              type="file"
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
            type="submit"
            className="border border-black rounded-lg mt-2 px-3 py-2"
          >
            Upload
          </button>
        </form>
      </div>
    );
  }
  