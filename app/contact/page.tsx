"use client";

import React, { useState, useEffect } from "react";

export default function ContactSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        address: "",
        sales_phone: "",
        support_phone: "",
        facebook: "",
        youtube: "",
        google_maps: ""
    });

    // ในสถานการณ์จริง ควรเปลี่ยนเป็น URL ของ API Server ของคุณ
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/contact.php`;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (!data.error) {
                setFormData(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            // โหลดข้อมูลจำลองหากเชื่อมต่อ API ไม่ได้
            setFormData({
                company_name: "บริษัท บิสซิเนส คอมเพ็ดทิทีฟ อินเทลลิเจนซ์ จำกัด",
                address: "59/69 หมู่ 1 ซ.ติวานนท์ - ปากเกร็ด 56 ต.บ้านใหม่ อ.ปากเกร็ด จ.นนทบุรี 11120",
                sales_phone: "02-582-2110, 091-762-3838, 086-395-0364",
                support_phone: "083-122-6349, 091-762-3838, 086-321-3874",
                facebook: "https://www.facebook.com/q.soft/",
                youtube: "https://www.youtube.com/user/qsoftthai/",
                google_maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21904.272143554408!2d100.56008115037825!3d13.948788647682154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2836299299ac5%3A0xffd24ce376fe4efe!2z4Lia4LiI4LiBLiDguJrguLTguKrguIvguLTguYDguJnguKog4LiE4Lit4Lih4LmA4Lie4LmH4LiU4LiX4Li04LiX4Li14LifIOC4reC4tOC4meC5gOC4l-C4peC4peC4tOC5gOC4iOC4meC4i-C5jA!5e0!3m2!1sth!2sth!4v1768884936985!5m2!1sth!2sth"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                alert("อัปเดตข้อมูลเรียบร้อยแล้ว ✅");
            } else {
                alert("เกิดข้อผิดพลาด: " + result.message);
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบการตั้งค่า PHP server");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-1">จัดการข้อมูลการติดต่อ</h2>
                    <p className="text-slate-400 font-medium">แก้ไขข้อมูลที่จะนำไปแสดงในหน้าหลักของเว็บไซต์ (Public Site)</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-8 py-3 bg-brand text-white font-bold rounded-2xl hover:bg-brand-hover shadow-lg shadow-brand/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
            </div>

            <div className="max-w-3xl mx-auto space-y-12">
                {/* Section 1: Company info */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 bg-blue-50 text-brand rounded-2xl flex items-center justify-center text-lg shadow-sm">🏢</span>
                        <h3 className="font-bold text-xl text-slate-800">ข้อมูลบริษัทและที่อยู่</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อบริษัท (Company Name)</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleInputChange}
                                placeholder="ใส่ชื่อบริษัทของคุณ"
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-medium shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ที่อยู่สำนักงาน / สาขา</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="ระบุที่อยู่ที่ต้องการให้แสดง"
                                rows={4}
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all text-sm font-medium resize-none shadow-sm"
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* Section 2: Phones */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-lg shadow-sm">📞</span>
                        <h3 className="font-bold text-xl text-slate-800">ช่องทางการติดต่อ</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ฝ่ายขาย (Sales)</label>
                            <input
                                type="text"
                                name="sales_phone"
                                value={formData.sales_phone}
                                onChange={handleInputChange}
                                placeholder="02-XXX-XXXX, 08X-XXX-XXXX"
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand transition-all text-sm font-medium shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ฝ่าย Support</label>
                            <input
                                type="text"
                                name="support_phone"
                                value={formData.support_phone}
                                onChange={handleInputChange}
                                placeholder="02-XXX-XXXX, 08X-XXX-XXXX"
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand transition-all text-sm font-medium shadow-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 3: Social & Map */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-lg shadow-sm">🌐</span>
                        <h3 className="font-bold text-xl text-slate-800">โซเชียลมีเดียและแผนที่</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Facebook URL</label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand transition-all text-sm font-medium shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">YouTube URL</label>
                            <input
                                type="text"
                                name="youtube"
                                value={formData.youtube}
                                onChange={handleInputChange}
                                placeholder="https://youtube.com/user/yourchannel"
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand transition-all text-sm font-medium shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Google Maps Embed URL</label>
                        <input
                            type="text"
                            name="google_maps"
                            value={formData.google_maps}
                            onChange={handleInputChange}
                            placeholder="https://www.google.com/maps/embed?..."
                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand transition-all text-sm font-medium shadow-sm"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
