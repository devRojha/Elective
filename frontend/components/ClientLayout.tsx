// components/ClientLayout.tsx
"use client";

import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";
import Appbar from "./Appbar";
import Footer from "./Footer";
import AppMenu from "./AppMenu";
import BackgroundStyle from "@/styleComponents/BackGroundStyle";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <RecoilRoot>
      <div className={`${inter.className} relative min-h-screen`}>
        
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <BackgroundStyle />
        </div>

        {/* Foreground */}
        <Appbar />
        <AppMenu />
        <main className="pt-24 relative z-10 bg-transparent">
          {children}
        </main>
        <Footer />
      </div>
    </RecoilRoot>
  );
}
