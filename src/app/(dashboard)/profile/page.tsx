'use client';

import { useState } from 'react';

// Mock user data - from citizens table + government_members.json
const mockUser = {
    name: 'John Doe',
    citizenId: 'USC-001234',
    discordId: '723199054514749450',
    discordUsername: 'johndoe#0001',
    avatar: null,
    email: 'john.doe@usgrp.xyz',
    joined: 'Jan 15, 2025',
    status: 'Active',
};

const mockNotificationSettings = {
    transactions: true,
    lowBalance: true,
    loanPayments: true,
    payroll: true,
    marketing: false,
};

const mockBudgets = [
    { category: 'Housing', limit: 2000, spent: 1500 },
    { category: 'Food', limit: 500, spent: 210 },
    { category: 'Transportation', limit: 300, spent: 55 },
    { category: 'Shopping', limit: 200, spent: 45 },
    { category: 'Entertainment', limit: 300, spent: 250 },
];

const mockAchievements = [
    { id: 1, name: 'First Transaction', icon: '💰', earned: 'Jan 15, 2025' },
    { id: 2, name: 'First Loan Paid', icon: '✅', earned: 'Nov 2025' },
    { id: 3, name: 'Good Credit', icon: '📊', earned: 'Dec 2025' },
    { id: 4, name: '50 Transactions', icon: '🏆', earned: null },
    { id: 5, name: 'Zero Debt', icon: '🌟', earned: null },
];

export default function ProfilePage() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const [notifications, setNotifications] = useState(mockNotificationSettings);
    const [budgets, setBudgets] = useState(mockBudgets);
    const [showEditBudget, setShowEditBudget] = useState(false);
    const [editingBudget, setEditingBudget] = useState<typeof mockBudgets[0] | null>(null);
    const [newLimit, setNewLimit] = useState('');

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    const saveBudget = () => {
        if (editingBudget) {
            setBudgets(budgets.map(b => b.category === editingBudget.category ? { ...b, limit: Number(newLimit) } : b));
        }
        setShowEditBudget(false);
        setEditingBudget(null);
    };

    // Activity data for heatmap (last 12 weeks)
    const activityData = Array.from({ length: 84 }, (_, i) => Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0);

    return (
        <div>
            {/* Page Header */}
            <div className="welcome-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                    }}>
                        👤
                    </div>
                    <div>
                        <h1>{mockUser.name}</h1>
                        <p style={{ opacity: 0.8 }}>{mockUser.discordUsername} • {mockUser.citizenId}</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Member Since</div>
                    <div style={{ fontSize: '24px', fontWeight: 600 }}>{mockUser.joined}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Left Column */}
                <div className="main-content">
                    {/* Profile Info */}
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Profile Information</h2>
                            <button className="btn-link">Edit</button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Full Name</div>
                                    <div style={{ fontWeight: 500 }}>{mockUser.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Citizen ID</div>
                                    <div style={{ fontWeight: 500, fontFamily: 'monospace' }}>{mockUser.citizenId}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Discord</div>
                                    <div style={{ fontWeight: 500 }}>{mockUser.discordUsername}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Email</div>
                                    <div style={{ fontWeight: 500 }}>{mockUser.email}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Account Status</div>
                                    <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                                        {mockUser.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Tracker */}
                    <div className="panel" style={{ marginTop: '24px' }}>
                        <div className="panel-header">
                            <h2>Budget Tracker</h2>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>Monthly Limits</span>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {budgets.map((budget) => {
                                    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                                    const isOver = budget.spent > budget.limit;
                                    return (
                                        <div key={budget.category}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 500 }}>{budget.category}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ color: isOver ? '#ef4444' : '#64748b' }}>
                                                        ${budget.spent} / ${budget.limit}
                                                    </span>
                                                    <button
                                                        onClick={() => { setEditingBudget(budget); setNewLimit(budget.limit.toString()); setShowEditBudget(true); }}
                                                        style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${percentage}%`,
                                                    background: isOver ? '#ef4444' : percentage > 80 ? '#fdb81e' : '#22c55e',
                                                    borderRadius: '5px',
                                                    transition: 'width 0.3s',
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Activity Graph */}
                    <div className="panel" style={{ marginTop: '24px' }}>
                        <div className="panel-header">
                            <h2>Transaction Activity</h2>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>Last 12 weeks</span>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
                                {Array.from({ length: 12 }).map((_, weekIdx) => (
                                    <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                                            const activity = activityData[weekIdx * 7 + dayIdx];
                                            const colors = ['#f1f5f9', '#dcfce7', '#86efac', '#22c55e', '#16a34a'];
                                            return (
                                                <div
                                                    key={dayIdx}
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '1',
                                                        background: colors[activity] || colors[0],
                                                        borderRadius: '3px',
                                                    }}
                                                    title={`${activity} transactions`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>Less</span>
                                {['#f1f5f9', '#dcfce7', '#86efac', '#22c55e', '#16a34a'].map((color, idx) => (
                                    <div key={idx} style={{ width: '12px', height: '12px', background: color, borderRadius: '2px' }} />
                                ))}
                                <span style={{ fontSize: '12px', color: '#64748b' }}>More</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="sidebar-widgets">
                    {/* Theme Settings */}
                    <div className="sidebar-widget">
                        <h3>Appearance</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {(['light', 'dark', 'system'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    style={{
                                        padding: '12px 16px',
                                        background: theme === t ? 'var(--primary)' : '#f8fafc',
                                        color: theme === t ? 'white' : '#475569',
                                        border: theme === t ? 'none' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontWeight: theme === t ? 600 : 400,
                                    }}
                                >
                                    <span>{t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}</span>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="sidebar-widget">
                        <h3>Notifications</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(notifications).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <button
                                        onClick={() => toggleNotification(key as keyof typeof notifications)}
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            background: value ? '#22c55e' : '#e2e8f0',
                                            border: 'none',
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '10px',
                                            background: 'white',
                                            position: 'absolute',
                                            top: '2px',
                                            left: value ? '22px' : '2px',
                                            transition: 'left 0.2s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                        }} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="sidebar-widget">
                        <h3>Achievements</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                            {mockAchievements.map((ach) => (
                                <div
                                    key={ach.id}
                                    title={ach.name + (ach.earned ? ` - Earned ${ach.earned}` : ' - Not earned')}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1',
                                        background: ach.earned ? '#f0fdf4' : '#f1f5f9',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        opacity: ach.earned ? 1 : 0.4,
                                        border: ach.earned ? '2px solid #22c55e' : '1px dashed #cbd5e1',
                                    }}
                                >
                                    {ach.icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-widget">
                        <h3>Account</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn"><span>🔗</span> Link Discord</button>
                            <button className="quick-link-btn"><span>📧</span> Change Email</button>
                            <button className="quick-link-btn"><span>🔐</span> Security Settings</button>
                            <button className="quick-link-btn" style={{ color: '#ef4444' }}><span>🚪</span> Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Budget Modal */}
            {showEditBudget && editingBudget && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '400px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Edit Budget</h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>{editingBudget.category}</p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Monthly Limit</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>$</span>
                                <input
                                    type="number"
                                    value={newLimit}
                                    onChange={(e) => setNewLimit(e.target.value)}
                                    style={{ width: '100%', padding: '12px 16px 12px 32px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '16px' }}
                                />
                            </div>
                            <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Current Spending</span>
                                    <span style={{ fontWeight: 600 }}>${editingBudget.spent}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowEditBudget(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={saveBudget} style={{ padding: '10px 24px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
