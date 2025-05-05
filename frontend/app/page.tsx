"use client"
import { useRouter } from "next/navigation";
// main page of the app
export default function Home() {
  const router = useRouter();
  return (
    <div className="text-black h-screen">
        <div className="text-center text-2xl font-bold font-serif mb-20">Electrical Elective Subjects</div>
        <div className="flex justify-center">
            <div className="flex flex-col justify-center space-y-4">
              <button onClick={()=> router.push("/ml")} className="text-center px-4 py-3 border border-black rounded-lg w-[375px]">Machine Learning</button>
              <button onClick={()=> router.push("/robotics")} className="text-center px-4 py-3 border border-black rounded-lg w-[375px]">Robotics</button>
              <button onClick={()=> router.push("/mct")} className="text-center px-4 py-3 border border-black rounded-lg w-[375px]">Modern Control Theory</button>
          </div>
        </div>
    </div>
  );
}
