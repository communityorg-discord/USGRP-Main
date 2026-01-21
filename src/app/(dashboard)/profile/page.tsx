'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface UserProfile {
    name: string;
    citizenId: string;
    discordId: string;
    discordUsername?: string;
    avatar?: string;
    email?: string;
    joined?: string;
    status?: string;
}

const defaultNotifications = {
    transactions: true,
    lowBalance: true,
    loanPayments: true,
    payroll: true,
    marketing: false,
};

const defaultBudgets = [
    { category: 'Housing', limit: 2000, spent: 0 },
    { category: 'Food', limit: 500, spent: 0 },
    { category: 'Transportation', limit: 300, spent: 0 },
    { category: 'Shopping', limit: 200, spent: 0 },
    { category: 'Entertainment', limit: 300, spent: 0 },
];

export default function ProfilePage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [budgets, setBudgets] = useState(defaultBudgets);
    const [showEditBudget, setShowEditBudget] = useState(false);
    const [editingBudget, setEditingBudget] = useState<typeof defaultBudgets[0] | null>(null);
    const [newLimit, setNewLimit] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        name: data.citizen?.name || session?.user?.name || 'Citizen',
                        citizenId: data.citizen?.citizenId || 'Unknown',
                        discordId: (session?.user as { id?: string })?.id || '',
                        discordUsername: session?.user?.name || '',
                        avatar: session?.user?.image || undefined,
                        status: 'Active'
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [session]);

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

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: '#64748b' }}>Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="welcome-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: profile?.avatar ? `url(${profile.avatar}) center/cover` : 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                    }}>
                        {!profile?.avatar && '👤'}
                    </div>
                    <div>
                        <h1>{profile?.name || 'Citizen'}</h1>
                        <p style={{ opacity: 0.8 }}>{profile?.discordUsername || 'Discord User'} • {profile?.citizenId || 'Unknown'}</p>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Account Status</div>
                    <div style={{ fontSize: '24px', fontWeight: 600 }}>{profile?.status || 'Active'}</div>
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
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Full Name</div>
                                    <div style={{ fontWeight: 500 }}>{profile?.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Citizen ID</div>
                                    <div style={{ fontWeight: 500, fontFamily: 'monospace' }}>{profile?.citizenId || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Discord ID</div>
                                    <div style={{ fontWeight: 500, fontFamily: 'monospace' }}>{profile?.discordId || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Discord Username</div>
                                    <div style={{ fontWeight: 500 }}>{profile?.discordUsername || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Account Status</div>
                                    <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                                        {profile?.status || 'Active'}
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

                    {/* Quick Actions */}
                    <div className="sidebar-widget">
                        <h3>Account</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn"><span>🔗</span> Link Discord</button>
                            <button className="quick-link-btn"><span>📧</span> Change Email</button>
                            <button className="quick-link-btn"><span>🔐</span> Security Settings</button>
                            <button className="quick-link-btn" style={{ color: '#ef4444' }} onClick={() => signOut({ callbackUrl: '/login' })}>
                                <span>🚪</span> Sign Out
                            </button>
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
