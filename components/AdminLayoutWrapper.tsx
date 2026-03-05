"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    if (loading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 font-kanit">
                <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
                <p className="text-slate-400 font-bold animate-pulse">กำลังตรวจสอบสิทธิ์เข้าใช้งาน...</p>
            </div>
        );
    }

    // If on login page, just show the login content
    if (pathname === "/login") {
        return <>{children}</>;
    }

    // If not logged in and not on login page, AuthContext will handle redirect
    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
