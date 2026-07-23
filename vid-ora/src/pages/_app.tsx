import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <UserProvider>
      <div className="min-h-screen bg-white text-black">
        <title>Vid-Ora</title>

        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <Toaster />

        <div className="flex">
          {sidebarOpen && <Sidebar />}
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  );
}