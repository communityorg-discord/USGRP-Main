'use client';

import { useState } from 'react';

// Mock loan data
const mockLoans = [
    { id: 'LOAN-001', citizen: 'John Doe', citizenId: 'USC-001234', type: 'Housing', principal: 50000, remaining: 42500, apr: 5.5, status: 'current', nextPayment: 'Jan 25, 2026', monthlyPayment: 950 },
    { id: 'LOAN-002', citizen: 'Jane Smith', citizenId: 'USC-005678', type: 'Vehicle', principal: 25000, remaining: 18750, apr: 7.5, status: 'current', nextPayment: 'Jan 28, 2026', monthlyPayment: 485 },
    { id: 'LOAN-003', citizen: 'Bob Wilson', citizenId: 'USC-009012', type: 'Payday', principal: 1000, remaining: 1150, apr: 2000, status: 'overdue', nextPayment: 'Jan 15, 2026', monthlyPayment: 1150 },
    { id: 'LOAN-004', citizen: 'Alice Brown', citizenId: 'USC-003456', type: 'Personal', principal: 5000, remaining: 3200, apr: 12, status: 'current', nextPayment: 'Feb 1, 2026', monthlyPayment: 215 },
    { id: 'LOAN-005', citizen: 'Charlie Davis', citizenId: 'USC-007890', type: 'Housing', principal: 75000, remaining: 72000, apr: 5.5, status: 'current', nextPayment: 'Jan 30, 2026', monthlyPayment: 1420 },
    { id: 'LOAN-006', citizen: 'Eve Miller', citizenId: 'USC-004521', type: 'Payday', principal: 500, remaining: 575, apr: 2000, status: 'default', nextPayment: 'Jan 10, 2026', monthlyPayment: 575 },
];

type ModalType = 'issue' | 'manage' | 'payment' | null;

interface SelectedLoan {
    id: string;
    citizen: string;
    citizenId: string;
    type: string;
    principal: number;
    remaining: number;
    apr: number;
    status: string;
    monthlyPayment: number;
}

