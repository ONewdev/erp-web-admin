"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Mail,
    Download,
    Globe,
    Briefcase,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Users
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarItems = [
        { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
        { name: "กล่องข้อความ", href: "/message", icon: <MessageSquare size={20} /> },
        { name: "ที่อยู่ติดต่อ", href: "/contact", icon: <Mail size={20} /> },
        { name: " Job Opportunities", href: "/job", icon: <Briefcase size={20} /> },
        { name: "สมัคร BI", href: "/powerbi", icon: <BarChart3 size={20} /> },
        { name: "Page Stats", href: "/page-stats", icon: <Globe size={20} /> },
        { name: "Registered Users", href: "/users", icon: <Users size={20} /> },
    ];

    return (
        <aside
            className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out relative ${isCollapsed ? "w-24" : "w-72"
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand shadow-sm z-50 transition-all font-bold"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={`p-8 border-b border-slate-100 overflow-hidden ${isCollapsed ? "px-6" : "p-8"}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20 shrink-0">
                        B
                    </div>
                    {!isCollapsed && (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <h1 className="font-bold text-lg leading-tight whitespace-nowrap">BCI COMPANY</h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase whitespace-nowrap">Management Portal</p>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-4 py-3 rounded-2xl transition-all duration-300 ease-out group relative overflow-hidden active:scale-[0.96] ${isActive
                                ? "bg-brand text-white shadow-lg shadow-brand/30"
                                : "text-slate-500 hover:bg-blue-50/80 hover:text-brand"
                                } ${isCollapsed ? "px-0 justify-center" : "px-4"}`}
                            title={isCollapsed ? item.name : ""}
                        >
                            {/* Active Indicator Bar */}
                            {isActive && !isCollapsed && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-full" />
                            )}

                            <span className={`transition-all duration-300 shrink-0 ${isActive ? "text-white" : "group-hover:text-brand group-hover:scale-110"}`}>
                                {item.icon}
                            </span>

                            {!isCollapsed && (
                                <span className={`font-bold text-sm tracking-wide transition-colors duration-300 whitespace-nowrap animate-in fade-in slide-in-from-left-2 ${isActive ? "text-white" : "group-hover:text-brand"
                                    }`}>
                                    {item.name}
                                </span>
                            )}

                            {/* Hover Shine Effect */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-4 py-3 rounded-2xl transition-all duration-300 ease-out text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 font-bold text-sm ${isCollapsed ? "px-0 justify-center" : "px-4"}`}
                    title={isCollapsed ? "ออกจากระบบ" : ""}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span>ออกจากระบบ</span>}
                </button>
            </div>
        </aside>
    );
}

