// components/ClientLayout.tsx
"use client";

import { Inter } from "next/font/google";
import { RecoilRoot } from "recoil";
import Appbar from "./Appbar";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({ children }: { children: React.ReactNode }): JSX.Element{
  return (
    <RecoilRoot>
      <div className={inter.className}>
        <Appbar />
        <div className="pt-24 bg-white">
          {children}
        </div>
        <Footer />
      </div>
    </RecoilRoot>
  );
}