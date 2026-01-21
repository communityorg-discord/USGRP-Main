'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Types for API data
interface Citizen {
    citizenId: string;
    name: string;
    bankAccounts: { checking: { balance: number }; savings: { balance: number } };
}
interface Account { type: string; number: string; balance: number; icon: string; }
interface Transaction { transaction_id: string; type: string; amount: number; description: string; created_at: string; }
interface DashboardData {
    citizen: Citizen | null;
    accounts: Account[];
    transactions: Transaction[];
    credit: { score: number; band: string };
    loans: { loan_id: string; remaining_balance: number; weekly_payment: number }[];
    fines: { fine_id: string; amount: number }[];
    warrants: unknown[];
    housing: { tier?: string; weeklyRent?: number } | null;
    apiConnected: boolean;
}

// Mock data fallback
const mockData: DashboardData = {
    citizen: { citizenId: 'USC-001234', name: 'John Doe', bankAccounts: { checking: { balance: 45230 }, savings: { balance: 12500 } } },
    accounts: [
        { type: 'Checking', number: '****4523', balance: 45230, icon: '🏦' },
        { type: 'Savings', number: '****8901', balance: 12500, icon: '💰' },
        { type: 'Credit Card', number: '****3456', balance: -1250, icon: '💳' },
    ],
    transactions: [
        { transaction_id: '1', description: 'Weekly Salary - FBI', amount: 4290, created_at: 'Jan 19', type: 'credit' },
        { transaction_id: '2', description: 'Transfer to Jane Smith', amount: -500, created_at: 'Jan 18', type: 'debit' },
        { transaction_id: '3', description: 'Convenience Store', amount: -45, created_at: 'Jan 17', type: 'debit' },
    ],
    credit: { score: 720, band: 'Good' },
    loans: [{ loan_id: 'LOAN-1', remaining_balance: 42500, weekly_payment: 1435 }],
    fines: [{ fine_id: 'FINE-1', amount: 250 }],
    warrants: [{ id: 'W-1' }],
    housing: { tier: 'Studio Apartment', weeklyRent: 550 },
    apiConnected: false
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData>(mockData);
    const [loading, setLoading] = useState(true);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferRecipient, setTransferRecipient] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferSuccess, setTransferSuccess] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const apiData = await res.json();
                    if (apiData.apiConnected) {
                        setData(apiData);
                    }
                }
            } catch (err) {
                console.log('[Dashboard] Using mock data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const totalBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLoansOwed = data.loans.reduce((sum, l) => sum + (l.remaining_balance || 0), 0);
    const totalFinesUnpaid = data.fines.reduce((sum, f) => sum + (f.amount || 0), 0);

    const handleTransfer = () => {
        setTransferSuccess(true);
        setTimeout(() => { setShowTransferModal(false); setTransferSuccess(false); setTransferRecipient(''); setTransferAmount(''); }, 2000);
    };

    return (
        <div>
            {/* Connection Status Banner */}
            {!loading && !data.apiConnected && (
                <div style={{ padding: '10px 16px', background: '#fef3c7', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚠️ Using offline demo data. Start the Economy Bot API to see real data.
                </div>
            )}

            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div><h1>Welcome back, {data.citizen?.name || 'Citizen'}</h1><p>Citizen ID: {data.citizen?.citizenId || 'Unknown'}</p></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Net Worth</div><div style={{ fontSize: '32px', fontWeight: 700 }}>${totalBalance.toLocaleString()}</div></div>
            </div>

            {/* Alerts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {/* Pending Pay */}
                <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>💵</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>Payday in 11 days</div><div style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>$4,290</div></div>
                </div>
                {/* Fines Alert */}
                {totalFinesUnpaid > 0 && (
                    <Link href="/fines" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                        <div style={{ fontSize: '32px' }}>🚨</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600 }}>{data.fines.length} Unpaid Fine{data.fines.length > 1 ? 's' : ''}</div><div style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>${totalFinesUnpaid}</div></div>
                        {data.warrants.length > 0 && <span style={{ padding: '4px 10px', background: '#7c3aed', color: 'white', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>WARRANT</span>}
                    </Link>
                )}
                {/* Rent Due */}
                <Link href="/housing" style={{ background: 'linear-gradient(135deg, rgba(253,184,30,0.15) 0%, rgba(253,184,30,0.05) 100%)', border: '1px solid rgba(253,184,30,0.3)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                    <div style={{ fontSize: '32px' }}>🏠</div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>Rent due in 5 days</div><div style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>${data.housing?.weeklyRent || 550}</div></div>
                </Link>
            </div>

            {/* Main Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {data.accounts.map((acc, i) => (
                    <div key={i} className="account-card"><div className="account-icon">{acc.icon}</div><div className="account-info"><div className="account-type">{acc.type}</div><div className="account-number">{acc.number}</div></div><div className="account-balance" style={{ color: acc.balance < 0 ? '#ef4444' : undefined }}>${Math.abs(acc.balance).toLocaleString()}</div></div>
                ))}
                <div className="account-card" style={{ borderLeft: '4px solid #22c55e' }}><div className="account-icon">📊</div><div className="account-info"><div className="account-type">Credit Score</div><div className="account-number">{data.credit.band}</div></div><div className="account-balance">{data.credit.score}</div></div>
            </div>

            {/* 3 Column Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '24px' }}>
                {/* Left - Transactions */}
                <div className="panel">
                    <div className="panel-header"><h2>Recent Transactions</h2><Link href="/transactions" className="btn-link">View All →</Link></div>
                    <table className="tx-table"><tbody>
                        {data.transactions.slice(0, 5).map((tx) => (
                            <tr key={tx.transaction_id}><td><div className="tx-icon">{tx.amount > 0 ? '↓' : '↑'}</div></td><td><div className="tx-desc">{tx.description}</div></td><td className="tx-date">{new Date(tx.created_at).toLocaleDateString()}</td><td className={`tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`}>{tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}</td></tr>
                        ))}
                    </tbody></table>
                </div>

                {/* Middle - Quick Overview Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Loans */}
                    <Link href="/loans" style={{ textDecoration: 'none' }}>
                        <div className="panel" style={{ cursor: 'pointer' }}>
                            <div className="panel-header"><h2>🏦 Loans & Credit</h2></div>
                            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                <div><div style={{ fontSize: '12px', color: '#64748b' }}>Active Loans</div><div style={{ fontSize: '24px', fontWeight: 700 }}>{data.loans.length}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b' }}>Total Owed</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>${totalLoansOwed.toLocaleString()}</div></div>
                            </div>
                        </div>
                    </Link>

                    {/* Housing */}
                    <Link href="/housing" style={{ textDecoration: 'none' }}>
                        <div className="panel" style={{ cursor: 'pointer' }}>
                            <div className="panel-header"><h2>🏠 Housing</h2></div>
                            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                <div><div style={{ fontSize: '12px', color: '#64748b' }}>Property</div><div style={{ fontSize: '16px', fontWeight: 600 }}>{data.housing?.tier || 'N/A'}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b' }}>Weekly Rent</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${data.housing?.weeklyRent || 0}</div></div>
                            </div>
                        </div>
                    </Link>

                    {/* Health */}
                    <div className="panel">
                        <div className="panel-header"><h2>❤️ Survival Status</h2></div>
                        <div style={{ padding: '20px' }}>
                            {[{ label: 'Hunger', value: 75, color: '#22c55e' }, { label: 'Thirst', value: 80, color: '#3b82f6' }, { label: 'Energy', value: 90, color: '#f59e0b' }].map(stat => (
                                <div key={stat.label} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '13px' }}>{stat.label}</span><span style={{ fontSize: '13px', fontWeight: 600 }}>{stat.value}%</span></div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${stat.value}%`, background: stat.color, borderRadius: '4px' }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Credit Score */}
                    <div className="sidebar-widget">
                        <h3>Credit Score</h3>
                        <div className="credit-gauge">
                            <svg viewBox="0 0 120 80" style={{ width: '100%', maxWidth: '160px' }}>
                                <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" strokeLinecap="round" />
                                <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="url(#scoreGrad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(data.credit.score / 850) * 157} 157`} />
                                <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" /><stop offset="50%" stopColor="#fdb81e" /><stop offset="100%" stopColor="#22c55e" /></linearGradient></defs>
                                <text x="60" y="55" textAnchor="middle" fontSize="28" fontWeight="700" fill="white">{data.credit.score}</text>
                                <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#94a3b8">{data.credit.band}</text>
                            </svg>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="sidebar-widget">
                        <h3>Quick Actions</h3>
                        <div className="quick-links">
                            <button onClick={() => setShowTransferModal(true)} className="quick-link-btn"><span>💸</span> Send Money</button>
                            <Link href="/banking" className="quick-link-btn"><span>💳</span> View Cards</Link>
                            <Link href="/payroll" className="quick-link-btn"><span>📄</span> Payslips</Link>
                            <Link href="/fines" className="quick-link-btn"><span>⚖️</span> Pay Fines</Link>
                            <Link href="/housing" className="quick-link-btn"><span>🏠</span> Housing</Link>
                            <Link href="/profile" className="quick-link-btn"><span>⚙️</span> Settings</Link>
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="sidebar-widget">
                        <h3>Upcoming</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#f0fdf4', borderRadius: '8px' }}><span style={{ fontSize: '13px' }}>💵 Payday</span><span style={{ fontSize: '13px', fontWeight: 600 }}>11d</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#fef3c7', borderRadius: '8px' }}><span style={{ fontSize: '13px' }}>🏠 Rent</span><span style={{ fontSize: '13px', fontWeight: 600 }}>5d</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#fef2f2', borderRadius: '8px' }}><span style={{ fontSize: '13px' }}>🏦 Loan Payment</span><span style={{ fontSize: '13px', fontWeight: 600 }}>7d</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transfer Modal */}
            {showTransferModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '480px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Send Money</h2></div>
                        {!transferSuccess ? (<><div style={{ padding: '24px' }}><div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Recipient</label><input type="text" value={transferRecipient} onChange={(e) => setTransferRecipient(e.target.value)} placeholder="USC-005678 or @username" style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} /></div><div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Amount</label><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>$</span><input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '12px 16px 12px 32px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '18px' }} /></div></div></div><div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}><button onClick={() => setShowTransferModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button><button onClick={handleTransfer} disabled={!transferRecipient || !transferAmount} style={{ padding: '10px 24px', background: (!transferRecipient || !transferAmount) ? '#94a3b8' : '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Send</button></div></>) : (<div style={{ padding: '48px', textAlign: 'center' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><div style={{ fontSize: '20px', fontWeight: 600 }}>Sent!</div></div>)}
                    </div>
                </div>
            )}
        </div>
    );
}
