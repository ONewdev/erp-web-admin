'use client';

import { X, User, Mail, Phone, MapPin, Building, Briefcase, Info, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { UserItemDetails } from '@/services/user.service';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/Modal';

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserItemDetails | null;
}

export default function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
    if (!isOpen || !user) return null;

    const statusConfig = {
        active: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle, label: 'ใช้งานได้ (Active)' },
        pending: { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock, label: 'รออนุมัติ (Pending)' },
        inactive: { color: 'text-rose-600 bg-rose-50 border-rose-100', icon: AlertCircle, label: 'ถูกระงับ (Inactive)' },
    };

    const config = statusConfig[user.status] || statusConfig.pending;

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
            <ModalHeader onClose={onClose}>
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 font-kanit line-clamp-1">ข้อมูลสมาชิก</h3>
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mt-1 w-fit",
                        config.color
                    )}>
                        <config.icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{config.label}</span>
                    </div>
                </div>
            </ModalHeader>

            <ModalBody className="space-y-8 font-kanit">
                    
                    {/* Section: Account Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Info className="h-5 w-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest">ข้อมูลบัญชี</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard label="Username" value={user.username} icon={User} />
                            <InfoCard 
                                label="วันที่สมัคร" 
                                value={new Date(user.created_at).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })} 
                                icon={Calendar} 
                            />
                        </div>
                    </div>

                    {/* Section: Contact Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <Phone className="h-5 w-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest">ข้อมูลติดต่อ</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard label="ชื่อ-นามสกุล" value={user.contact_name || '-'} icon={User} />
                            <InfoCard label="บริษัท" value={user.company_name || '-'} icon={Building} />
                            <InfoCard label="อีเมล" value={user.email} icon={Mail} />
                            <InfoCard label="เบอร์โทรศัพท์" value={user.phone_number || '-'} icon={Phone} />
                            <div className="sm:col-span-2">
                                <InfoCard label="ที่อยู่" value={user.address || '-'} icon={MapPin} />
                            </div>
                        </div>
                    </div>

                    {/* Section: Business Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <Briefcase className="h-5 w-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest">ข้อมูลธุรกิจ</h4>
                        </div>
                        <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">แบรนด์</label>
                                <p className="text-slate-900 font-bold">{user.brand_names || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">หมวดหมู่สินค้า/บริการ</label>
                                <div className="flex flex-wrap gap-2">
                                    {user.product_categories ? user.product_categories.split(',').map((cat, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                                            {cat.trim()}
                                        </span>
                                    )) : <span className="text-slate-400 font-medium italic">ไม่ระบุ</span>}
                                </div>
                            </div>
                            {user.other_product_details && (
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">รายละเอียดอื่นๆ</label>
                                    <p className="text-slate-700 font-medium leading-relaxed">{user.other_product_details}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section: Marketing */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600">
                            <Calendar className="h-5 w-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest">แหล่งที่มา</h4>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">รู้จักเราผ่านทาง</label>
                            <p className="text-slate-900 font-bold mb-4">
                                {user.marketing_source ? user.marketing_source.replace(/[\[\]"]/g, '').split(',').join(', ') : '-'}
                            </p>
                            
                            {user.marketing_source_detail && user.marketing_source_detail !== '{}' && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">รายละเอียดเพิ่มเติม</label>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 font-mono text-sm space-y-1 shadow-sm overflow-x-auto">
                                        {(() => {
                                            try {
                                                const details = JSON.parse(user.marketing_source_detail);
                                                return Object.entries(details).map(([key, value]) => (
                                                    <div key={key} className="flex gap-2">
                                                        <span className="text-slate-400 shrink-0">{key}:</span> 
                                                        <span className="text-slate-900 font-bold">{value as string}</span>
                                                    </div>
                                                ));
                                            } catch (e) {
                                                return <p className="text-slate-900">{user.marketing_source_detail}</p>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

            </ModalBody>

            <ModalFooter>
                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-slate-200 transition-all active:scale-95"
                >
                    ปิดหน้าต่าง
                </button>
            </ModalFooter>
        </Modal>
    );
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group hover:bg-white transition-colors">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm group-hover:text-blue-600 transition-colors">
                    <Icon size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
            </div>
            <p className="text-slate-900 font-bold wrap-break-word">{value || '-'}</p>
        </div>
    );
}
