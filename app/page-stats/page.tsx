'use client';

import { useState, useEffect } from 'react';
import { 
    getPageStats, 
    cleanupPageStats, 
    StatsData 
} from '@/services/page-stats.service';
import { 
    Eye, 
    Users, 
    TrendingUp, 
    Globe, 
    Smartphone, 
    Tablet, 
    Monitor, 
    Trash2, 
    AlertTriangle,
    ChevronRight,
    Calendar,
    Loader2
} from 'lucide-react';

export default function PageStatsPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7');
    const [cleanupDays, setCleanupDays] = useState(30);
    const [cleanupLoading, setCleanupLoading] = useState(false);
    const [cleanupResult, setCleanupResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [range]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getPageStats(range);
            if (data.status === 'success') {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCleanup = async () => {
        setCleanupLoading(true);
        setCleanupResult(null);
        try {
            const data = await cleanupPageStats(cleanupDays);
            if (data.status === 'success' && data.data) {
                setCleanupResult({ 
                    message: `ลบสำเร็จ ${data.data.deleted_count} รายการ (เก่ากว่า ${data.data.days} วัน)`, 
                    type: 'success' 
                });
                fetchStats();
            } else {
                setCleanupResult({ 
                    message: data.message || 'เกิดข้อผิดพลาด', 
                    type: 'error' 
                });
            }
        } catch {
            setCleanupResult({ message: 'ไม่สามารถเชื่อมต่อ API ได้', type: 'error' });
        } finally {
            setCleanupLoading(false);
            setShowConfirm(false);
        }
    };

    const getMaxViews = () => {
        if (!stats?.daily_trend?.length) return 1;
        return Math.max(...stats.daily_trend.map(d => Number(d.views)), 1);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    };

    const getPageLabel = (page: string) => {
        const labels: Record<string, string> = {
            '/': 'หน้าแรก',
            '/about': 'เกี่ยวกับเรา',
            '/contact': 'ติดต่อเรา',
            '/news': 'ข่าวสาร',
            '/products': 'สินค้า',
        };
        return labels[page] || page;
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'mobile': return <Smartphone className="h-5 w-5" />;
            case 'tablet': return <Tablet className="h-5 w-5" />;
            case 'desktop': return <Monitor className="h-5 w-5" />;
            default: return <Globe className="h-5 w-5" />;
        }
    };

    const getDeviceLabel = (type: string) => {
        const labels: Record<string, string> = {
            desktop: 'Desktop',
            mobile: 'Mobile',
            tablet: 'Tablet',
            unknown: 'Unknown',
        };
        return labels[type] || type;
    };

    const deviceColors: Record<string, string> = {
        desktop: 'bg-blue-600',
        mobile: 'bg-emerald-600',
        tablet: 'bg-indigo-600',
        unknown: 'bg-slate-400',
    };

    const textColors: Record<string, string> = {
        desktop: 'text-blue-600',
        mobile: 'text-emerald-600',
        tablet: 'text-indigo-600',
        unknown: 'text-slate-400',
    };

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูลสถิติ...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-kanit">Page Statistics</h1>
                    <p className="text-slate-500 mt-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        รายงานภาพรวมการเข้าชมเว็บไซต์และสถิติรายวัน
                    </p>
                </div>
                
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
                    {[
                        { label: '7 วัน', value: '7' },
                        { label: '30 วัน', value: '30' },
                        { label: '90 วัน', value: '90' },
                        { label: 'ทั้งหมด', value: 'all' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setRange(opt.value)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                range === opt.value
                                    ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { title: 'วันนี้ (Views)', value: stats?.today?.today_views, icon: Eye, color: 'blue', label: 'views' },
                    { title: 'วันนี้ (จำนวนคน)', value: stats?.today?.today_unique, icon: Users, color: 'emerald', label: 'visitors' },
                    { title: 'ทั้งหมด (Views)', value: stats?.summary?.total_views, icon: TrendingUp, color: 'indigo', label: 'views' },
                    { title: 'ทั้งหมด (จำนวนคน)', value: stats?.summary?.total_unique_users, icon: Globe, color: 'amber', label: 'visitors' },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">{card.title}</span>
                            <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-900 tabular-nums">
                                {Number(card.value || 0).toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-sm font-medium">{card.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trend Chart Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-10 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 font-kanit">กราฟยอดสถิติรายวัน</h3>
                    </div>
                </div>
                <div className="p-8">
                    {stats?.daily_trend && stats.daily_trend.length > 0 ? (
                        <div className="flex items-end gap-2 h-64 overflow-x-auto pb-4 custom-scrollbar">
                            {stats.daily_trend.map((day, i) => {
                                const maxViews = getMaxViews();
                                const height = (Number(day.views) / maxViews) * 100;
                                const uniqueHeight = (Number(day.unique_users) / maxViews) * 100;
                                return (
                                    <div key={i} className="flex-1 min-w-[40px] max-w-[80px] flex flex-col items-center group relative">
                                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-xl transform scale-90 group-hover:scale-100">
                                            <div className="font-bold border-b border-slate-700 pb-1 mb-1">{formatDate(day.stat_date)}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                <span>Views: {Number(day.views).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                <span>Unique: {Number(day.unique_users).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full flex gap-1 justify-center h-48 items-end px-1">
                                            <div
                                                className="flex-1 bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] shadow-sm"
                                                style={{ height: `${Math.max(height, 2)}%` }}
                                            />
                                            <div
                                                className="flex-1 bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] shadow-sm"
                                                style={{ height: `${Math.max(uniqueHeight, 1)}%` }}
                                            />
                                        </div>
                                        
                                        <span className="text-[11px] font-semibold text-slate-400 mt-3 group-hover:text-blue-600 transition-colors">
                                            {formatDate(day.stat_date)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 italic">
                            ยังไม่มีข้อมูลสถิติในช่วงเวลานี้
                        </div>
                    )}
                    
                    <div className="flex gap-8 mt-10 justify-center">
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <div className="w-4 h-4 rounded-full bg-linear-to-t from-blue-600 to-blue-400 shadow-sm" />
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Page Views</span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <div className="w-4 h-4 rounded-full bg-linear-to-t from-emerald-600 to-emerald-400 shadow-sm" />
                            <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Unique Visitors</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Popular Pages Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Globe className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 font-kanit">หน้ายอดนิยม (Top Pages)</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                                    <th className="px-8 py-5">ลำดับ</th>
                                    <th className="px-8 py-5">หน้าเพจ</th>
                                    <th className="px-8 py-5 text-center">Page Views</th>
                                    <th className="px-8 py-5 text-center">Unique</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats?.page_breakdown?.map((pg, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-slate-800 font-bold">{getPageLabel(pg.page)}</span>
                                                <code className="text-slate-400 text-xs mt-1 font-mono tracking-tighter">{pg.page}</code>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="font-bold text-slate-700 px-3 py-1 bg-blue-50 rounded-full text-sm">
                                                {Number(pg.total_views).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="font-bold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full text-sm">
                                                {Number(pg.total_unique_users).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!stats?.page_breakdown?.length && (
                             <div className="text-center text-slate-400 py-16 bg-slate-50/50 italic border-t border-slate-50">ยังไม่มีข้อมูล</div>
                        )}
                    </div>
                </div>

                {/* Device Breakdown Progress */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Smartphone className="h-5 w-5 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 font-kanit">แยกตามอุปกรณ์</h3>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {stats?.device_breakdown?.map((dev, i) => {
                            const totalViews = stats.device_breakdown.reduce((acc, d) => acc + Number(d.total_views), 0);
                            const percent = totalViews > 0 ? ((Number(dev.total_views) / totalViews) * 100).toFixed(1) : '0';
                            return (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all ${textColors[dev.device_type] || 'text-slate-400'}`}>
                                                {getDeviceIcon(dev.device_type)}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-bold text-base leading-none mb-1">{getDeviceLabel(dev.device_type)}</p>
                                                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{Number(dev.total_views).toLocaleString()} views</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-black text-slate-900">{percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${deviceColors[dev.device_type] || 'bg-slate-400'}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {!stats?.device_breakdown?.length && (
                            <div className="text-center text-slate-400 py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 italic">ยังไม่มีข้อมูล</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Admin Cleanup Tools */}
            <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-1 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-white rounded-[2.25rem] border border-slate-200/60 p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Trash2 className="w-64 h-64 text-slate-900" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="max-w-xl">
                                <h3 className="text-2xl font-black text-slate-900 font-kanit mb-3">การจัดฐานข้อมูล</h3>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    ลบข้อมูล <span className="text-slate-900 font-bold">Visitor Log</span> ที่เก่าเกินกำหนดเพื่อประหยัดพื้นที่ฐานข้อมูล 
                                    แนะนำให้ล้างข้อมูลที่เก่ากว่า 3 เดือนออกเพื่อรักษาประสิทธิภาพสูงสุด
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                                <div className="flex items-center gap-4 px-2">
                                    <label className="text-slate-600 font-bold text-sm uppercase tracking-wide">ลบข้อมูลเก่ากว่า</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={cleanupDays}
                                        onChange={(e) => setCleanupDays(Math.max(1, Number(e.target.value)))}
                                        className="w-20 bg-white px-3 py-2 border border-slate-200 rounded-xl text-center font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                                    />
                                    <span className="text-slate-600 font-bold text-sm uppercase tracking-wide">วัน</span>
                                </div>
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={cleanupLoading}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-red-600 hover:shadow-[0_8px_30px_rgba(220,38,38,0.3)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <Trash2 className="h-5 w-5" />
                                    <span>ดำเนินการล้างข้อมูล</span>
                                </button>
                            </div>
                        </div>

                        {cleanupResult && (
                            <div className={`mt-8 px-6 py-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 ${
                                cleanupResult.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.1)]'
                                    : 'bg-red-50 text-red-700 border-red-100 shadow-[0_4px_20px_rgba(220,38,38,0.1)]'
                            }`}>
                                <div className={`p-2 rounded-full ${cleanupResult.type === 'success' ? 'bg-emerald-200' : 'bg-red-200'}`}>
                                    {cleanupResult.type === 'success' ? <TrendingUp className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                                </div>
                                <p className="font-bold">{cleanupResult.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="mx-auto w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-6 text-red-600">
                                <AlertTriangle className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 font-kanit mb-4 uppercase tracking-tighter">ยืนยันการลบข้อมูลสำาว?</h3>
                            <p className="text-slate-500 text-lg leading-relaxed mb-10">
                                ระบบจะลบ Visitor Log ที่เก่ากว่า <span className="font-black text-red-600 underline underline-offset-4">{cleanupDays} วัน</span><br/>
                                ข้อมูลที่ถูกลบไปแล้ว <span className="font-bold text-slate-900">ไม่สามารถกู้คืนได้</span> โปรดใช้ความระมัดระวัง
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-6 py-4 bg-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleCleanup}
                                disabled={cleanupLoading}
                                className="px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {cleanupLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>ยืนยันดำเนินการ</span>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
