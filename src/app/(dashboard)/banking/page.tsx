'use client';

import { useState, useEffect } from 'react';

// Mock data (fallback)
const mockAccounts = [
    { id: 1, type: 'Checking', number: '****4523', balance: 45230, routingNumber: '******789', status: 'Active', opened: 'Jan 15, 2024' },
    { id: 2, type: 'Savings', number: '****8901', balance: 12500, routingNumber: '******789', status: 'Active', opened: 'Jan 15, 2024', apy: '2.5%' },
];

const mockCards = [
    { id: 1, type: 'Debit', number: '****4523', holder: 'JOHN DOE', expiry: '12/28', status: 'Active', locked: false, color: 'linear-gradient(135deg, #112e51 0%, #205493 100%)' },
    { id: 2, type: 'Credit', number: '****3456', holder: 'JOHN DOE', expiry: '09/27', status: 'Active', locked: false, limit: 5000, used: 1250, color: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' },
];

const mockRecentActivity = [
    { id: 1, desc: 'ATM Withdrawal', amount: -200, date: 'Today', location: 'Downtown ATM' },
    { id: 2, desc: 'Weekly Salary', amount: 4290, date: 'Jan 19', location: 'FBI Payroll' },
    { id: 3, desc: 'Transfer to Savings', amount: -500, date: 'Jan 18', location: 'Internal' },
    { id: 4, desc: 'Grocery Store', amount: -87, date: 'Jan 17', location: 'FreshMart' },
];

interface Account {
    id?: number;
    type: string;
    number: string;
    balance: number;
    routingNumber?: string;
    status?: string;
    opened?: string;
    apy?: string;
    icon?: string;
}

interface Card {
    id: number;
    type: string;
    number: string;
    holder: string;
    expiry: string;
    status: string;
    locked: boolean;
    color: string;
    limit?: number;
    used?: number;
}

type ModalType = 'transfer' | 'deposit' | 'accountDetails' | 'cardActions' | 'lockCard' | 'changePin' | 'reportLost' | 'mobileWallet' | 'spendingAlerts' | 'requestCard' | null;

export default function BankingPage() {
    const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
    const [cards, setCards] = useState<Card[]>(mockCards);
    const [totalAssets, setTotalAssets] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [apiConnected, setApiConnected] = useState(false);

    const [modal, setModal] = useState<ModalType>(null);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    // Transfer form
    const [transferFrom, setTransferFrom] = useState('');
    const [transferTo, setTransferTo] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferNote, setTransferNote] = useState('');
    const [transferType, setTransferType] = useState<'internal' | 'external'>('internal');
    const [transferSuccess, setTransferSuccess] = useState(false);

    // Spending alerts
    const [alertThreshold, setAlertThreshold] = useState('100');
    const [alertEnabled, setAlertEnabled] = useState(true);

    // Fetch real data
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/banking');
                if (res.ok) {
                    const data = await res.json();
                    if (data.accounts && data.accounts.length > 0) {
                        setAccounts(data.accounts.map((a: Account, i: number) => ({
                            ...a,
                            id: i + 1,
                            routingNumber: '******789',
                            status: 'Active',
                            opened: 'Jan 2024'
                        })));
                        setTotalAssets(data.total || data.accounts.reduce((s: number, a: Account) => s + a.balance, 0));
                        setApiConnected(true);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch banking data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // Calculate total if not from API
    useEffect(() => {
        if (!apiConnected) {
            setTotalAssets(accounts.reduce((s, a) => s + a.balance, 0));
        }
    }, [accounts, apiConnected]);

    const handleTransfer = () => {
        setTransferSuccess(true);
        setTimeout(() => {
            setModal(null);
            setTransferSuccess(false);
            setTransferAmount('');
            setTransferTo('');
        }, 2000);
    };

    const toggleCardLock = (cardId: number) => {
        setCards(cards.map(c => c.id === cardId ? { ...c, locked: !c.locked } : c));
        setModal(null);
    };

    return (
        <div>
            {/* Page Header */}
            <div className="welcome-banner">
                <div>
                    <h1>Bank Accounts</h1>
                    <p>Manage your accounts and cards</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Total Assets</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>${totalAssets.toLocaleString()}</div>
                </div>
            </div>

            {/* Account Summary Cards */}
            <div className="accounts-grid">
                {mockAccounts.map((account) => (
                    <div
                        key={account.id}
                        className="account-card"
                        onClick={() => { setSelectedAccount(account); setModal('accountDetails'); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="account-icon">🏦</div>
                        <div className="account-info">
                            <div className="account-type">{account.type}</div>
                            <div className="account-number">{account.number}</div>
                        </div>
                        <div className="account-balance">${account.balance.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', marginTop: '24px' }}>
                <button
                    onClick={() => { setTransferType('internal'); setModal('transfer'); }}
                    className="btn-primary"
                >
                    🔄 Transfer Between Accounts
                </button>
                <button
                    onClick={() => { setTransferType('external'); setModal('transfer'); }}
                    style={{
                        padding: '12px 24px',
                        background: '#22c55e',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    💸 Send to Citizen
                </button>
                <button
                    onClick={() => setModal('deposit')}
                    style={{
                        padding: '12px 24px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    📥 Deposit Cash
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Left Column - Cards */}
                <div className="main-content">
                    {/* Debit/Credit Cards */}
                    <div className="panel">
                        <div className="panel-header">
                            <h2>Your Cards</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px' }}>
                            {cards.map((card) => (
                                <div key={card.id} style={{ position: 'relative' }}>
                                    <div
                                        style={{
                                            background: card.locked ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)' : card.color,
                                            borderRadius: '16px',
                                            padding: '24px',
                                            color: 'white',
                                            minHeight: '200px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            opacity: card.locked ? 0.7 : 1,
                                        }}
                                    >
                                        {card.locked && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: '40px',
                                            }}>
                                                🔒
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                                                    {card.type} Card {card.locked && '(Locked)'}
                                                </div>
                                                <div style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '2px' }}>
                                                    •••• •••• •••• {card.number.slice(-4)}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '24px' }}>💳</div>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontSize: '10px', opacity: 0.7 }}>CARD HOLDER</div>
                                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{card.holder}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '10px', opacity: 0.7 }}>EXPIRES</div>
                                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{card.expiry}</div>
                                                </div>
                                            </div>
                                            {'limit' in card && card.limit && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}>
                                                        <div
                                                            style={{
                                                                height: '100%',
                                                                width: `${((card.used ?? 0) / (card.limit ?? 1)) * 100}%`,
                                                                background: 'white',
                                                                borderRadius: '3px',
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ fontSize: '12px', marginTop: '6px', opacity: 0.8 }}>
                                                        ${(card.used ?? 0).toLocaleString()} / ${(card.limit ?? 0).toLocaleString()} used
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedCard(card); setModal('cardActions'); }}
                                        style={{
                                            position: 'absolute',
                                            bottom: '-14px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            padding: '10px 20px',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        Manage Card
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="panel" style={{ marginTop: '32px' }}>
                        <div className="panel-header">
                            <h2>Recent Activity</h2>
                            <a href="/transactions" className="btn-link">View All →</a>
                        </div>
                        <table className="tx-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Description</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockRecentActivity.map((activity) => (
                                    <tr key={activity.id}>
                                        <td>
                                            <div className={`tx-icon ${activity.amount >= 0 ? 'credit' : 'debit'}`}>
                                                {activity.amount >= 0 ? '↓' : '↑'}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{activity.desc}</td>
                                        <td style={{ color: '#64748b' }}>{activity.location}</td>
                                        <td style={{ color: '#64748b' }}>{activity.date}</td>
                                        <td className={`tx-amount ${activity.amount >= 0 ? 'credit' : 'debit'}`} style={{ fontWeight: 600 }}>
                                            {activity.amount >= 0 ? '+' : ''}${activity.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column - Widgets */}
                <div className="sidebar-widgets">
                    {/* Card Actions */}
                    <div className="sidebar-widget">
                        <h3>Card Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn" onClick={() => setModal('lockCard')}>
                                <span>🔒</span> Lock All Cards
                            </button>
                            <button className="quick-link-btn" onClick={() => setModal('mobileWallet')}>
                                <span>📱</span> Add to Mobile Wallet
                            </button>
                            <button className="quick-link-btn" onClick={() => setModal('spendingAlerts')}>
                                <span>🔔</span> Set Spending Alerts
                            </button>
                            <button className="quick-link-btn" onClick={() => setModal('requestCard')}>
                                <span>📄</span> Request New Card
                            </button>
                        </div>
                    </div>

                    {/* Account Summary */}
                    <div className="sidebar-widget">
                        <h3>Account Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {mockAccounts.map((acc) => (
                                <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{acc.type}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{acc.number}</div>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>${acc.balance.toLocaleString()}</div>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 600 }}>Total</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${totalAssets.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="sidebar-widget">
                        <h3>This Month</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Income</span>
                                <span style={{ fontWeight: 600, color: '#22c55e' }}>+$8,842</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Expenses</span>
                                <span style={{ fontWeight: 600, color: '#ef4444' }}>-$2,385</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Net Flow</span>
                                <span style={{ fontWeight: 700, color: '#22c55e' }}>+$6,457</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transfer Modal */}
            {modal === 'transfer' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '520px' }}>
                        <div className="modal-header">
                            <h2>{transferType === 'internal' ? 'Transfer Between Accounts' : 'Send to Citizen'}</h2>
                            <p>{transferType === 'internal' ? 'Move money between your accounts' : 'Send money to another USGRP citizen'}</p>
                        </div>
                        {!transferSuccess ? (
                            <>
                                <div className="modal-body">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <label className="form-label">From Account</label>
                                            <select value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)} className="form-select">
                                                <option value="">Select account</option>
                                                {mockAccounts.map((acc) => (
                                                    <option key={acc.id} value={acc.id}>{acc.type} - ${acc.balance.toLocaleString()}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label">{transferType === 'internal' ? 'To Account' : 'Recipient ID'}</label>
                                            {transferType === 'internal' ? (
                                                <select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="form-select">
                                                    <option value="">Select account</option>
                                                    {mockAccounts.filter(a => a.id.toString() !== transferFrom).map((acc) => (
                                                        <option key={acc.id} value={acc.id}>{acc.type}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input type="text" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} placeholder="USC-XXXXXX" className="form-input" />
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label className="form-label">Amount</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '18px' }}>$</span>
                                            <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" className="form-input" style={{ paddingLeft: '36px', fontSize: '18px' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label">Note (optional)</label>
                                        <input type="text" value={transferNote} onChange={(e) => setTransferNote(e.target.value)} placeholder="What's this for?" className="form-input" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                                    <button onClick={handleTransfer} className="btn-primary">Transfer</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <div style={{ fontSize: '20px', fontWeight: 600, color: '#112e51', marginBottom: '8px' }}>Transfer Complete!</div>
                                <div style={{ color: '#64748b' }}>${Number(transferAmount).toLocaleString()} transferred successfully</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Card Actions Modal */}
            {modal === 'cardActions' && selectedCard && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '420px' }}>
                        <div className="modal-header">
                            <h2>{selectedCard.type} Card Actions</h2>
                            <p>{selectedCard.number}</p>
                        </div>
                        <div style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button onClick={() => toggleCardLock(selectedCard.id)} className="action-btn">
                                    <span style={{ fontSize: '20px' }}>{selectedCard.locked ? '🔓' : '🔒'}</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{selectedCard.locked ? 'Unlock Card' : 'Lock Card'}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedCard.locked ? 'Re-enable this card' : 'Temporarily disable'}</div>
                                    </div>
                                </button>
                                <button className="action-btn">
                                    <span style={{ fontSize: '20px' }}>🔑</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Change PIN</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Update your card PIN</div>
                                    </div>
                                </button>
                                <button className="action-btn">
                                    <span style={{ fontSize: '20px' }}>📄</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Report Lost/Stolen</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Request a replacement</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setModal(null)} className="btn-secondary" style={{ width: '100%' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lock All Cards Modal */}
            {modal === 'lockCard' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '400px' }}>
                        <div className="modal-header">
                            <h2>🔒 Lock All Cards</h2>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: '20px', color: '#475569' }}>
                                This will temporarily disable all your cards. You can unlock them at any time.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {cards.map((card) => (
                                    <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{card.type} Card</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{card.number}</div>
                                        </div>
                                        <span style={{ color: card.locked ? '#ef4444' : '#22c55e' }}>{card.locked ? '🔒 Locked' : '✓ Active'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button onClick={() => { setCards(cards.map(c => ({ ...c, locked: true }))); setModal(null); }} style={{ padding: '10px 24px', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                Lock All Cards
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Wallet Modal */}
            {modal === 'mobileWallet' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '400px' }}>
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📱</div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51', marginBottom: '12px' }}>Add to Mobile Wallet</h2>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>Scan this QR code with your phone to add your cards to Apple Pay or Google Pay</p>
                            <div style={{ width: '160px', height: '160px', background: '#f8fafc', borderRadius: '16px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0' }}>
                                <div style={{ fontSize: '80px' }}>📲</div>
                            </div>
                            <button onClick={() => setModal(null)} className="btn-primary" style={{ width: '100%' }}>Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Spending Alerts Modal */}
            {modal === 'spendingAlerts' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '440px' }}>
                        <div className="modal-header">
                            <h2>🔔 Spending Alerts</h2>
                            <p>Get notified about card activity</p>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Enable Alerts</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Receive Discord DMs for transactions</div>
                                </div>
                                <button
                                    onClick={() => setAlertEnabled(!alertEnabled)}
                                    style={{
                                        width: '48px',
                                        height: '28px',
                                        borderRadius: '14px',
                                        background: alertEnabled ? '#22c55e' : '#e2e8f0',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                >
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: 'white',
                                        position: 'absolute',
                                        top: '2px',
                                        left: alertEnabled ? '22px' : '2px',
                                        transition: 'left 0.2s',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                    }} />
                                </button>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label">Alert Threshold</label>
                                <select value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} className="form-select">
                                    <option value="0">All transactions</option>
                                    <option value="50">Over $50</option>
                                    <option value="100">Over $100</option>
                                    <option value="500">Over $500</option>
                                    <option value="1000">Over $1,000</option>
                                </select>
                            </div>
                            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #22c55e33' }}>
                                <div style={{ fontSize: '13px', color: '#166534' }}>
                                    ✓ You'll receive alerts for transactions over ${alertThreshold}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button onClick={() => setModal(null)} className="btn-primary">Save Settings</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request New Card Modal */}
            {modal === 'requestCard' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '440px' }}>
                        <div className="modal-header">
                            <h2>📄 Request New Card</h2>
                            <p>Order a replacement or additional card</p>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: '20px' }}>
                                <label className="form-label">Card Type</label>
                                <select className="form-select">
                                    <option>Replacement Debit Card</option>
                                    <option>Replacement Credit Card</option>
                                    <option>Additional Debit Card</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label className="form-label">Reason</label>
                                <select className="form-select">
                                    <option>Card damaged</option>
                                    <option>Card lost</option>
                                    <option>Card stolen</option>
                                    <option>Name change</option>
                                    <option>Additional card needed</option>
                                </select>
                            </div>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>Delivery Details</div>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    Your new card will be delivered to your registered address within 5-7 business days.
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
                            <button onClick={() => { alert('Card request submitted! Check your Discord for confirmation.'); setModal(null); }} className="btn-primary">Request Card</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Details Modal */}
            {modal === 'accountDetails' && selectedAccount && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '480px' }}>
                        <div className="modal-header">
                            <h2>{selectedAccount.type} Account</h2>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Account Number</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{selectedAccount.number}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Routing Number</div>
                                    <div style={{ fontSize: '16px', fontWeight: 600 }}>{selectedAccount.routingNumber}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Balance</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${selectedAccount.balance.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Status</div>
                                    <div style={{ color: '#22c55e', fontWeight: 600 }}>{selectedAccount.status}</div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setModal(null)} className="btn-secondary">Close</button>
                            <button className="btn-primary">View Statements</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {modal === 'deposit' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '400px', padding: '32px', textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏧</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51', marginBottom: '12px' }}>Deposit Cash</h2>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Use the <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/deposit</code> command in Discord to deposit cash into your account</p>
                        <button onClick={() => setModal(null)} className="btn-primary" style={{ width: '100%' }}>Got it</button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }
        .modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #112e51;
          margin-bottom: 4px;
        }
        .modal-header p {
          font-size: 14px;
          color: #64748b;
        }
        .modal-body {
          padding: 24px;
        }
        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .form-label {
          display: block;
          font-size: 14px;
          color: #475569;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
        }
        .btn-primary {
          padding: 10px 24px;
          background: #112e51;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-secondary {
          padding: 10px 20px;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          color: #475569;
          cursor: pointer;
        }
        .action-btn {
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        .action-btn:hover {
          background: #f1f5f9;
        }
      `}</style>
        </div>
    );
}
