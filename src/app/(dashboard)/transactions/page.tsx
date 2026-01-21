'use client';

import { useState, useEffect, useMemo } from 'react';

interface Transaction {
    transaction_id: string;
    description: string;
    amount: number;
    created_at: string;
    type: string;
    category?: string;
    account?: string;
}

const categories = ['All', 'Payroll', 'Transfer', 'Shopping', 'Gambling', 'Housing', 'Interest', 'Cash', 'Transportation', 'Food', 'Utilities'];
const accounts = ['All', 'Checking', 'Savings', 'Credit Card'];
const types = ['All', 'Income', 'Expenses'];

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [accountFilter, setAccountFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [dateRange, setDateRange] = useState('30');
    const [showExportModal, setShowExportModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/transactions?limit=100');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data.transactions || []);
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
            if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
            if (accountFilter !== 'All' && tx.account !== accountFilter) return false;
            if (typeFilter === 'Income' && tx.amount < 0) return false;
            if (typeFilter === 'Expenses' && tx.amount > 0) return false;
            return true;
        });
    }, [transactions, search, categoryFilter, accountFilter, typeFilter]);

    const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalExpenses = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
    const netFlow = totalIncome - totalExpenses;

    const handleExport = () => {
        const csv = [
            ['Date', 'Description', 'Category', 'Account', 'Amount'],
            ...filteredTransactions.map(t => [t.created_at, t.description, t.category || '', t.account || '', t.amount.toString()])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        setShowExportModal(false);
    };

    const categoryBreakdown = useMemo(() => {
        const breakdown: { [key: string]: number } = {};
        filteredTransactions.filter(t => t.amount < 0).forEach(t => {
            const cat = t.category || 'Other';
            breakdown[cat] = (breakdown[cat] || 0) + Math.abs(t.amount);
        });
        return Object.entries(breakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }, [filteredTransactions]);

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: '#64748b' }}>Loading transactions...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header with Banner */}
            <div className="welcome-banner">
                <div>
                    <h1>Transaction History</h1>
                    <p>View and export your transaction history</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Net Flow (This Period)</div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: netFlow >= 0 ? '#86efac' : '#fca5a5' }}>
                        {netFlow >= 0 ? '+' : '-'}${Math.abs(netFlow).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="accounts-grid">
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#f0fdf4' }}>📈</div>
                    <div className="account-info">
                        <div className="account-type">Total Income</div>
                        <div className="account-number">{filteredTransactions.filter(t => t.amount > 0).length} transactions</div>
                    </div>
                    <div className="account-balance" style={{ color: '#22c55e' }}>+${totalIncome.toLocaleString()}</div>
                </div>
                <div className="account-card">
                    <div className="account-icon" style={{ background: '#fef2f2' }}>📉</div>
                    <div className="account-info">
                        <div className="account-type">Total Expenses</div>
                        <div className="account-number">{filteredTransactions.filter(t => t.amount < 0).length} transactions</div>
                    </div>
                    <div className="account-balance" style={{ color: '#ef4444' }}>-${totalExpenses.toLocaleString()}</div>
                </div>
                <div className="account-card" style={{ cursor: 'pointer' }} onClick={() => setShowExportModal(true)}>
                    <div className="account-icon" style={{ background: '#eff6ff' }}>📥</div>
                    <div className="account-info">
                        <div className="account-type">Export Data</div>
                        <div className="account-number">Download as CSV</div>
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Export →</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Left Column - Transactions */}
                <div className="main-content">
                    {/* Filters */}
                    <div className="panel" style={{ marginBottom: '24px' }}>
                        <div style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '200px' }}
                            />
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                            </select>
                            <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
                                {accounts.map(a => <option key={a} value={a}>{a === 'All' ? 'All Accounts' : a}</option>)}
                            </select>
                            {(categoryFilter !== 'All' || accountFilter !== 'All' || typeFilter !== 'All' || search) && (
                                <button onClick={() => { setCategoryFilter('All'); setAccountFilter('All'); setTypeFilter('All'); setSearch(''); }} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#64748b', fontSize: '14px', cursor: 'pointer' }}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Transactions ({filteredTransactions.length})</h2>
                        </div>
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx.transaction_id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedTx(tx); setShowDetailModal(true); }}>
                                            <td>
                                                <div className={`tx-icon ${tx.amount > 0 ? 'credit' : 'debit'}`}>{tx.amount > 0 ? '↓' : '↑'}</div>
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{tx.description}</td>
                                            <td>
                                                <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '4px', fontSize: '12px' }}>{tx.category || tx.type}</span>
                                            </td>
                                            <td style={{ color: '#64748b' }}>{tx.created_at}</td>
                                            <td className={`tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`} style={{ fontWeight: 600 }}>
                                                {tx.amount >= 0 ? '+' : ''}${tx.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column - Insights */}
                <div className="sidebar-widgets">
                    {/* Spending Breakdown */}
                    <div className="sidebar-widget">
                        <h3>Spending by Category</h3>
                        {categoryBreakdown.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No spending data</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {categoryBreakdown.map(([cat, amount]) => (
                                    <div key={cat}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '14px' }}>{cat}</span>
                                            <span style={{ fontWeight: 600 }}>${amount.toLocaleString()}</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0}%`, background: 'var(--primary)', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="sidebar-widget">
                        <h3>Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn" onClick={() => setShowExportModal(true)}>
                                <span>📥</span> Export to CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            {showExportModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '400px', padding: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51', marginBottom: '8px' }}>Export Transactions</h2>
                        <p style={{ color: '#64748b', marginBottom: '20px' }}>Download {filteredTransactions.length} transactions as CSV</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowExportModal(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleExport} style={{ padding: '10px 20px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>📥 Download CSV</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Detail Modal */}
            {showDetailModal && selectedTx && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '420px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Transaction Details</h2>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ fontSize: '40px', fontWeight: 700, color: selectedTx.amount >= 0 ? '#22c55e' : '#ef4444' }}>
                                    {selectedTx.amount >= 0 ? '+' : ''}${selectedTx.amount.toLocaleString()}
                                </div>
                                <div style={{ color: '#64748b', marginTop: '4px' }}>{selectedTx.description}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Date</div><div style={{ fontWeight: 500 }}>{selectedTx.created_at}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Type</div><div style={{ fontWeight: 500, color: selectedTx.amount >= 0 ? '#22c55e' : '#ef4444' }}>{selectedTx.amount >= 0 ? 'Income' : 'Expense'}</div></div>
                                <div><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>ID</div><div style={{ fontWeight: 500, fontSize: '12px', fontFamily: 'monospace' }}>{selectedTx.transaction_id}</div></div>
                            </div>
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
                            <button onClick={() => setShowDetailModal(false)} style={{ width: '100%', padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
