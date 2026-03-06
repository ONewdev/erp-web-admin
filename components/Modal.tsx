'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    className?: string;
}

export default function Modal({ isOpen, onClose, children, maxWidth = '2xl', className }: ModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [animation, setAnimation] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimation(true);
                });
            });
        } else {
            setAnimation(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
                document.body.style.overflow = '';
            }, 300);
            return () => clearTimeout(timer);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isMounted) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-[95vw]',
    };

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className={cn(
                    "absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300",
                    animation ? "opacity-100" : "opacity-0"
                )} 
                onClick={onClose} 
            />

            {/* Modal Content */}
            <div 
                className={cn(
                    "relative bg-white w-full rounded-[2.5rem] shadow-2xl border border-slate-100 transition-all duration-300 transform flex flex-col overflow-hidden max-h-[90vh]",
                    maxWidthClasses[maxWidth],
                    animation ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4",
                    className
                )}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

// Subcomponents for Modal (Header, Body, Footer)
export function ModalHeader({ children, onClose, className }: { children: ReactNode, onClose?: () => void, className?: string }) {
    return (
        <div className={cn("px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0", className)}>
            <div className="flex items-center gap-4">
                {children}
            </div>
            {onClose && (
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-2xl transition-colors group shrink-0 ml-4 border border-transparent hover:border-slate-200"
                >
                    <X className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
                </button>
            )}
        </div>
    );
}

export function ModalBody({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={cn("p-8 overflow-y-auto custom-scrollbar flex-1", className)}>
            {children}
        </div>
    );
}

export function ModalFooter({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={cn("px-8 py-6 border-t border-slate-50 bg-white flex flex-col sm:flex-row gap-4 shrink-0 justify-end items-center", className)}>
            {children}
        </div>
    );
}
