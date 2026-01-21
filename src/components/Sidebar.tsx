'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/banking', label: 'Bank Accounts', icon: '🏦' },
    { href: '/transactions', label: 'Transactions', icon: '📜' },
    { href: '/payroll', label: 'Payroll', icon: '💵' },
    { href: '/loans', label: 'Loans & Credit', icon: '🏠' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            {/* Logo Section */}
            <div className="p-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--gold-500)] rounded-lg flex items-center justify-center text-[var(--navy-900)] font-bold text-lg">
                        US
                    </div>
                    <div>
                        <h1 className="font-bold text-[var(--foreground)]">USGRP</h1>
                        <p className="text-xs text-[var(--muted)]">Citizen Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="py-4">
                <div className="px-4 mb-2">
                    <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                        Menu
                    </span>
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''
                            }`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)]">
                <Link href="/settings" className="sidebar-nav-item">
                    <span className="text-lg">⚙️</span>
                    <span>Settings</span>
                </Link>
                <button className="sidebar-nav-item w-full text-left text-[var(--danger)]">
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
