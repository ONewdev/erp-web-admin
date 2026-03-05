"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: number;
    username: string;
    full_name: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const savedUser = localStorage.getItem("admin_user");
        const token = localStorage.getItem("admin_token");

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
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

    const logout = () => {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
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
