"use client";

import React from "react";

const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
  ),
  Database: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></svg>
  ),
};

export default function AdminDashboard() {
  const stats = [
    { label: "Total Revenue", value: "฿1,280,000", change: "+12.5%", icon: <Icons.TrendingUp />, color: "bg-blue-500" },
    { label: "Active Users", value: "1,240", change: "+3.2%", icon: <Icons.Users />, color: "bg-emerald-500" },
    { label: "New Projects", value: "48", change: "+8.1%", icon: <Icons.Briefcase />, color: "bg-amber-500" },
    { label: "Server Status", value: "99.9%", change: "Stable", icon: <Icons.Database />, color: "bg-indigo-500" },
  ];

  const recentTransactions = [
    { id: "TX-9012", user: "Somchai K.", status: "Completed", amount: "฿12,500", date: "Feb 09, 2026" },
    { id: "TX-9011", user: "Wichai S.", status: "Pending", amount: "฿8,200", date: "Feb 08, 2026" },
    { id: "TX-9010", user: "Ananya P.", status: "Completed", amount: "฿45,000", date: "Feb 08, 2026" },
    { id: "TX-9009", user: "Kasem R.", status: "Processing", amount: "฿2,400", date: "Feb 07, 2026" },
    { id: "TX-9008", user: "Malee T.", status: "Completed", amount: "฿15,700", date: "Feb 07, 2026" },
  ];

  return (
    <>
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold mb-1">Hello, Admin 👋</h2>
        <p className="text-slate-400 font-medium font-kanit">ยินดีต้อนรับกลับสู่ระบบจัดการ BCI Company</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-extrabold group-hover:text-brand transition-colors">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-lg">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg">รายการล่าสุด</h3>
            <button className="text-brand text-sm font-bold hover:underline px-2 py-1 hover:bg-blue-50 rounded-lg transition-all active:scale-95">ดูทั้งหมด</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">ลูกค้า</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4">จำนวนเงิน</th>
                  <th className="px-6 py-4">วันที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                    <td className="px-6 py-5 font-mono text-xs text-slate-500">{tx.id}</td>
                    <td className="px-6 py-5 font-bold group-hover:text-brand transition-colors">{tx.user}</td>
                    <td className="px-6 py-5 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all group-hover:shadow-md ${tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                        tx.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-extrabold text-sm">{tx.amount}</td>
                    <td className="px-6 py-5 text-xs text-slate-400 font-medium">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-brand rounded-3xl p-6 text-white shadow-2xl shadow-brand/30 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-brand/50 active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
              <Icons.TrendingUp />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">เป้าหมายยอดขาย</h3>
            <p className="text-white/70 text-sm mb-6 relative z-10">ขณะนี้ใกล้ถึงเป้าหมายรายเดือนแล้ว!</p>
            <div className="h-2 w-full bg-white/20 rounded-full mb-2 overflow-hidden relative z-10">
              <div className="h-full bg-white w-3/4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse transition-all duration-1000"></div>
            </div>
            <div className="flex justify-between text-xs font-bold relative z-10">
              <span>สำเร็จ 75%</span>
              <span>เป้าหมาย ฿2.5M</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">สถานะระบบ</h3>
            <div className="space-y-4">
              {[
                { name: 'Core Engine', status: 'Optimal', color: 'bg-emerald-500' },
                { name: 'Database API', status: 'Stable', color: 'bg-emerald-500' },
                { name: 'Frontend App', status: 'Updated', color: 'bg-emerald-500' },
                { name: 'Cloud Storage', status: 'Near Capacity', color: 'bg-amber-500' }
              ].map((sys) => (
                <div key={sys.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse`}></div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-brand transition-colors">{sys.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">{sys.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
