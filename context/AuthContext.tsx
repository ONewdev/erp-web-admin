"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE } from "@/utils/config";

interface User {
    id: number;
    username: string;
    full_name: string;
    email?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/check_auth.php`, {
                credentials: 'include',
            });
            const data = await res.json();
            
            if (data.status === 'success' && data.data.user) {
                setUser(data.data.user);
                localStorage.setItem("admin_user", JSON.stringify(data.data.user));
            } else {
                setUser(null);
                localStorage.removeItem("admin_user");
                localStorage.removeItem("admin_token");
                if (pathname !== "/login") {
                    router.push("/login");
                }
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial check
        const savedUser = localStorage.getItem("admin_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        checkAuth();
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== "/login") {
                router.push("/login");
            } else if (user && pathname === "/login") {
                router.push("/");
            }
        }
    }, [user, loading, pathname, router]);

    const login = (userData: User, token: string) => {
        localStorage.setItem("admin_user", JSON.stringify(userData));
        localStorage.setItem("admin_token", token);
        setUser(userData);
        router.push("/");
    };

    const logout = async () => {
        try {
            // Optional: call a backend logout to destroy session
            await fetch(`${API_BASE}/admin/logout.php`, { credentials: 'include', method: 'POST' });
        } catch (e) {
            console.error("Logout API failed", e);
        }
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth, loading }}>
            {loading && pathname !== "/login" ? (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold animate-pulse font-kanit">กำลังตรวจสอบสิทธิ์...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
