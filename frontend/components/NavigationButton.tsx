'use client'
import { useRouter } from "next/navigation";




export default function NavigationButton({url, name} : {url : string, name : string}) {
  const router = useRouter();
  return (
    <>
      <button onClick={()=> router.push(`${url}`)} className="text-center text-zinc-400 px-4 py-3 border border-slate-600 hover:border-blue-900 rounded-lg w-[375px]">{name}</button>
    </>
  )
}
