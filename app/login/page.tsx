"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn, User, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");


        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "login", username, password }),
            });

            const data = await response.json();

            if (data.success) {
                login(data.user, data.token);
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Failed to connect to the server. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-kanit">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-brand/30 mx-auto mb-6">
                        B
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">BCI COMPANY</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Management Portal v1.0</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 p-10 border border-slate-100 relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 border-l-4 border-brand pl-4">เข้าสู่ระบบ</h2>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                                        placeholder="ป้อนชื่อผู้ใช้งาน"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                                        placeholder="ป้อนรหัสผ่าน"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-brand text-white font-black rounded-3xl hover:bg-brand-hover shadow-xl shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>เข้าสู่ระบบ</span>
                                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-slate-400 text-xs font-bold mt-10">
                    © 2026 BCI COMPANY. All rights reserved.
                </p>
            </div>
        </div>
    );
}