export default function AdminLoansPage() {
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modal, setModal] = useState<ModalType>(null);
    const [selectedLoan, setSelectedLoan] = useState<SelectedLoan | null>(null);

    // Issue loan form states
    const [newLoanCitizen, setNewLoanCitizen] = useState('');
    const [newLoanType, setNewLoanType] = useState('Personal');
    const [newLoanAmount, setNewLoanAmount] = useState('');
    const [newLoanTerm, setNewLoanTerm] = useState('12');
    const [newLoanApr, setNewLoanApr] = useState('12');

    // Payment form states
    const [paymentAmount, setPaymentAmount] = useState('');

    const totalOutstanding = mockLoans.reduce((s, l) => s + l.remaining, 0);
    const overdueCount = mockLoans.filter(l => l.status === 'overdue' || l.status === 'default').length;

    const filtered = mockLoans.filter(l => {
        if (typeFilter !== 'all' && l.type !== typeFilter) return false;
        if (statusFilter !== 'all' && l.status !== statusFilter) return false;
        return true;
    });

    const closeModal = () => {
        setModal(null);
        setSelectedLoan(null);
        setNewLoanCitizen('');
        setNewLoanAmount('');
        setPaymentAmount('');
    };

    // Calculate monthly payment
    const calculateMonthly = () => {
        const p = Number(newLoanAmount);
        const r = Number(newLoanApr) / 100 / 12;
        const n = Number(newLoanTerm);
        if (p && r && n) {
            return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
        }
        return 0;
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Loan Management</h1>
                <p className="admin-page-subtitle">Issue new loans and manage existing ones</p>
            </div>

            {/* Stats */}
            <div className="admin-grid admin-grid-4" style={{ marginBottom: '24px' }}>
                <div className="admin-card">
                    <div className="admin-card-title">Active Loans</div>
                    <div className="admin-stat-value">{mockLoans.length}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Total Outstanding</div>
                    <div className="admin-stat-value">${totalOutstanding.toLocaleString()}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Overdue/Default</div>
                    <div className="admin-stat-value" style={{ color: '#ef4444' }}>{overdueCount}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Monthly Revenue</div>
                    <div className="admin-stat-value" style={{ color: '#22c55e' }}>
                        ${mockLoans.reduce((s, l) => s + l.monthlyPayment, 0).toLocaleString()}
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
                        <option value="Housing">Housing</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Personal">Personal</option>
                        <option value="Payday">Payday</option>
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
                        <option value="current">Current</option>
                        <option value="overdue">Overdue</option>
                        <option value="default">Default</option>
                    </select>
                    <button
                        onClick={() => setModal('issue')}
                        style={{
                            marginLeft: 'auto',
                            padding: '12px 24px',
                            background: '#22c55e',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        + Issue New Loan
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Borrower</th>
                            <th>Type</th>
                            <th>Principal</th>
                            <th>Remaining</th>
                            <th>APR</th>
                            <th>Monthly</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((loan) => (
                            <tr key={loan.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#94a3b8' }}>{loan.id}</td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{loan.citizen}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{loan.citizenId}</div>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        background: loan.type === 'Payday' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        color: loan.type === 'Payday' ? '#ef4444' : '#94a3b8',
                                    }}>
                                        {loan.type}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 600 }}>${loan.principal.toLocaleString()}</td>
                                <td style={{ fontWeight: 600, color: '#fdb81e' }}>${loan.remaining.toLocaleString()}</td>
                                <td style={{
                                    color: loan.apr > 100 ? '#ef4444' : loan.apr > 10 ? '#fdb81e' : '#22c55e',
                                    fontWeight: 600,
                                }}>
                                    {loan.apr}%
                                </td>
                                <td>${loan.monthlyPayment.toLocaleString()}</td>
                                <td>
                                    <span className={`admin-badge ${loan.status === 'current' ? 'success' :
                                            loan.status === 'overdue' ? 'warning' : 'danger'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => { setSelectedLoan(loan); setModal('payment'); setPaymentAmount(loan.monthlyPayment.toString()); }}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#22c55e',
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            💵 Payment
                                        </button>
                                        <button
                                            onClick={() => { setSelectedLoan(loan); setModal('manage'); }}
                                            style={{
                                                padding: '6px 12px',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                color: '#94a3b8',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Issue Loan Modal */}
            {modal === 'issue' && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        width: '560px',
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                                Issue New Loan
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>
                                Create a new loan for a citizen
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                    Citizen ID
                                </label>
                                <input
                                    type="text"
                                    value={newLoanCitizen}
                                    onChange={(e) => setNewLoanCitizen(e.target.value)}
                                    placeholder="e.g., USC-001234"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                        Loan Type
                                    </label>
                                    <select
                                        value={newLoanType}
                                        onChange={(e) => setNewLoanType(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Housing">Housing</option>
                                        <option value="Vehicle">Vehicle</option>
                                        <option value="Payday">Payday (High APR)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                        Principal Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={newLoanAmount}
                                        onChange={(e) => setNewLoanAmount(e.target.value)}
                                        placeholder="$0"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                        Term (Months)
                                    </label>
                                    <select
                                        value={newLoanTerm}
                                        onChange={(e) => setNewLoanTerm(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <option value="1">1 month (Payday)</option>
                                        <option value="6">6 months</option>
                                        <option value="12">12 months</option>
                                        <option value="24">24 months</option>
                                        <option value="36">36 months</option>
                                        <option value="60">60 months</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                        APR (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={newLoanApr}
                                        onChange={(e) => setNewLoanApr(e.target.value)}
                                        placeholder="12"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            {newLoanAmount && (
                                <div style={{
                                    padding: '20px',
                                    background: 'rgba(34,197,94,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(34,197,94,0.2)',
                                }}>
                                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Loan Summary</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>Principal</div>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>
                                                ${Number(newLoanAmount).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>Monthly Payment</div>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
                                                ${calculateMonthly().toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Interest</div>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fdb81e' }}>
                                                ${(calculateMonthly() * Number(newLoanTerm) - Number(newLoanAmount)).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>Total Repayment</div>
                                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>
                                                ${(calculateMonthly() * Number(newLoanTerm)).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                padding: '10px 20px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                            }}>
                                Cancel
                            </button>
                            <button style={{
                                padding: '10px 24px',
                                background: '#22c55e',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}>
                                Issue Loan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {modal === 'payment' && selectedLoan && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        width: '480px',
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                                Record Payment
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>
                                {selectedLoan.id} - {selectedLoan.citizen}
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Current Balance</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#fdb81e' }}>
                                        ${selectedLoan.remaining.toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Monthly Due</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>
                                        ${selectedLoan.monthlyPayment.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                    Payment Amount
                                </label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '18px',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                                <button onClick={() => setPaymentAmount(selectedLoan.monthlyPayment.toString())} style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    color: '#94a3b8',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}>
                                    Monthly ({selectedLoan.monthlyPayment})
                                </button>
                                <button onClick={() => setPaymentAmount(selectedLoan.remaining.toString())} style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    color: '#94a3b8',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}>
                                    Pay Off ({selectedLoan.remaining})
                                </button>
                            </div>

                            {paymentAmount && (
                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(34,197,94,0.1)',
                                    borderRadius: '8px',
                                }}>
                                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>New Balance</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                                        ${Math.max(0, selectedLoan.remaining - Number(paymentAmount)).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                padding: '10px 20px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                            }}>
                                Cancel
                            </button>
                            <button style={{
                                padding: '10px 24px',
                                background: '#22c55e',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}>
                                Record Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Loan Modal */}
            {modal === 'manage' && selectedLoan && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        width: '520px',
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                                Manage Loan
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>
                                {selectedLoan.id} - {selectedLoan.citizen}
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Type</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{selectedLoan.type}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Status</div>
                                    <span className={`admin-badge ${selectedLoan.status === 'current' ? 'success' : selectedLoan.status === 'overdue' ? 'warning' : 'danger'}`}>
                                        {selectedLoan.status}
                                    </span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Original Principal</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>${selectedLoan.principal.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Remaining Balance</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#fdb81e' }}>${selectedLoan.remaining.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>APR</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: selectedLoan.apr > 100 ? '#ef4444' : '#22c55e' }}>{selectedLoan.apr}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Paid So Far</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e' }}>${(selectedLoan.principal - selectedLoan.remaining).toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>Quick Actions</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button style={{
                                        padding: '12px 16px',
                                        background: 'rgba(251,184,30,0.1)',
                                        border: '1px solid rgba(251,184,30,0.2)',
                                        borderRadius: '8px',
                                        color: '#fdb81e',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}>
                                        ⏸️ Pause Loan (Defer Payments)
                                    </button>
                                    <button style={{
                                        padding: '12px 16px',
                                        background: 'rgba(34,197,94,0.1)',
                                        border: '1px solid rgba(34,197,94,0.2)',
                                        borderRadius: '8px',
                                        color: '#22c55e',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}>
                                        ✓ Mark as Paid Off
                                    </button>
                                    <button style={{
                                        padding: '12px 16px',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        borderRadius: '8px',
                                        color: '#ef4444',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}>
                                        🚫 Forgive Remaining Balance
                                    </button>
                                    <button style={{
                                        padding: '12px 16px',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        borderRadius: '8px',
                                        color: '#ef4444',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}>
                                        ⚠️ Mark as Default
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={closeModal} style={{
                                padding: '10px 20px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                            }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
