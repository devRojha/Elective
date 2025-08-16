"use client"
import HeadingTheme from "@/components/HeadingTheme";
import NavigationButton from "@/components/NavigationButton";
import { useRouter } from "next/navigation";
// main page of the app
export default function Home() {
  const router = useRouter();
  return (
    <div className="text-white h-screen">
        <div className="text-center text-2xl font-bold font-serif mb-20"><HeadingTheme first="Electrical " second="Elective " third="Subjects"/></div>
        <div className="flex justify-center">
            <div className="flex flex-col justify-center space-y-4">
              <NavigationButton url="/ml" name="Machine Learning"/>
              <NavigationButton url="/robotics" name="Robotics"/>
              <NavigationButton url="/mct" name="Modern Control Theory"/>
          </div>
        </div>
    </div>
  );
}
