'use client';

import { useState } from 'react';

const mockFines = [
    { id: 'FINE-001', type: 'Speeding', amount: 250, issuedBy: 'USGRP Police', issuedAt: '2026-01-15', dueDate: '2026-02-15', status: 'unpaid', location: 'I-95 North' },
    { id: 'FINE-002', type: 'Jaywalking', amount: 50, issuedBy: 'USGRP Police', issuedAt: '2026-01-10', dueDate: '2026-02-10', status: 'paid', paidAt: '2026-01-12', location: 'Downtown DC' },
    { id: 'FINE-003', type: 'Parking Violation', amount: 75, issuedBy: 'DC Parking', issuedAt: '2026-01-05', dueDate: '2026-02-05', status: 'paid', paidAt: '2026-01-08', location: 'K Street NW' },
];

const mockDebts = [
    { id: 'DEBT-001', creditor: 'USGRP Treasury', originalAmount: 1000, remaining: 750, reason: 'Tax Assessment - 2025', dueDate: '2026-03-01', status: 'active', paymentPlan: true, monthlyPayment: 150 },
    { id: 'DEBT-002', creditor: 'Hospital', originalAmount: 500, remaining: 500, reason: 'Emergency Room Visit', dueDate: '2026-04-15', status: 'active', paymentPlan: false },
];

const mockWarrants = [{ id: 'WRN-001', type: 'Bench Warrant', reason: 'Failure to Appear', issuedAt: '2026-01-18', court: 'DC District Court', bailAmount: 5000 }];

