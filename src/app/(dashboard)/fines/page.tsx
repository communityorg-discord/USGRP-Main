'use client';

import { useState, useEffect } from 'react';

interface Fine {
    fine_id: string;
    amount: number;
    reason: string;
    status: string;
    issued_at?: string;
    paid_at?: string;
}

interface Debt {
    debt_id: string;
    amount: number;
    remaining: number;
    type: string;
    creditor: string;
    paymentPlan?: boolean;
}

interface Warrant {
    warrant_id: string;
    type: string;
    reason: string;
    issuedAt?: string;
    court?: string;
    bailAmount?: number;
}

type TabType = 'fines' | 'debts' | 'warrants';

export default function FinesPage() {
    const [fines, setFines] = useState<Fine[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [warrants, setWarrants] = useState<Warrant[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('fines');
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedFine, setSelectedFine] = useState<Fine | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/fines');
                if (res.ok) {
                    const data = await res.json();
                    setFines(data.fines || []);
                    setDebts(data.debts || []);
                    setWarrants(data.warrants || []);
                }
            } catch (error) {
                console.error('Failed to fetch fines:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const unpaidFines = fines.filter(f => f.status === 'UNPAID' || f.status === 'unpaid');
    const paidFines = fines.filter(f => f.status === 'PAID' || f.status === 'paid');
    const totalFinesOwed = unpaidFines.reduce((s, f) => s + (f.amount || 0), 0);
    const totalDebtOwed = debts.reduce((s, d) => s + (d.remaining || d.amount || 0), 0);

    const handlePay = () => {
        setPaymentSuccess(true);
        setTimeout(() => {
            setShowPayModal(false);
            setPaymentSuccess(false);
            setSelectedFine(null);
        }, 2000);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: '#64748b' }}>Loading fines data...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="welcome-banner">
                <div><h1>Fines & Debts</h1><p>Manage outstanding fines, debts, and legal matters</p></div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Total Owed</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#fca5a5' }}>${(totalFinesOwed + totalDebtOwed).toLocaleString()}</div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="accounts-grid">
                <div className="account-card" style={{ borderLeft: unpaidFines.length > 0 ? '4px solid #ef4444' : '4px solid #22c55e' }}>
                    <div className="account-icon" style={{ background: unpaidFines.length > 0 ? '#fef2f2' : '#f0fdf4' }}>🚨</div>
                    <div className="account-info">
                        <div className="account-type">Unpaid Fines</div>
                        <div className="account-number">{unpaidFines.length} fines</div>
                    </div>
                    <div className="account-balance" style={{ color: '#ef4444' }}>${totalFinesOwed.toLocaleString()}</div>
                </div>
                <div className="account-card" style={{ borderLeft: debts.length > 0 ? '4px solid #f59e0b' : '4px solid #22c55e' }}>
                    <div className="account-icon" style={{ background: '#fef3c7' }}>💳</div>
                    <div className="account-info">
                        <div className="account-type">Active Debts</div>
                        <div className="account-number">{debts.length} accounts</div>
                    </div>
                    <div className="account-balance" style={{ color: '#f59e0b' }}>${totalDebtOwed.toLocaleString()}</div>
                </div>
                <div className="account-card" style={{ borderLeft: warrants.length > 0 ? '4px solid #7c3aed' : '4px solid #22c55e' }}>
                    <div className="account-icon" style={{ background: warrants.length > 0 ? '#f3e8ff' : '#f0fdf4' }}>⚖️</div>
                    <div className="account-info">
                        <div className="account-type">Active Warrants</div>
                        <div className="account-number">{warrants.length} active</div>
                    </div>
                    <div className="account-balance" style={{ color: warrants.length > 0 ? '#7c3aed' : '#22c55e' }}>{warrants.length > 0 ? 'ACTIVE' : 'None'}</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', marginTop: '24px' }}>
                {[
                    { id: 'fines' as TabType, label: '🚨 Fines', count: unpaidFines.length },
                    { id: 'debts' as TabType, label: '💳 Debts', count: debts.length },
                    { id: 'warrants' as TabType, label: '⚖️ Warrants', count: warrants.length }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            background: activeTab === tab.id ? '#112e51' : 'white',
                            color: activeTab === tab.id ? 'white' : '#475569',
                            border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {tab.label}
                        {tab.count > 0 && <span style={{ padding: '2px 8px', background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#fef2f2', color: activeTab === tab.id ? 'white' : '#ef4444', borderRadius: '12px', fontSize: '12px' }}>{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="content-grid">
                <div className="main-content">
                    <div className="panel">
                        <div className="panel-header">
                            <h2>{activeTab === 'fines' ? 'Traffic & Civil Fines' : activeTab === 'debts' ? 'Outstanding Debts' : 'Active Warrants'}</h2>
                        </div>
                        <div style={{ padding: '24px' }}>
                            {activeTab === 'fines' && (
                                unpaidFines.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                        <div style={{ fontWeight: 600 }}>No unpaid fines</div>
                                        <div style={{ fontSize: '14px' }}>You're all caught up!</div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {unpaidFines.map((fine) => (
                                            <div key={fine.fine_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{fine.reason || 'Fine'}</div>
                                                    <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{fine.fine_id}</div>
                                                    {fine.issued_at && <div style={{ fontSize: '12px', color: '#64748b' }}>Issued: {fine.issued_at}</div>}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '24px', color: '#ef4444' }}>${fine.amount.toLocaleString()}</div>
                                                    <button onClick={() => { setSelectedFine(fine); setShowPayModal(true); }} style={{ padding: '10px 20px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                            {activeTab === 'debts' && (
                                debts.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                        <div style={{ fontWeight: 600 }}>No outstanding debts</div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {debts.map((debt) => (
                                            <div key={debt.debt_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '16px' }}>{debt.type || 'Debt'}</div>
                                                    <div style={{ fontSize: '13px', color: '#64748b' }}>Creditor: {debt.creditor}</div>
                                                </div>
                                                <div style={{ fontWeight: 700, fontSize: '24px', color: '#f59e0b' }}>${(debt.remaining || debt.amount).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                            {activeTab === 'warrants' && (
                                warrants.length === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                        <div style={{ fontWeight: 600 }}>No active warrants</div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {warrants.map((warrant) => (
                                            <div key={warrant.warrant_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#f3e8ff', borderRadius: '12px', border: '2px solid #7c3aed' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '16px', color: '#7c3aed' }}>⚠️ {warrant.type}</div>
                                                    <div style={{ fontSize: '14px', color: '#64748b' }}>{warrant.reason}</div>
                                                    {warrant.court && <div style={{ fontSize: '12px', color: '#64748b' }}>Court: {warrant.court}</div>}
                                                </div>
                                                {warrant.bailAmount && <div style={{ fontWeight: 700, fontSize: '24px', color: '#7c3aed' }}>Bail: ${warrant.bailAmount.toLocaleString()}</div>}
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Paid Fines History */}
                    {paidFines.length > 0 && (
                        <div className="panel" style={{ marginTop: '24px' }}>
                            <div className="panel-header"><h2>Payment History</h2></div>
                            <table className="tx-table">
                                <thead><tr><th>Fine</th><th>Amount</th><th>Status</th></tr></thead>
                                <tbody>
                                    {paidFines.map((fine) => (
                                        <tr key={fine.fine_id}>
                                            <td><div style={{ fontWeight: 500 }}>{fine.reason}</div><div style={{ fontSize: '12px', color: '#64748b' }}>{fine.fine_id}</div></td>
                                            <td>${fine.amount.toLocaleString()}</td>
                                            <td><span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>✓ Paid</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="sidebar-widgets">
                    <div className="sidebar-widget">
                        <h3>Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Unpaid Fines</span><span style={{ fontWeight: 700, color: '#ef4444' }}>${totalFinesOwed.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Outstanding Debts</span><span style={{ fontWeight: 700, color: '#f59e0b' }}>${totalDebtOwed.toLocaleString()}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}><span style={{ fontWeight: 600 }}>Total Owed</span><span style={{ fontWeight: 700, color: '#ef4444', fontSize: '18px' }}>${(totalFinesOwed + totalDebtOwed).toLocaleString()}</span></div>
                        </div>
                    </div>
                    {warrants.length > 0 && (
                        <div className="sidebar-widget" style={{ background: '#fef2f2', border: '2px solid #ef4444' }}>
                            <h3 style={{ color: '#ef4444' }}>⚠️ Legal Alert</h3>
                            <p style={{ fontSize: '14px', color: '#991b1b' }}>You have {warrants.length} active warrant(s). Contact legal counsel immediately.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pay Modal */}
            {showPayModal && selectedFine && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '420px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Pay Fine</h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>{selectedFine.fine_id}</p>
                        </div>
                        {!paymentSuccess ? (
                            <>
                                <div style={{ padding: '24px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{selectedFine.reason}</div>
                                    <div style={{ fontSize: '40px', fontWeight: 700, color: '#ef4444', marginBottom: '24px' }}>${selectedFine.amount.toLocaleString()}</div>
                                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '14px', color: '#64748b' }}>
                                        Payment will be deducted from your checking account immediately.
                                    </div>
                                </div>
                                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowPayModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handlePay} style={{ padding: '10px 24px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay ${selectedFine.amount.toLocaleString()}</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <div style={{ fontSize: '20px', fontWeight: 600, color: '#112e51', marginBottom: '8px' }}>Payment Successful!</div>
                                <div style={{ color: '#64748b' }}>Fine has been paid</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
