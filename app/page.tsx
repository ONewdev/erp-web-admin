"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold mb-1 tracking-tight text-slate-800">Hello, {user?.full_name || 'Admin'} 👋</h2>
        <p className="text-slate-400 font-medium font-kanit">ยินดีต้อนรับกลับสู่ระบบจัดการ BCI Company</p>
      </div>

      <div className="flex flex-col items-center justify-center py-32 text-center px-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-8">
        <div className="w-24 h-24 bg-brand/5 rounded-full flex items-center justify-center mb-6">
            <LayoutDashboard className="w-10 h-10 text-brand opacity-80" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">ยินดีต้อนรับเข้าสู่ระบบ</h3>
        <p className="text-slate-400 font-medium tracking-tight">เลือกเมนูด้านซ้ายเพื่อเริ่มต้นการจัดการข้อมูล</p>
      </div>
    </div>
  );
}
