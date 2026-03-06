"use client";

import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Briefcase,
    Loader2,
    X,
    Eye,
    EyeOff
} from "lucide-react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal';

interface Job {
    id: number;
    title: string;
    positions: number;
    description: string;
    workType: string;
    tags: string;
    responsibilities: string;
    benefits: string;
    qualifications: string;
    contact: string;
    status: string;
    image: string;
    is_visible: number;
    sort_order: number;
    created_at?: string;
}

export default function JobAdminPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Job>>({
        title: "",
        positions: 1,
        description: "",
        workType: "งานประจำ",
        tags: "",
        responsibilities: "",
        benefits: "",
        qualifications: "",
        contact: "",
        status: "เปิดรับสมัคร",
        image: "",
        is_visible: 1,
        sort_order: 0
    });

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/jobs.php`;

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}?t=${Date.now()}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setJobs(data);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (job: Job | null = null) => {
        if (job) {
            setEditingJob(job);
            setFormData(job);
        } else {
            setEditingJob(null);
            setFormData({
                title: "",
                positions: 1,
                description: "",
                workType: "งานประจำ",
                tags: "",
                responsibilities: "",
                benefits: "",
                qualifications: "",
                contact: "",
                status: "เปิดรับสมัคร",
                image: "",
                is_visible: 1,
                sort_order: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = editingJob ? "PUT" : "POST";
            const response = await fetch(API_URL, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingJob ? { ...formData, id: editingJob.id } : formData)
            });
            const result = await response.json();
            if (result.success) {
                fetchJobs();
                setIsModalOpen(false);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error saving job:", error);
        } finally {
            setSaving(false);
        }
    };

    const toggleVisibility = async (job: Job) => {
        try {
            const updatedJob = { ...job, is_visible: job.is_visible === 1 ? 0 : 1 };
            const response = await fetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedJob)
            });
            const result = await response.json();
            if (result.success) {
                setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งงานนี้?")) return;
        try {
            const response = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
            const result = await response.json();
            if (result.success) {
                fetchJobs();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    // Handle File Change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isModalOpen]);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">จัดการตำแหน่งงาน</h2>
                    <p className="text-slate-400 font-medium tracking-wide italic uppercase text-[10px]">Job Opportunities Management</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-2xl hover:bg-brand-hover shadow-xl shadow-brand/20 active:scale-95 transition-all text-sm group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    เพิ่มข่าวรับสมัครงาน
                </button>
            </div>

            {/* Filters & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-3 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-2">
                    <div className="pl-4">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อตำแหน่ง หรือ รายละเอียด..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 py-3 px-2 focus:outline-none font-medium text-slate-700 placeholder:text-slate-300 bg-transparent"
                    />
                </div>
                <div className="bg-brand/5 border border-brand/10 p-4 rounded-3xl flex items-center justify-between px-8">
                    <span className="text-slate-500 font-bold text-sm">ทั้งหมด</span>
                    <span className="text-3xl font-black text-brand leading-none">{jobs.length}</span>
                </div>
            </div>

            {/* Job Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
                        <p className="text-slate-400 font-bold animate-pulse">กำลังดึงข้อมูลตำแหน่งงาน...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-20">ลำดับ</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ข้อมูลตำแหน่งงาน</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">จำนวน</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">แสดงผล</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map((job) => (
                                    <tr key={job.id} className={`border-b border-slate-50 hover:bg-slate-50/30 transition-colors group ${job.is_visible === 0 ? "opacity-60 bg-slate-50/50" : ""}`}>
                                        <td className="px-6 py-6 text-center font-bold text-slate-400">
                                            {job.sort_order}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <div className="font-bold text-slate-800 text-base group-hover:text-brand transition-colors">{job.title}</div>
                                                <div className="text-slate-400 text-xs font-medium line-clamp-1">{job.workType || 'งานประจำ'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 min-w-[3rem]">
                                                {job.positions}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <button
                                                onClick={() => toggleVisibility(job)}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${job.is_visible === 1 ? "bg-emerald-500" : "bg-slate-200"}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${job.is_visible === 1 ? "left-7" : "left-1"}`}></div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${job.status === "รับสมัครด่วน"
                                                ? "bg-rose-50 text-rose-500 border-rose-100"
                                                : job.status === "เปิดรับสมัคร"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-slate-50 text-slate-400 border-slate-200"
                                                }`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(job)}
                                                    className="w-9 h-9 bg-white text-slate-400 hover:bg-brand hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-slate-100 active:scale-90"
                                                    title="แก้ไข"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="w-9 h-9 bg-white text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-slate-100 active:scale-90"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">ไม่พบข้อมูลตำแหน่งงาน</h3>
                        <p className="text-slate-400 font-medium tracking-tight">ลองเปลี่ยนคำค้นหา หรือเริ่มต้นสร้างข่าวรับสมัครงานใหม่</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <ModalHeader onClose={() => setIsModalOpen(false)}>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">{editingJob ? "แก้ไขข้อมูลงาน" : "เพิ่มข่าวรับสมัครงาน"}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Fill in the details below</p>
                    </div>
                </ModalHeader>

                <ModalBody className="no-scrollbar p-8">
                    <form id="jobForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อตำแหน่งงาน <span className="text-rose-500">*</span></label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all font-bold text-slate-800"
                                            placeholder="ตัวอย่าง: Senior Backend Developer"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">จำนวนที่รับ</label>
                                        <input
                                            type="number"
                                            value={formData.positions}
                                            onChange={(e) => setFormData({ ...formData, positions: parseInt(e.target.value) })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ลำดับการแสดงผล</label>
                                        <input
                                            type="number"
                                            value={formData.sort_order}
                                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สถานะรับสมัคร</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none border-brand transition-all font-bold text-slate-800 appearance-none"
                                        >
                                            <option value="รับสมัครด่วน">รับสมัครด่วน</option>
                                            <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                                            <option value="ปิดรับสมัคร">ปิดรับสมัคร</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">การแสดงผลบนเว็บ</label>
                                        <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, is_visible: formData.is_visible === 1 ? 0 : 1 })}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.is_visible === 1 ? "bg-emerald-500" : "bg-slate-300"}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${formData.is_visible === 1 ? "left-7" : "left-1"}`}></div>
                                            </button>
                                            <span className="text-sm font-bold text-slate-600">{formData.is_visible === 1 ? "แสดงบนเว็บไซต์" : "ซ่อนจากเว็บไซต์"}</span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ประเภทงาน</label>
                                        <input
                                            type="text"
                                            value={formData.workType}
                                            onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800"
                                            placeholder="เช่น งานประจำ / จันทร์-ศุกร์"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รายละเอียดงานย่อ</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800"
                                            placeholder="สรุปสั้นๆ เกี่ยวกับตำแหน่งงาน"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">แท็ก (คั่นด้วยคอมม่า)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800"
                                            placeholder="React, Node.js, PHP"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หน้าที่ความรับผิดชอบ</label>
                                        <textarea
                                            rows={4}
                                            value={formData.responsibilities}
                                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800 min-h-[120px]"
                                            placeholder="ระบุหน้าที่ความรับผิดชอบ..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">คุณสมบัติ</label>
                                        <textarea
                                            rows={4}
                                            value={formData.qualifications}
                                            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800 min-h-[120px]"
                                            placeholder="ระบุคุณสมบัติของผู้สมัคร..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สวัสดิการ</label>
                                        <textarea
                                            rows={3}
                                            value={formData.benefits}
                                            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800 min-h-[100px]"
                                            placeholder="ระบุสวัสดิการ..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ข้อมูลติดต่อ</label>
                                        <input
                                            type="text"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand transition-all font-bold text-slate-800"
                                            placeholder="เบอร์โทรศัพท์ หรือ อีเมลสำหรับสมัครงาน"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รูปภาพประกอบ</label>
                                        <div className="flex items-center gap-4">
                                            {formData.image ? (
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 relative group/img">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image: "" })}
                                                        className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : null}
                                            <label className="flex-1 cursor-pointer group">
                                                <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl group-hover:border-brand group-hover:bg-brand/5 transition-all">
                                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                        <Plus className="w-6 h-6 text-slate-400 group-hover:text-brand" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 group-hover:text-brand">คลิกเพื่อเลือกไฟล์รูปภาพ</span>
                                                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG (Max 2MB)</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                </ModalBody>

                <ModalFooter className="flex gap-4 w-full justify-between">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                        ยกเลิก
                    </button>
                    <button
                        type="submit"
                        form="jobForm"
                        disabled={saving}
                        className="flex-2 py-4 bg-brand text-white font-bold rounded-2xl hover:bg-brand-hover shadow-xl shadow-brand/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingJob ? "อัปเดตข้อมูล" : "สร้างตำแหน่งงาน")}
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
