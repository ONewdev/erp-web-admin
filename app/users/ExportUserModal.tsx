'use client';

import { Fragment, useState } from 'react';
import * as XLSX from 'xlsx';
import { getAllUsers } from '@/services/user.service';
import { X, Download, Calendar, Filter, FileText, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal';

interface ExportUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExportUserModal({ isOpen, onClose }: ExportUserModalProps) {
    const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
    const [dateRangeMode, setDateRangeMode] = useState<'all' | 'custom'>('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [animation, setAnimation] = useState(false);

    // Columns grouped for UX
    const [selectedGroups, setSelectedGroups] = useState({
        basic: true, // username, email, company
        contact: true, // phone, contact_name, address
        business: true, // brand_names, product_categories
        system: true // created_at, status, marketing_source
    });

    const handleCheckboxChange = (group: keyof typeof selectedGroups) => {
        setSelectedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const response = await getAllUsers({
                limit: 'all',
                status: statusFilter,
                start_date: dateRangeMode === 'custom' ? startDate : undefined,
                end_date: dateRangeMode === 'custom' ? endDate : undefined
            });

            if (response.status === 'success' && response.data.users) {
                const users = response.data.users;
                
                const dataToExport = users.map(user => {
                    const row: Record<string, any> = {};
                    
                    if (selectedGroups.basic) {
                        row['Username'] = user.username;
                        row['Email'] = user.email;
                        row['Company Name'] = user.company_name || '-';
                    }
                    if (selectedGroups.contact) {
                        row['Contact Name'] = user.contact_name || '-';
                        row['Phone Number'] = user.phone_number || '-';
                        row['Address'] = user.address || '-';
                    }
                    if (selectedGroups.business) {
                        row['Brand Names'] = user.brand_names || '-';
                        row['Product Categories'] = user.product_categories || '-';
                        row['Other Details'] = user.other_product_details || '-';
                    }
                    if (selectedGroups.system) {
                        row['Status'] = user.status;
                        row['Registration Date'] = new Date(user.created_at).toLocaleString('th-TH');
                        row['Marketing Source'] = user.marketing_source ? user.marketing_source.replace(/[\[\]"]/g, '') : '-';
                        
                        try {
                            if (user.marketing_source_detail && user.marketing_source_detail !== '{}') {
                                const details = JSON.parse(user.marketing_source_detail);
                                row['Marketing Details'] = Object.entries(details)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(' | ');
                            } else {
                                row['Marketing Details'] = '-';
                            }
                        } catch {
                            row['Marketing Details'] = user.marketing_source_detail || '-';
                        }
                    }
                    return row;
                });

                if (dataToExport.length === 0) {
                    alert('ไม่พบข้อมูลตามเงื่อนไขที่เลือก');
                    setIsLoading(false);
                    return;
                }

                const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
                    wch: Math.max(key.length, ...dataToExport.map(row => (row[key] ? row[key].toString().length : 0))) + 2
                }));
                worksheet['!cols'] = colWidths;

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

                const fileName = `UsersReport_${new Date().toISOString().slice(0, 10)}.xlsx`;
                XLSX.writeFile(workbook, fileName);
                
                onClose(); 
            }
        } catch (error) {
            console.error('Failed to export:', error);
            alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" className="font-kanit">
            <ModalHeader onClose={onClose}>
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
                    <Download className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">ส่งออกข้อมูล (Export)</h3>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1 line-clamp-1">Excel Report Generator</p>
                </div>
            </ModalHeader>

            <ModalBody className="space-y-8">

                    
                    {/* Date Filters */}
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            ช่วงวันที่สมัคร
                        </label>
                        <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
                            {[
                                { label: 'ทั้งหมด', value: 'all' },
                                { label: 'เลือกช่วงเวลา', value: 'custom' },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDateRangeMode(opt.value as any)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl text-sm font-bold transition-all transition-duration-200",
                                        dateRangeMode === opt.value
                                            ? "bg-white text-blue-600 shadow-md shadow-blue-100/50 ring-1 ring-slate-200"
                                            : "text-slate-500 hover:text-slate-800"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {dateRangeMode === 'custom' && (
                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เริ่มจาก</label>
                                    <input 
                                        type="date" 
                                        value={startDate} 
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-slate-50 px-4 py-3.5 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">จนถึง</label>
                                    <input 
                                        type="date" 
                                        value={endDate} 
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-slate-50 px-4 py-3.5 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all shadow-inner"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Filter className="h-4 w-4 text-emerald-600" />
                            สถานะผู้ใช้งาน
                        </label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-slate-50 px-4 py-4 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100/50 transition-all shadow-inner appearance-none cursor-pointer"
                        >
                            <option value="all">ทุกสถานะ (All Status)</option>
                            <option value="active">ใช้งานได้ (Active)</option>
                            <option value="pending">รออนุมัติ (Pending)</option>
                            <option value="inactive">ถูกระงับ (Inactive)</option>
                        </select>
                    </div>

                    {/* Column Groups */}
                    <div className="space-y-4">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="h-4 w-4 text-indigo-600" />
                            ข้อมูลที่ต้องการแสดง
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { id: 'basic', label: 'บัญชีพื้นฐาน', desc: 'Username, Email, Company' },
                                { id: 'contact', label: 'การติดต่อ', desc: 'ชื่อ, เบอร์, ที่อยู่' },
                                { id: 'business', label: 'ข้อมูลธุรกิจ', desc: 'แบรนด์, หมวดหมู่' },
                                { id: 'system', label: 'ข้อมูลระบบ', desc: 'วันที่สมัคร, แหล่งที่มา' },
                            ].map((group) => (
                                <button
                                    key={group.id}
                                    onClick={() => handleCheckboxChange(group.id as any)}
                                    className={cn(
                                        "p-4 rounded-4xl border transition-all text-left flex items-start gap-3 group relative overflow-hidden active:scale-95",
                                        selectedGroups[group.id as keyof typeof selectedGroups]
                                            ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 shadow-sm"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-xl transition-colors",
                                        selectedGroups[group.id as keyof typeof selectedGroups]
                                            ? "bg-white/10 text-white"
                                            : "bg-slate-50 text-slate-300 group-hover:text-slate-900 group-hover:bg-slate-100"
                                    )}>
                                        <Check size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight mb-1">{group.label}</p>
                                        <p className="text-[10px] uppercase font-black tracking-tighter opacity-60 leading-none">{group.desc}</p>
                                    </div>
                                    {selectedGroups[group.id as keyof typeof selectedGroups] && (
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <FileText size={48} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
            </ModalBody>

            <ModalFooter className="bg-slate-50 flex gap-4 w-full justify-between">
                <button
                    onClick={onClose}
                    className="flex-1 px-8 py-4 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
                >
                    ยกเลิก
                </button>
                <button
                    onClick={handleExport}
                    disabled={isLoading || (!selectedGroups.basic && !selectedGroups.contact && !selectedGroups.business && !selectedGroups.system)}
                    className="flex-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <Download size={20} />
                            <span>ดาวน์โหลด Excel</span>
                        </>
                    )}
                </button>
            </ModalFooter>
        </Modal>
    );
}
