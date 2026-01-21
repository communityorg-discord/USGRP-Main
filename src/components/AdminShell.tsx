'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/citizens', label: 'Citizens', icon: '👥' },
    { href: '/admin/transactions', label: 'Transactions', icon: '💸' },
    { href: '/admin/economy', label: 'Economy', icon: '📈' },
    { href: '/admin/loans', label: 'Loans', icon: '🏦' },
    { href: '/admin/audit', label: 'Audit Logs', icon: '📋' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="admin-wrapper">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="admin-logo-icon">🔐</div>
                    <div className="admin-logo-text">
                        <span className="admin-logo-title">Staff Portal</span>
                        <span className="admin-logo-subtitle">USGRP Administration</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link href="/dashboard" className="admin-back-btn">
                        ← Back to Citizen Portal
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <div className="admin-search">
                        <input
                            type="text"
                            placeholder="Search citizens, transactions..."
                            className="admin-search-input"
                        />
                    </div>
                    <div className="admin-user">
                        <div className="admin-status">
                            <span className="admin-status-dot"></span>
                            System Online
                        </div>
                        <div className="admin-avatar">
                            <span>AD</span>
                        </div>
                        <div className="admin-user-info">
                            <div className="admin-user-name">Admin</div>
                            <div className="admin-user-role">System Administrator</div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="admin-content">
                    {children}
                </main>
            </div>

            <style jsx global>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background: #0f172a;
          color: #e2e8f0;
        }

        .admin-sidebar {
          width: 280px;
          background: #1e293b;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        .admin-logo {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .admin-logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #fdb81e 0%, #e59b00 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .admin-logo-title {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: white;
        }

        .admin-logo-subtitle {
          display: block;
          font-size: 12px;
          color: #94a3b8;
        }

        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .admin-nav-item.active {
          background: linear-gradient(135deg, #112e51 0%, #205493 100%);
          color: white;
        }

        .admin-nav-icon {
          font-size: 18px;
        }

        .admin-sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .admin-back-btn {
          display: block;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 13px;
          text-align: center;
          transition: all 0.15s ease;
        }

        .admin-back-btn:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .admin-topbar {
          height: 70px;
          background: #1e293b;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
        }

        .admin-search-input {
          width: 400px;
          padding: 10px 16px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          font-size: 14px;
        }

        .admin-search-input::placeholder {
          color: #64748b;
        }

        .admin-search-input:focus {
          outline: none;
          border-color: #fdb81e;
        }

        .admin-user {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #22c55e;
        }

        .admin-status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #112e51 0%, #205493 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .admin-user-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }

        .admin-user-role {
          font-size: 12px;
          color: #64748b;
        }

        .admin-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Admin Cards */
        .admin-grid {
          display: grid;
          gap: 24px;
        }

        .admin-grid-4 {
          grid-template-columns: repeat(4, 1fr);
        }

        .admin-grid-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .admin-grid-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .admin-card {
          background: #1e293b;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .admin-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .admin-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-stat-value {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .admin-stat-change {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-stat-change.up {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .admin-stat-change.down {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 14px;
        }

        .admin-table tbody tr:hover {
          background: rgba(255,255,255,0.02);
        }

        .admin-badge {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .admin-badge.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .admin-badge.warning {
          background: rgba(251, 184, 30, 0.1);
          color: #fdb81e;
        }

        .admin-badge.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .admin-section-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
        }

        .admin-page-header {
          margin-bottom: 32px;
        }

        .admin-page-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .admin-page-subtitle {
          font-size: 15px;
          color: #64748b;
        }
      `}</style>
        </div>
    );
}
