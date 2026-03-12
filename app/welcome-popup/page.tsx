'use client';

import { useState, useEffect, useRef } from 'react';
import { getWelcomePopups, createWelcomePopup, toggleWelcomePopup, deleteWelcomePopup, PopupItem } from '@/services/welcome-popup.service';

export default function WelcomePopupPage() {
    const [items, setItems] = useState<PopupItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Provide a fallback for IMAGE_BASE if API_BASE logic was relying on config
    const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await getWelcomePopups();
            if (data.status === 'success') {
                setItems(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            
            const data = await createWelcomePopup(formData);
            
            if (data.status === 'success') {
                setSelectedFile(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                fetchItems();
            } else {
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            const data = await toggleWelcomePopup(id);
            if (data.status === 'success') {
                fetchItems();
            }
        } catch (error) {
            console.error('Toggle error:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const data = await deleteWelcomePopup(id);
            if (data.status === 'success') {
                setDeleteConfirm(null);
                fetchItems();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const cancelUpload = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-poppins">Welcome Popup</h1>
                    <p className="text-gray-500 mt-1">จัดการรูปภาพ Welcome Popup (เลือกใช้ได้ทีละ 1 รูป)</p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    อัพโหลดรูปใหม่
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {/* Upload Preview */}
            {preview && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4">Preview รูปที่จะอัพโหลด</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-96 rounded-lg overflow-hidden border border-gray-200">
                            <img src={preview} alt="Preview" className="w-full h-auto object-contain" />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {uploading && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                {uploading ? 'กำลังอัพโหลด...' : 'ยืนยันอัพโหลด'}
                            </button>
                            <button
                                onClick={cancelUpload}
                                disabled={uploading}
                                className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Items Grid */}
            {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                        const isActive = Number(item.show_status) === 1;
                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${
                                    isActive
                                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                                        : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                {/* Status Badge */}
                                {isActive && (
                                    <div className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 text-center">
                                        ✓ กำลังใช้งาน
                                    </div>
                                )}

                                {/* Image */}
                                <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={`${IMAGE_BASE}${item.welcome_img}`}
                                        alt={`Welcome Popup ${item.id}`}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Info & Actions */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString('th-TH', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            isActive
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggle(item.id)}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                                                isActive
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            }`}
                                        >
                                            {isActive ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                    ปิดใช้งาน
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    เลือกใช้
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(item.id)}
                                            className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors border border-red-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
                    <div className="text-gray-300 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-lg">ยังไม่มีรูป Welcome Popup</p>
                    <p className="text-gray-300 text-sm mt-1">คลิกปุ่ม "อัพโหลดรูปใหม่" เพื่อเพิ่มรูป</p>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">ยืนยันการลบ</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            คุณต้องการลบรูป Welcome Popup นี้ใช่หรือไม่?<br />
                            <span className="text-gray-400 text-sm">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                ยืนยันลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
