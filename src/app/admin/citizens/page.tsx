'use client';

import { useState } from 'react';

// Mock citizen data
const mockCitizens = [
    { id: 'USC-000001', name: 'Treasury Secretary', balance: 2450000, creditScore: 850, status: 'active', joined: 'Jan 1, 2024', lastActive: '2 min ago', overdraftLimit: 50000, creditLimit: 100000 },
    { id: 'USC-000002', name: 'Attorney General', balance: 1890000, creditScore: 820, status: 'active', joined: 'Jan 1, 2024', lastActive: '15 min ago', overdraftLimit: 40000, creditLimit: 75000 },
    { id: 'USC-000003', name: 'FBI Director', balance: 985000, creditScore: 790, status: 'active', joined: 'Jan 5, 2024', lastActive: '1 hour ago', overdraftLimit: 25000, creditLimit: 50000 },
    { id: 'USC-001234', name: 'John Doe', balance: 45230, creditScore: 720, status: 'active', joined: 'Jan 15, 2025', lastActive: '5 min ago', overdraftLimit: 500, creditLimit: 5000 },
    { id: 'USC-005678', name: 'Jane Smith', balance: 28500, creditScore: 680, status: 'active', joined: 'Feb 20, 2025', lastActive: '30 min ago', overdraftLimit: 250, creditLimit: 2500 },
    { id: 'USC-009012', name: 'Bob Wilson', balance: 12750, creditScore: 650, status: 'suspended', joined: 'Mar 10, 2025', lastActive: '2 days ago', overdraftLimit: 0, creditLimit: 0 },
    { id: 'USC-003456', name: 'Alice Brown', balance: 67800, creditScore: 740, status: 'active', joined: 'Apr 5, 2025', lastActive: '1 hour ago', overdraftLimit: 1000, creditLimit: 10000 },
    { id: 'USC-007890', name: 'Charlie Davis', balance: 8900, creditScore: 580, status: 'active', joined: 'May 15, 2025', lastActive: '3 hours ago', overdraftLimit: 100, creditLimit: 500 },
];

type ModalType = 'money' | 'limits' | 'view' | null;

interface SelectedCitizen {
    id: string;
    name: string;
    balance: number;
    overdraftLimit: number;
    creditLimit: number;
    creditScore: number;
}