export default function FinesPage() {
    const [activeTab, setActiveTab] = useState<'fines' | 'debts' | 'warrants'>('fines');
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedFine, setSelectedFine] = useState<typeof mockFines[0] | null>(null);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<typeof mockDebts[0] | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);

    const unpaidFines = mockFines.filter(f => f.status === 'unpaid');
    const paidFines = mockFines.filter(f => f.status === 'paid');
    const totalFinesOwed = unpaidFines.reduce((s, f) => s + f.amount, 0);
    const totalDebtOwed = mockDebts.reduce((s, d) => s + d.remaining, 0);
    const totalOwed = totalFinesOwed + totalDebtOwed;

    const handlePayFine = () => { setPaySuccess(true); setTimeout(() => { setShowPayModal(false); setPaySuccess(false); }, 2000); };
    const handlePayDebt = () => { setPaySuccess(true); setTimeout(() => { setShowDebtModal(false); setPaySuccess(false); setPaymentAmount(''); }, 2000); };

    return (
        <div>
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div><h1>Fines, Debts & Warrants</h1><p>Manage your legal obligations and financial responsibilities</p></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Total Outstanding</div><div style={{ fontSize: '32px', fontWeight: 700 }}>${totalOwed.toLocaleString()}</div></div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="account-card" style={{ borderLeft: unpaidFines.length > 0 ? '4px solid #ef4444' : '4px solid #22c55e' }}><div className="account-icon" style={{ background: '#fef2f2' }}>🚨</div><div className="account-info"><div className="account-type">Unpaid Fines</div><div className="account-number">{unpaidFines.length} outstanding</div></div><div className="account-balance" style={{ color: '#ef4444' }}>${totalFinesOwed}</div></div>
                <div className="account-card" style={{ borderLeft: mockDebts.length > 0 ? '4px solid #f59e0b' : '4px solid #22c55e' }}><div className="account-icon" style={{ background: '#fef3c7' }}>💳</div><div className="account-info"><div className="account-type">Active Debts</div><div className="account-number">{mockDebts.length} accounts</div></div><div className="account-balance" style={{ color: '#f59e0b' }}>${totalDebtOwed}</div></div>
                <div className="account-card" style={{ borderLeft: mockWarrants.length > 0 ? '4px solid #7c3aed' : '4px solid #22c55e' }}><div className="account-icon" style={{ background: mockWarrants.length > 0 ? '#f3e8ff' : '#f0fdf4' }}>⚖️</div><div className="account-info"><div className="account-type">Active Warrants</div><div className="account-number">{mockWarrants.length} active</div></div><div className="account-balance" style={{ color: mockWarrants.length > 0 ? '#7c3aed' : '#22c55e' }}>{mockWarrants.length > 0 ? 'ACTIVE' : 'None'}</div></div>
                <div className="account-card" style={{ borderLeft: '4px solid #22c55e' }}><div className="account-icon" style={{ background: '#f0fdf4' }}>✅</div><div className="account-info"><div className="account-type">Paid This Month</div><div className="account-number">{paidFines.length} cleared</div></div><div className="account-balance" style={{ color: '#22c55e' }}>${paidFines.reduce((s, f) => s + f.amount, 0)}</div></div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
                {[{ id: 'fines', label: '🚨 Fines', count: unpaidFines.length }, { id: 'debts', label: '💳 Debts', count: mockDebts.length }, { id: 'warrants', label: '⚖️ Warrants', count: mockWarrants.length }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? 'white' : 'transparent', fontWeight: activeTab === tab.id ? 600 : 400, cursor: 'pointer', boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {tab.label} {tab.count > 0 && <span style={{ background: activeTab === tab.id ? '#ef4444' : '#94a3b8', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* Fines Tab */}
            {activeTab === 'fines' && (
                <div className="content-grid">
                    <div className="main-content">
                        <div className="panel">
                            <div className="panel-header"><h2>Unpaid Fines</h2>{unpaidFines.length > 0 && <button style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: '6px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Pay All ${totalFinesOwed}</button>}</div>
                            {unpaidFines.length === 0 ? (<div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><div style={{ fontWeight: 600 }}>No unpaid fines!</div></div>) : (
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {unpaidFines.map((fine) => (
                                        <div key={fine.id} style={{ padding: '20px', background: '#fef2f2', borderRadius: '12px', border: '2px solid #fecaca' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><div><div style={{ fontWeight: 700, fontSize: '20px', color: '#991b1b' }}>{fine.type}</div><div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{fine.id}</div></div><div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>${fine.amount}</div></div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px', padding: '16px', background: 'white', borderRadius: '8px' }}>
                                                <div><div style={{ fontSize: '11px', color: '#64748b' }}>Issued By</div><div style={{ fontSize: '13px', fontWeight: 500 }}>{fine.issuedBy}</div></div>
                                                <div><div style={{ fontSize: '11px', color: '#64748b' }}>Location</div><div style={{ fontSize: '13px', fontWeight: 500 }}>{fine.location}</div></div>
                                                <div><div style={{ fontSize: '11px', color: '#64748b' }}>Issue Date</div><div style={{ fontSize: '13px', fontWeight: 500 }}>{fine.issuedAt}</div></div>
                                                <div><div style={{ fontSize: '11px', color: '#64748b' }}>Due Date</div><div style={{ fontSize: '13px', fontWeight: 500, color: '#ef4444' }}>{fine.dueDate}</div></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px' }}><button onClick={() => { setSelectedFine(fine); setShowPayModal(true); }} style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay Now</button><button onClick={() => setShowDisputeModal(true)} style={{ padding: '12px 24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer' }}>Dispute</button></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="panel" style={{ marginTop: '24px' }}><div className="panel-header"><h2>Payment History</h2></div><table className="tx-table"><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead><tbody>{paidFines.map((f) => (<tr key={f.id}><td>{f.paidAt}</td><td><span style={{ padding: '4px 10px', background: '#f0fdf4', color: '#22c55e', borderRadius: '4px', fontSize: '12px' }}>Fine</span></td><td>{f.type} - {f.location}</td><td style={{ fontWeight: 600 }}>${f.amount}</td><td style={{ color: '#22c55e' }}>✓ Paid</td></tr>))}</tbody></table></div>
                    </div>
                    <div className="sidebar-widgets">
                        <div className="sidebar-widget"><h3>Status</h3><div style={{ padding: '20px', background: totalFinesOwed > 0 ? '#fef2f2' : '#f0fdf4', borderRadius: '12px', textAlign: 'center' }}><div style={{ fontSize: '48px', marginBottom: '8px' }}>{totalFinesOwed > 0 ? '⚠️' : '✅'}</div><div style={{ fontWeight: 700, color: totalFinesOwed > 0 ? '#991b1b' : '#166534' }}>{totalFinesOwed > 0 ? 'Fines Due' : 'All Clear!'}</div>{totalFinesOwed > 0 && <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '8px' }}>${totalFinesOwed}</div>}</div></div>
                        <div className="sidebar-widget"><h3>Quick Actions</h3><div className="quick-links"><button className="quick-link-btn"><span>💳</span> Pay All Fines</button><button className="quick-link-btn"><span>📄</span> Download Records</button><button className="quick-link-btn" onClick={() => setShowDisputeModal(true)}><span>❓</span> Dispute a Fine</button></div></div>
                    </div>
                </div>
            )}

            {/* Debts Tab */}
            {activeTab === 'debts' && (
                <div className="content-grid">
                    <div className="main-content">
                        <div className="panel">
                            <div className="panel-header"><h2>Active Debts</h2></div>
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {mockDebts.map((debt) => (
                                    <div key={debt.id} style={{ padding: '20px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}><div><div style={{ fontWeight: 700, fontSize: '18px', color: '#92400e' }}>{debt.reason}</div><div style={{ fontSize: '13px', color: '#64748b' }}>Owed to: {debt.creditor}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>${debt.remaining}</div><div style={{ fontSize: '12px', color: '#64748b' }}>of ${debt.originalAmount}</div></div></div>
                                        <div style={{ marginBottom: '16px' }}><div style={{ height: '10px', background: '#fde68a', borderRadius: '5px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${((debt.originalAmount - debt.remaining) / debt.originalAmount) * 100}%`, background: 'linear-gradient(90deg, #f59e0b 0%, #eab308 100%)', borderRadius: '5px' }} /></div><div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>${debt.originalAmount - debt.remaining} paid ({Math.round(((debt.originalAmount - debt.remaining) / debt.originalAmount) * 100)}%)</div></div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px', padding: '16px', background: 'white', borderRadius: '8px' }}><div><div style={{ fontSize: '11px', color: '#64748b' }}>Due Date</div><div style={{ fontSize: '13px', fontWeight: 600 }}>{debt.dueDate}</div></div><div><div style={{ fontSize: '11px', color: '#64748b' }}>Payment Plan</div><div style={{ fontSize: '13px', fontWeight: 600, color: debt.paymentPlan ? '#22c55e' : '#64748b' }}>{debt.paymentPlan ? `$${debt.monthlyPayment}/mo` : 'None'}</div></div><div><div style={{ fontSize: '11px', color: '#64748b' }}>Status</div><div style={{ fontSize: '13px', fontWeight: 600 }}>⚡ Active</div></div></div>
                                        <button onClick={() => { setSelectedDebt(debt); setPaymentAmount(debt.monthlyPayment?.toString() || debt.remaining.toString()); setShowDebtModal(true); }} style={{ width: '100%', padding: '12px', background: '#f59e0b', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Make Payment</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-widgets">
                        <div className="sidebar-widget"><h3>Debt Summary</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Owed</span><span style={{ fontWeight: 700, color: '#f59e0b' }}>${totalDebtOwed}</span></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Accounts</span><span style={{ fontWeight: 600 }}>{mockDebts.length}</span></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>On Payment Plan</span><span style={{ fontWeight: 600 }}>{mockDebts.filter(d => d.paymentPlan).length}</span></div></div></div>
                        <div className="sidebar-widget"><h3>Quick Actions</h3><div className="quick-links"><button className="quick-link-btn"><span>📋</span> Set Up Plan</button><button className="quick-link-btn"><span>💳</span> Pay All</button></div></div>
                    </div>
                </div>
            )}

            {/* Warrants Tab */}
            {activeTab === 'warrants' && (
                <div className="content-grid">
                    <div className="main-content">
                        <div className="panel">
                            <div className="panel-header"><h2>Active Warrants</h2></div>
                            {mockWarrants.length === 0 ? (<div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><div style={{ fontWeight: 600 }}>No active warrants</div></div>) : (
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {mockWarrants.map((warrant) => (
                                        <div key={warrant.id} style={{ padding: '20px', background: '#f3e8ff', borderRadius: '12px', border: '2px solid #c4b5fd' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}><div><div style={{ fontWeight: 700, fontSize: '20px', color: '#5b21b6' }}>{warrant.type}</div><div style={{ fontSize: '13px', color: '#64748b' }}>{warrant.id}</div></div><span style={{ padding: '6px 14px', background: '#7c3aed', color: 'white', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>⚠️ ACTIVE</span></div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px', padding: '16px', background: 'white', borderRadius: '8px' }}><div><div style={{ fontSize: '11px', color: '#64748b' }}>Reason</div><div style={{ fontSize: '13px', fontWeight: 500 }}>{warrant.reason}</div></div><div><div style={{ fontSize: '11px', color: '#64748b' }}>Court</div><div style={{ fontSize: '13px', fontWeight: 500 }}>{warrant.court}</div></div><div><div style={{ fontSize: '11px', color: '#64748b' }}>Bail Amount</div><div style={{ fontSize: '13px', fontWeight: 700, color: '#7c3aed' }}>${warrant.bailAmount.toLocaleString()}</div></div></div>
                                            <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', fontSize: '13px', color: '#991b1b' }}>⚠️ You must appear in court or post bail to resolve this warrant</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="sidebar-widgets">
                        <div className="sidebar-widget"><h3>Legal Help</h3><div className="quick-links"><button className="quick-link-btn"><span>⚖️</span> Find Attorney</button><button className="quick-link-btn"><span>🏛️</span> Court Info</button><button className="quick-link-btn"><span>💰</span> Post Bail</button></div></div>
                    </div>
                </div>
            )}

            {/* Pay Fine Modal */}
            {showPayModal && selectedFine && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}><div style={{ background: 'white', borderRadius: '16px', width: '420px' }}><div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Pay Fine</h2><p style={{ fontSize: '14px', color: '#64748b' }}>{selectedFine.type} - {selectedFine.id}</p></div>{!paySuccess ? (<><div style={{ padding: '24px', textAlign: 'center' }}><div style={{ fontSize: '48px', fontWeight: 700, color: '#ef4444' }}>${selectedFine.amount}</div><div style={{ color: '#64748b', marginTop: '8px' }}>This will be deducted from your checking account</div></div><div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}><button onClick={() => setShowPayModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button><button onClick={handlePayFine} style={{ padding: '10px 24px', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay ${selectedFine.amount}</button></div></>) : (<div style={{ padding: '48px', textAlign: 'center' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><div style={{ fontSize: '20px', fontWeight: 600 }}>Fine Paid!</div></div>)}</div></div>)}

            {/* Pay Debt Modal */}
            {showDebtModal && selectedDebt && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}><div style={{ background: 'white', borderRadius: '16px', width: '440px' }}><div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Make Payment</h2><p style={{ fontSize: '14px', color: '#64748b' }}>{selectedDebt.reason}</p></div>{!paySuccess ? (<><div style={{ padding: '24px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}><div><div style={{ fontSize: '12px', color: '#64748b' }}>Remaining</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>${selectedDebt.remaining}</div></div></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Payment Amount</label><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>$</span><input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 32px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '18px' }} /></div></div><div style={{ display: 'flex', gap: '8px' }}><button onClick={() => setPaymentAmount('50')} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>$50</button><button onClick={() => setPaymentAmount('100')} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>$100</button><button onClick={() => setPaymentAmount(selectedDebt.remaining.toString())} style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Pay Full</button></div></div><div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}><button onClick={() => setShowDebtModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button><button onClick={handlePayDebt} style={{ padding: '10px 24px', background: '#f59e0b', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay ${paymentAmount}</button></div></>) : (<div style={{ padding: '48px', textAlign: 'center' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><div style={{ fontSize: '20px', fontWeight: 600 }}>Payment Successful!</div></div>)}</div></div>)}

            {/* Dispute Modal */}
            {showDisputeModal && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}><div style={{ background: 'white', borderRadius: '16px', width: '480px' }}><div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Dispute a Fine</h2></div><div style={{ padding: '24px' }}><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Select Fine</label><select style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>{unpaidFines.map(f => <option key={f.id} value={f.id}>{f.type} - ${f.amount}</option>)}</select></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Reason</label><select style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}><option>Incorrect information</option><option>Not my violation</option><option>Already paid</option><option>Other</option></select></div><div><label style={{ display: 'block', fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: 500 }}>Details</label><textarea style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', minHeight: '100px', resize: 'none' }} placeholder="Explain your dispute..." /></div></div><div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}><button onClick={() => setShowDisputeModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button><button onClick={() => { alert('Dispute submitted!'); setShowDisputeModal(false); }} style={{ padding: '10px 24px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Submit</button></div></div></div>)}
        </div>
    );
}
