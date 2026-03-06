'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, UserItemDetails } from '@/services/user.service';
import UserDetailModal from './UserDetailModal';
import ExportUserModal from './ExportUserModal';
import { 
    Users, 
    Search, 
    Download, 
    UserPlus, 
    MoreHorizontal, 
    Eye, 
    ChevronLeft, 
    ChevronRight, 
    Filter,
    Loader2,
    Building,
    Mail,
    Phone,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function AdminUsersPage() {
    const [usersList, setUsersList] = useState<UserItemDetails[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Pagination & Search Filters
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; total_pages: number } | null>(null);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserItemDetails | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers({ 
                page, 
                limit, 
                search,
                status: statusFilter === 'all' ? undefined : statusFilter
            });
            
            if (data.status === 'success') {
                setUsersList(data.data.users);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit, statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleViewDetails = (user: UserItemDetails) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 font-kanit">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registered Users</h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        จัดการรายชื่อผู้ใช้งานและสมาชิกทั้งหมดในระบบ
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsExportModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 gap-2"
                    >
                        <Download className="h-5 w-5" />
                        <span>ส่งออก Excel</span>
                    </button>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-6 items-center">
                <form onSubmit={handleSearch} className="flex-1 w-full relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                        <Search className="h-5 w-5" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ดึงรายชื่อจาก: ชื่อผู้ใช้งาน, อีเมล, บริษัท, เบอร์โทร..."
                        className="block w-full pl-14 pr-32 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all shadow-inner"
                    />
                    <button 
                        type="submit" 
                        className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-slate-200 transition-all active:scale-95"
                    >
                        ค้นหา
                    </button>
                </form>

                <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                    {[
                        { label: 'ทั้งหมด', value: 'all' },
                        { label: 'ใช้งานได้', value: 'active' },
                        { label: 'รออนุมัติ', value: 'pending' },
                        { label: 'ถูกระงับ', value: 'inactive' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all transition-duration-200 flex items-center gap-2 border",
                                statusFilter === opt.value
                                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 shadow-sm"
                            )}
                        >
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                opt.value === 'active' ? "bg-emerald-400" : 
                                opt.value === 'pending' ? "bg-amber-400" : 
                                opt.value === 'inactive' ? "bg-rose-400" : "bg-slate-300"
                            )} />
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-bold">กำลังอัปเดตข้อมูล...</p>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-20">#</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User Information</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Company</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {usersList.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-300">
                                            <Users size={64} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold text-slate-400">ไม่พบรายชื่อผู้ใช้งานที่คุณค้นหา</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                usersList.map((user, index) => (
                                    <tr key={user.user_id} className="group hover:bg-slate-50 transition-colors duration-200">
                                        <td className="px-8 py-6">
                                            <span className="text-slate-400 font-mono font-bold text-sm">
                                                {((page - 1) * limit) + index + 1}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm group-hover:scale-110 transition-transform select-none">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 font-black text-base">{user.username}</span>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-0.5 tracking-tight group-hover:text-blue-500 transition-colors">
                                                        <Mail size={12} strokeWidth={3} />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm tracking-tight">
                                                    <Building size={14} className="text-slate-400" />
                                                    {user.company_name || '-'}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                                                    <UserPlus size={14} className="text-slate-300" />
                                                    {user.contact_name || user.phone_number || '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(user.created_at).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 ml-6">Registered</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={cn(
                                                "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border shadow-sm transition-all",
                                                user.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white" : 
                                                user.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600 group-hover:text-white" : 
                                                "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white"
                                            )}>
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    user.status === 'active' ? "bg-emerald-400" : 
                                                    user.status === 'pending' ? "bg-amber-400" : "bg-rose-400",
                                                    "group-hover:bg-white transition-colors"
                                                )} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => handleViewDetails(user)}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:shadow-xl hover:shadow-slate-200 transition-all active:scale-95 group-hover:bg-blue-600 shadow-sm"
                                            >
                                                <Eye size={14} strokeWidth={3} />
                                                <span>View Profile</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.total_pages > 1 && (
                    <div className="px-8 py-8 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-6 font-kanit">
                        <div className="text-slate-400 text-sm font-bold">
                            Showing <span className="text-slate-900 font-black">{(pagination.page - 1) * pagination.limit + 1}</span> to 
                            <span className="text-slate-900 font-black"> {Math.min(pagination.page * pagination.limit, pagination.total)}</span> of 
                            <span className="text-slate-900 font-black"> {pagination.total}</span> users
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:shadow-lg hover:shadow-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none group active:scale-95"
                            >
                                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                            </button>
                            
                            <div className="flex gap-2 mx-2">
                                {[...Array(pagination.total_pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={cn(
                                            "h-12 w-12 rounded-2xl text-sm font-black transition-all active:scale-95",
                                            page === i + 1
                                            ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-110"
                                            : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setPage(Math.min(pagination.total_pages, page + 1))}
                                disabled={page === pagination.total_pages}
                                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:shadow-lg hover:shadow-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none group active:scale-95"
                            >
                                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserDetailModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={selectedUser} 
            />

            <ExportUserModal 
                isOpen={isExportModalOpen} 
                onClose={() => setIsExportModalOpen(false)} 
            />
        </div>
    );
}
