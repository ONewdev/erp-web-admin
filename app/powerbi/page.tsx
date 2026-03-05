"use client";

import React, { useState, useEffect } from "react";
import {
    Clock,
    CheckCircle2,
    PhoneCall,
    Building2,
    User,
    Package,
    Settings2,
    Search,
    ArrowUpRight
} from "lucide-react";

interface PowerBIRequest {
    id: number;
    id_code: string;
    name: string;
    email: string;
    mobile: string;
    company: string;
    address: string;
    status: string;
    created_at: string;
}

export default function PowerBIAdminPage() {
    const [applications, setApplications] = useState<PowerBIRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ทั้งหมด");
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/powerbi.php`;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // เพิ่ม timestamp เพื่อป้องกันการดึงข้อมูลจาก Cache
            const response = await fetch(`${API_URL}?t=${Date.now()}`, {
                cache: 'no-store'
            });
            const data = await response.json();

            console.log("Power BI Data Fetched:", data);

            if (Array.isArray(data)) {
                setApplications(data);
            } else if (data.error || data.message) {
                alert("API Error: " + (data.error || data.message));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบว่า XAMPP ทำงานอยู่");
        } finally {
            setLoading(false);
        }
    };

    const filteredApps = applications.filter(item => {
        const matchesFilter = filter === "ทั้งหมด" || item.status === filter;
        const matchesSearch = item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.mobile?.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'รอดำเนินการ').length,
        approved: applications.filter(a => a.status === 'อนุมัติแล้ว').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="mb-10 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">รายชื่อลงทะเบียน Power BI</h2>
                    <p className="text-slate-400 font-medium">จัดการรายการผู้ลงทะเบียนอบรม Power BI (WINSpeed & myAccount)</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, บริษัท, เบอร์โทร..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all text-sm font-medium shadow-sm"
                        />
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                        {["ทั้งหมด", "รอดำเนินการ", "อนุมัติแล้ว", "กำลังติดต่อ"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filter === f ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-slate-400 hover:text-brand hover:bg-slate-50"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 relative z-10">ลงทะเบียนแล้ว</p>
                    <div className="flex items-end gap-3 relative z-10">
                        <h3 className="text-4xl font-black text-slate-800 leading-none">{stats.total}</h3>
                        <span className="text-sm font-bold text-slate-400 mb-1">คน</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold text-xs relative z-10">
                        <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                        <span>อัปเดตเรียลไทม์</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative border-l-4 border-l-amber-400">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 relative z-10">รอดำเนินการ</p>
                    <div className="flex items-end gap-3 relative z-10">
                        <h3 className="text-4xl font-black text-amber-500 leading-none">{stats.pending}</h3>
                        <span className="text-sm font-bold text-slate-400 mb-1">คน</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-slate-400 font-medium text-xs relative z-10">
                        <Clock className="w-4 h-4" />
                        <span>รอการตรวจสอบข้อมูล</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative border-l-4 border-l-emerald-400">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 relative z-10">ยืนยันแล้ว</p>
                    <div className="flex items-end gap-3 relative z-10">
                        <h3 className="text-4xl font-black text-emerald-500 leading-none">{stats.approved}</h3>
                        <span className="text-sm font-bold text-slate-400 mb-1">คน</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-slate-400 font-medium text-xs relative z-10">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>คิดเป็น {stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}% ของทั้งหมด</span>
                    </div>
                </div>
            </div>

            {/* Main Content Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden mb-12">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ลำดับ / วันที่</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ชื่อ-นามสกุล</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">ช่องทางติดต่อ</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">บริษัท & ที่อยู่</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">สถานะ</th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredApps.length > 0 ? filteredApps.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="px-8 py-7 border-b border-slate-50">
                                        <div className="font-black text-brand text-sm mb-1">{item.id_code}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH') : '-'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 border-b border-slate-50 font-bold text-slate-800 text-sm">
                                        {item.name}
                                    </td>
                                    <td className="px-8 py-7 border-b border-slate-50">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm font-bold text-slate-700">{item.mobile}</div>
                                            <div className="text-xs text-slate-400 italic">{item.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 border-b border-slate-50">
                                        <div className="font-bold text-slate-800 text-sm mb-1">{item.company}</div>
                                        <div className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[250px] line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {item.address}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 border-b border-slate-50 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black shadow-sm border ${item.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            item.status === "รอดำเนินการ" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-blue-50 text-blue-600 border-blue-100"
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === "อนุมัติแล้ว" ? "bg-emerald-500 animate-pulse" :
                                                item.status === "รอดำเนินการ" ? "bg-amber-500 animate-pulse" :
                                                    "bg-blue-500 animate-pulse"
                                                }`}></div>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-7 border-b border-slate-50 text-right">
                                        <button className="w-10 h-10 bg-slate-50 hover:bg-white hover:text-brand hover:border-brand/20 border border-slate-100 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90 overflow-hidden group/btn relative">
                                            <Settings2 className="w-4 h-4 relative z-10" />
                                            <div className="absolute inset-0 bg-brand/5 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                                                <Search className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <h4 className="text-slate-800 font-bold mb-1">ไม่พบข้อมูลการลงทะเบียน</h4>
                                            <p className="text-slate-400 text-xs font-medium">ลองเปลี่ยนคำค้นหาหรือตัวกรองเผื่อพบข้อมูลที่ต้องการ</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">แสดงทั้งหมด {filteredApps.length} รายการ</p>
                    <button
                        onClick={fetchData}
                        className="text-brand text-xs font-black hover:bg-brand/5 px-6 py-2 rounded-xl transition-all border border-brand/10"
                    >
                        รีเฟรชข้อมูล
                    </button>
                </div>
            </div>
        </div>
    );
}
