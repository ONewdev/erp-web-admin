"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Building2, Clock, Calendar } from "lucide-react";

interface ContactMessage {
    id: number;
    name: string;
    phone: string;
    email: string;
    company: string;
    service: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
}

export default function MessagePage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    // ปรับ URL ให้ตรงกับพาธที่คุณวางไฟล์ไว้
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/messages.php`;

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-2">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-1">กล่องข้อความติดต่อ (Contact Messages)</h2>
                    <p className="text-slate-400 font-medium">จัดการรายการติดต่อจากหน้าเว็บไซต์หลัก (BCI Public Site)</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Messages</div>
                            <div className="text-lg font-black text-slate-800 leading-none">{messages.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ผู้ติดต่อ</th>
                                <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">บริษัท / บริการที่สนใจ</th>
                                <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ข้อมูลติดต่อ</th>
                                <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">วันที่ส่ง</th>
                                <th className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-32 text-center">
                                        <div className="relative w-16 h-16 mx-auto mb-6">
                                            <div className="absolute inset-0 rounded-full border-4 border-brand/20"></div>
                                            <div className="absolute inset-0 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
                                        </div>
                                        <p className="text-slate-400 font-bold tracking-widest text-sm uppercase animate-pulse">Loading Messages...</p>
                                    </td>
                                </tr>
                            ) : messages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-32 text-center group">
                                        <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                            <Mail className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-lg mb-2">ยังไม่มีข้อความติดต่อเข้ามา</p>
                                        <p className="text-slate-300 text-sm">ข้อมูลที่ส่งมาจากหน้าเว็บจะปรากฏที่นี่โดยอัตโนมัติ</p>
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-brand/[0.02] transition-colors group cursor-default">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 text-brand rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-slate-200 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-brand group-hover:text-white group-hover:shadow-brand/30">
                                                    {msg.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800 text-base">{msg.name}</div>
                                                    <div className="text-xs text-slate-400 font-medium">{msg.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold text-[13px]">
                                                    <Building2 className="w-3.5 h-3.5 text-brand" />
                                                    {msg.company}
                                                </div>
                                                <div className="text-[10px] text-brand font-black bg-brand/5 inline-flex items-center px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                                    {msg.service || 'ทั่วไป'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3 text-slate-600 text-sm font-bold bg-slate-50/50 px-4 py-2.5 rounded-xl border border-transparent transition-all group-hover:border-slate-100 group-hover:bg-white w-fit">
                                                <Phone className="w-4 h-4 text-brand" />
                                                {msg.phone}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="text-sm text-slate-800 font-black">{formatDate(msg.created_at).split(' ')[0]}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{formatDate(msg.created_at).split(' ')[1]} {formatDate(msg.created_at).split(' ')[2]}</div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm border ${msg.status === 'new'
                                                ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/20'
                                                : msg.status === 'replied'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/20'
                                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                {msg.status === 'new' ? '• NEW RESPONSE' : msg.status === 'replied' ? '✓ REPLIED' : 'READ'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
