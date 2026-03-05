"use client";

import React from "react";
import { usePathname } from "next/navigation";

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);

import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const pathname = usePathname();
    const { user } = useAuth();

    const menuMap: { [key: string]: string } = {
        "": "แดชบอร์ด",
        "feature": "คุณสมบัติ",
        "message": "กล่องข้อความ",
        "contact": "ติดต่อเรา",
        "download": "ดาวน์โหลด",
        "site": "ผลงานของเรา",
        "blog": "บทความ",
        "course": "course อบรม",
        "job": "Job Opportunities",
        "powerbi": "สมัคร BI",
        "settings": "ตั้งค่าระบบ"
    };

    const segments = pathname.split('/').filter(Boolean);
    const pageTitle = segments.length > 0
        ? (menuMap[segments[segments.length - 1]] || segments[segments.length - 1].toUpperCase())
        : "แดชบอร์ด";

    return (
        <header className="h-20 bg-white border-b border-blue-50 flex items-center justify-between px-8 shrink-0 shadow-[0_4px_24px_rgba(14,154,239,0.03)]">
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest mb-1">
                    <span className="text-brand">หน้าหลัก</span>
                    {segments.map((s, i) => (
                        <React.Fragment key={i}>
                            <span className="text-slate-300">/</span>
                            <span>{s.toUpperCase()}</span>
                        </React.Fragment>
                    ))}
                </div>
                <h2 className="font-bold text-lg text-slate-800 tracking-tight">{pageTitle}</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button className="relative p-2.5 text-slate-400 hover:text-brand hover:bg-blue-50 rounded-xl transition-all">
                        <BellIcon />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-6 border-l border-blue-50">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-800">{user?.full_name || "ผู้ดูแลระบบ"}</p>
                            <p className="text-[10px] text-brand font-bold uppercase tracking-widest">{user?.username || "Admin"}</p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand to-blue-400 border-2 border-white overflow-hidden shadow-lg shadow-brand/20 hover:scale-105 transition-transform cursor-pointer flex items-center justify-center text-white font-bold text-lg">
                            {user?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
