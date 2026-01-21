'use client';

import { useState } from 'react';

// Mock transaction data
const mockTransactions = [
    { id: 'TXN-2026-00342', from: 'FBI Payroll', fromId: 'SYS-PAY', to: 'John Doe', toId: 'USC-001234', type: 'Salary', amount: 8500, time: '14:32:15', date: 'Jan 20, 2026', status: 'completed' },
    { id: 'TXN-2026-00341', from: 'Jane Smith', fromId: 'USC-005678', to: 'Auto Dealer', toId: 'BIZ-AUTO', type: 'Purchase', amount: 1250, time: '14:28:42', date: 'Jan 20, 2026', status: 'completed' },
    { id: 'TXN-2026-00340', from: 'Bob Wilson', fromId: 'USC-009012', to: 'Treasury', toId: 'SYS-TRES', type: 'Tax Payment', amount: 5000, time: '14:25:08', date: 'Jan 20, 2026', status: 'pending' },
    { id: 'TXN-2026-00339', from: 'Alice Brown', fromId: 'USC-003456', to: 'USGRP Bank', toId: 'SYS-BANK', type: 'Loan Payment', amount: 950, time: '14:20:55', date: 'Jan 20, 2026', status: 'completed' },
    { id: 'TXN-2026-00338', from: 'Casino', fromId: 'BIZ-CASI', to: 'Charlie Davis', toId: 'USC-007890', type: 'Winnings', amount: 2340, time: '14:15:30', date: 'Jan 20, 2026', status: 'flagged' },
    { id: 'TXN-2026-00337', from: 'Treasury', fromId: 'SYS-TRES', to: 'All Citizens', toId: 'MULTI', type: 'Stimulus', amount: 50000, time: '12:00:00', date: 'Jan 20, 2026', status: 'completed' },
];

export default function AdminTransactionsPage() {
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const totalVolume = mockTransactions.reduce((s, t) => s + t.amount, 0);

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Transaction Monitor</h1>
                <p className="admin-page-subtitle">Real-time transaction surveillance and audit</p>
            </div>

            {/* Stats */}
            <div className="admin-grid admin-grid-4" style={{ marginBottom: '24px' }}>
                <div className="admin-card">
                    <div className="admin-card-title">Today's Transactions</div>
                    <div className="admin-stat-value">{mockTransactions.length}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Total Volume</div>
                    <div className="admin-stat-value">${totalVolume.toLocaleString()}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Pending</div>
                    <div className="admin-stat-value" style={{ color: '#fdb81e' }}>
                        {mockTransactions.filter(t => t.status === 'pending').length}
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Flagged</div>
                    <div className="admin-stat-value" style={{ color: '#ef4444' }}>
                        {mockTransactions.filter(t => t.status === 'flagged').length}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                        }}
                    >
                        <option value="all">All Types</option>
                        <option value="Salary">Salary</option>
                        <option value="Purchase">Purchase</option>
                        <option value="Tax Payment">Tax Payment</option>
                        <option value="Loan Payment">Loan Payment</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            background: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="flagged">Flagged</option>
                    </select>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                        <button style={{
                            padding: '10px 20px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}>
                            📥 Export
                        </button>
                        <button style={{
                            padding: '10px 20px',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}>
                            🚨 Freeze Suspicious
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTransactions.map((tx) => (
                            <tr key={tx.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#94a3b8' }}>{tx.id}</td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{tx.from}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{tx.fromId}</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{tx.to}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{tx.toId}</div>
                                </td>
                                <td>{tx.type}</td>
                                <td style={{ fontWeight: 600, color: '#22c55e' }}>${tx.amount.toLocaleString()}</td>
                                <td style={{ fontSize: '13px', color: '#64748b' }}>
                                    <div>{tx.time}</div>
                                    <div style={{ fontSize: '11px' }}>{tx.date}</div>
                                </td>
                                <td>
                                    <span className={`admin-badge ${tx.status === 'completed' ? 'success' :
                                            tx.status === 'pending' ? 'warning' : 'danger'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td>
                                    <button style={{
                                        padding: '6px 12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '4px',
                                        color: '#94a3b8',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                    }}>
                                        Inspect
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
