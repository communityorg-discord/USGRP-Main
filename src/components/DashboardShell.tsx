'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/banking', label: 'Bank Accounts' },
    { href: '/transactions', label: 'Transactions' },
    { href: '/payroll', label: 'Payroll' },
    { href: '/loans', label: 'Loans & Credit' },
    { href: '/fines', label: 'Fines & Debts' },
    { href: '/housing', label: 'Housing' },
];


export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const user = {
        name: 'John Doe',
        citizenId: 'USC-001234',
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="site-header">
                <div className="header-banner">
                    <div className="header-banner-content">
                        <span>🇺🇸</span>
                        <span>An official website of the United States Government Roleplay</span>
                    </div>
                </div>

                <div className="header-main">
                    <Link href="/dashboard" className="header-brand">
                        <div className="brand-seal">🏛️</div>
                        <div className="brand-text">
                            <h1>USGRP Citizen Portal</h1>
                            <p>Your Financial Hub</p>
                        </div>
                    </Link>

                    <div className="header-account">
                        <Link href="/profile" className="notification-bell" title="Notifications" style={{ marginRight: '16px', fontSize: '20px', cursor: 'pointer', position: 'relative' }}>
                            🔔
                            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
                        </Link>
                        <div className="account-greeting">
                            <div className="greeting-name">{user.name}</div>
                            <div className="greeting-id">{user.citizenId}</div>
                        </div>
                        <Link href="/profile" className="account-avatar">
                            {user.name.charAt(0)}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="site-nav">
                <div className="nav-container">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="site-main flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-seal">🏛️</div>
                        <div>
                            <div className="footer-text">USGRP Citizen Portal</div>
                            <div className="footer-disclaimer">
                                This is a roleplay simulation. Not affiliated with the U.S. Government.
                            </div>
                        </div>
                    </div>
                    <div className="footer-links">
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Terms of Service</a>
                        <a href="#" className="footer-link">Contact Support</a>
                        <a href="/admin" className="footer-link" style={{ color: '#fdb81e' }}>Staff Portal</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
