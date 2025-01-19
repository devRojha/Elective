import ClientLayout from "@/components/ClientLayout";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elective",
  description: "A platform where electrical students can find resources for their respective elective programs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}