export default function AdminCitizensPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modal, setModal] = useState<ModalType>(null);
    const [selectedCitizen, setSelectedCitizen] = useState<SelectedCitizen | null>(null);

    // Form states
    const [moneyAction, setMoneyAction] = useState<'add' | 'remove'>('add');
    const [moneyAmount, setMoneyAmount] = useState('');
    const [moneyReason, setMoneyReason] = useState('');
    const [newOverdraft, setNewOverdraft] = useState('');
    const [newCreditLimit, setNewCreditLimit] = useState('');

    const filtered = mockCitizens.filter(c => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const openModal = (type: ModalType, citizen: typeof mockCitizens[0]) => {
        setSelectedCitizen(citizen);
        setModal(type);
        if (type === 'limits') {
            setNewOverdraft(citizen.overdraftLimit.toString());
            setNewCreditLimit(citizen.creditLimit.toString());
        }
    };

    const closeModal = () => {
        setModal(null);
        setSelectedCitizen(null);
        setMoneyAmount('');
        setMoneyReason('');
        setNewOverdraft('');
        setNewCreditLimit('');
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Citizen Management</h1>
                <p className="admin-page-subtitle">View and manage all registered citizens</p>
            </div>

            {/* Stats */}
            <div className="admin-grid admin-grid-4" style={{ marginBottom: '24px' }}>
                <div className="admin-card">
                    <div className="admin-card-title">Total Citizens</div>
                    <div className="admin-stat-value">{mockCitizens.length}</div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Active</div>
                    <div className="admin-stat-value" style={{ color: '#22c55e' }}>
                        {mockCitizens.filter(c => c.status === 'active').length}
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Total Overdraft Limit</div>
                    <div className="admin-stat-value" style={{ color: '#fdb81e' }}>
                        ${mockCitizens.reduce((s, c) => s + c.overdraftLimit, 0).toLocaleString()}
                    </div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">Total Credit Limit</div>
                    <div className="admin-stat-value" style={{ color: '#22c55e' }}>
                        ${mockCitizens.reduce((s, c) => s + c.creditLimit, 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="admin-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-search-input"
                        style={{ width: '300px' }}
                    />
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
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Citizen</th>
                            <th>Balance</th>
                            <th>Credit Score</th>
                            <th>Overdraft</th>
                            <th>Credit Limit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((citizen) => (
                            <tr key={citizen.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{citizen.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{citizen.id}</div>
                                </td>
                                <td style={{ fontWeight: 600 }}>${citizen.balance.toLocaleString()}</td>
                                <td>
                                    <span style={{
                                        color: citizen.creditScore >= 700 ? '#22c55e' : citizen.creditScore >= 600 ? '#fdb81e' : '#ef4444'
                                    }}>
                                        {citizen.creditScore}
                                    </span>
                                </td>
                                <td style={{ color: '#fdb81e' }}>${citizen.overdraftLimit.toLocaleString()}</td>
                                <td style={{ color: '#22c55e' }}>${citizen.creditLimit.toLocaleString()}</td>
                                <td>
                                    <span className={`admin-badge ${citizen.status === 'active' ? 'success' : 'danger'}`}>
                                        {citizen.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => openModal('money', citizen)}
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
                                            💰 Money
                                        </button>
                                        <button
                                            onClick={() => openModal('limits', citizen)}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#fdb81e',
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: '#0f172a',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            ⚙️ Limits
                                        </button>
                                        <button
                                            onClick={() => openModal('view', citizen)}
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
                                            View
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Money Modal */}
            {modal === 'money' && selectedCitizen && (
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
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                                Manage Balance
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>
                                {selectedCitizen.name} ({selectedCitizen.id})
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Current Balance</div>
                                <div style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>
                                    ${selectedCitizen.balance.toLocaleString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <button
                                    onClick={() => setMoneyAction('add')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: moneyAction === 'add' ? '#22c55e' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid',
                                        borderColor: moneyAction === 'add' ? '#22c55e' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ➕ Add Money
                                </button>
                                <button
                                    onClick={() => setMoneyAction('remove')}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: moneyAction === 'remove' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid',
                                        borderColor: moneyAction === 'remove' ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ➖ Remove Money
                                </button>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={moneyAmount}
                                    onChange={(e) => setMoneyAmount(e.target.value)}
                                    placeholder="Enter amount..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '16px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                    Reason / Notes
                                </label>
                                <input
                                    type="text"
                                    value={moneyReason}
                                    onChange={(e) => setMoneyReason(e.target.value)}
                                    placeholder="e.g., Admin adjustment, Refund..."
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

                            {moneyAmount && (
                                <div style={{
                                    padding: '16px',
                                    background: moneyAction === 'add' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                    borderRadius: '8px',
                                    marginBottom: '24px',
                                }}>
                                    <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>New Balance</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: moneyAction === 'add' ? '#22c55e' : '#ef4444' }}>
                                        ${moneyAction === 'add'
                                            ? (selectedCitizen.balance + Number(moneyAmount)).toLocaleString()
                                            : (selectedCitizen.balance - Number(moneyAmount)).toLocaleString()
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '10px 20px',
                                    background: moneyAction === 'add' ? '#22c55e' : '#ef4444',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {moneyAction === 'add' ? 'Add Money' : 'Remove Money'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Limits Modal */}
            {modal === 'limits' && selectedCitizen && (
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
                                Manage Limits
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>
                                {selectedCitizen.name} ({selectedCitizen.id})
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                    Overdraft Limit
                                </label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ color: '#fdb81e', fontSize: '24px' }}>$</span>
                                    <input
                                        type="number"
                                        value={newOverdraft}
                                        onChange={(e) => setNewOverdraft(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '18px',
                                        }}
                                    />
                                </div>
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                                    Currently: ${selectedCitizen.overdraftLimit.toLocaleString()}
                                </p>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                                    Credit Card Limit
                                </label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ color: '#22c55e', fontSize: '24px' }}>$</span>
                                    <input
                                        type="number"
                                        value={newCreditLimit}
                                        onChange={(e) => setNewCreditLimit(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            background: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '18px',
                                        }}
                                    />
                                </div>
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                                    Currently: ${selectedCitizen.creditLimit.toLocaleString()}
                                </p>
                            </div>

                            <div style={{
                                padding: '16px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '8px',
                            }}>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Credit Score Impact</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>{selectedCitizen.creditScore}</span>
                                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                                        - Higher limits may improve credit utilization ratio
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: '10px 20px',
                                    background: '#fdb81e',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#0f172a',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Save Limits
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {modal === 'view' && selectedCitizen && (
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
                                Citizen Details
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748b', fontFamily: 'monospace' }}>
                                {selectedCitizen.id}
                            </p>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Name</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{selectedCitizen.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Balance</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#22c55e' }}>${selectedCitizen.balance.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Credit Score</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{selectedCitizen.creditScore}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Overdraft Limit</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#fdb81e' }}>${selectedCitizen.overdraftLimit.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Credit Limit</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#22c55e' }}>${selectedCitizen.creditLimit.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
