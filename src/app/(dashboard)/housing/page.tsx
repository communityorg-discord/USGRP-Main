'use client';

import { useState, useEffect } from 'react';

interface AddressObject {
    street?: string;
    city?: string;
    state?: string;
    stateAbbr?: string;
    zipCode?: string;
    neighborhood?: string;
    formatted?: string;
    oneLine?: string;
    special?: string;
    type?: string;
}

interface Housing {
    propertyId?: string;
    tier?: number;
    address?: string | AddressObject;
    city?: string;
    state?: string;
    neighborhood?: string;
    moveInDate?: string;
    status?: string;
    rentDue?: number;
    weeklyRent?: number;
}

const tierConfig: Record<number, { name: string; weeklyRent: number; features: string[] }> = {
    0: { name: 'Homeless', weeklyRent: 0, features: ['No fixed address'] },
    1: { name: 'Studio Apartment', weeklyRent: 350, features: ['Basic furnishing', '1 room'] },
    2: { name: '1-Bedroom Apartment', weeklyRent: 550, features: ['Living area', 'Bedroom', 'Kitchen'] },
    3: { name: '2-Bedroom Apartment', weeklyRent: 850, features: ['2 Bedrooms', 'Living area', 'Full kitchen'] },
    4: { name: 'Townhouse', weeklyRent: 1200, features: ['Multiple floors', 'Garage', 'Backyard'] },
    5: { name: 'Single Family Home', weeklyRent: 2000, features: ['Large yard', '3+ Bedrooms', 'Garage'] },
    6: { name: 'Luxury Estate', weeklyRent: 5000, features: ['Pool', 'Multiple garages', 'Guest house'] },
};

// Helper to extract address string from address field
function getAddressString(address: string | AddressObject | undefined): string {
    if (!address) return 'Address not available';
    if (typeof address === 'string') return address;
    // It's an object - try common fields
    return address.oneLine || address.formatted || address.street || 'Address not available';
}

// Helper to extract neighborhood
function getNeighborhood(housing: Housing | null): string {
    if (!housing) return 'N/A';
    if (housing.neighborhood) return housing.neighborhood;
    if (typeof housing.address === 'object' && housing.address?.neighborhood) {
        return housing.address.neighborhood;
    }
    return 'N/A';
}

export default function HousingPage() {
    const [housing, setHousing] = useState<Housing | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'home' | 'utilities' | 'market'>('home');
    const [showPayRent, setShowPayRent] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/housing');
                if (res.ok) {
                    const data = await res.json();
                    setHousing(data.housing);
                }
            } catch (error) {
                console.error('Failed to fetch housing:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handlePayRent = () => {
        setPaymentSuccess(true);
        setTimeout(() => {
            setShowPayRent(false);
            setPaymentSuccess(false);
        }, 2000);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
                    <div style={{ color: '#64748b' }}>Loading housing data...</div>
                </div>
            </div>
        );
    }

    const currentTier = housing?.tier !== undefined ? tierConfig[housing.tier] || tierConfig[0] : tierConfig[0];
    const weeklyRent = housing?.weeklyRent || currentTier.weeklyRent;

    return (
        <div>
            <div className="welcome-banner">
                <div><h1>Housing</h1><p>Manage your residence and utilities</p></div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Monthly Rent</div>
                    <div style={{ fontSize: '32px', fontWeight: 700 }}>${(weeklyRent * 4).toLocaleString()}</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {(['home', 'utilities', 'market'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '12px 24px',
                            background: activeTab === tab ? '#112e51' : 'white',
                            color: activeTab === tab ? 'white' : '#475569',
                            border: activeTab === tab ? 'none' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {tab === 'home' ? '🏠 My Home' : tab === 'utilities' ? '⚡ Utilities' : '🏘️ Market'}
                    </button>
                ))}
            </div>

            <div className="content-grid">
                <div className="main-content">
                    {activeTab === 'home' && (
                        <div className="panel">
                            <div className="panel-header">
                                <h2>Current Residence</h2>
                                {housing && <span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>{housing.status || 'Active'}</span>}
                            </div>
                            <div style={{ padding: '24px' }}>
                                {!housing || housing.tier === 0 ? (
                                    <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏕️</div>
                                        <div style={{ fontWeight: 600, marginBottom: '8px' }}>No Current Residence</div>
                                        <div style={{ fontSize: '14px' }}>Browse the property market to find a home</div>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                                            <div style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, #112e51 0%, #205493 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🏠</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#112e51', marginBottom: '4px' }}>{currentTier.name}</div>
                                                <div style={{ color: '#64748b', marginBottom: '12px' }}>{getAddressString(housing.address)}</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {currentTier.features.map((f, i) => (<span key={i} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '13px' }}>{f}</span>))}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                                            <div><div style={{ fontSize: '12px', color: '#64748b' }}>Neighborhood</div><div style={{ fontWeight: 600, fontSize: '18px' }}>{getNeighborhood(housing)}</div></div>
                                            <div><div style={{ fontSize: '12px', color: '#64748b' }}>Move-in</div><div style={{ fontWeight: 600, fontSize: '18px' }}>{housing.moveInDate || 'N/A'}</div></div>
                                            <div><div style={{ fontSize: '12px', color: '#64748b' }}>Weekly Rent</div><div style={{ fontWeight: 600, fontSize: '18px', color: '#22c55e' }}>${weeklyRent.toLocaleString()}</div></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'utilities' && (
                        <div className="panel">
                            <div className="panel-header"><h2>Utility Bills</h2></div>
                            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <div style={{ fontWeight: 600 }}>All utilities included in rent</div>
                                <div style={{ fontSize: '14px' }}>No separate utility bills</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'market' && (
                        <div className="panel">
                            <div className="panel-header"><h2>Property Market</h2></div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ padding: '24px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>🏘️</div>
                                    <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: '8px' }}>Browse Properties in Discord</div>
                                    <div style={{ fontSize: '14px', color: '#64748b' }}>Use the /housing market command to browse available properties</div>
                                </div>
                                <div style={{ marginTop: '24px' }}>
                                    <h3 style={{ marginBottom: '16px' }}>Housing Tiers</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {Object.entries(tierConfig).filter(([k]) => Number(k) > 0).map(([tier, config]) => (
                                            <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                                                <div><div style={{ fontWeight: 600 }}>Tier {tier}: {config.name}</div><div style={{ fontSize: '13px', color: '#64748b' }}>{config.features.join(' • ')}</div></div>
                                                <div style={{ fontWeight: 700, color: '#112e51' }}>${config.weeklyRent}/wk</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="sidebar-widgets">
                    {housing && housing.tier !== 0 && (
                        <div className="sidebar-widget">
                            <h3>Next Payment</h3>
                            <div style={{ textAlign: 'center', padding: '16px' }}>
                                <div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--primary)' }}>${weeklyRent}</div>
                                <div style={{ color: '#64748b', marginTop: '4px' }}>Due weekly</div>
                                <button onClick={() => setShowPayRent(true)} style={{ marginTop: '16px', width: '100%', padding: '12px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay Rent</button>
                            </div>
                        </div>
                    )}
                    <div className="sidebar-widget">
                        <h3>Quick Actions</h3>
                        <div className="quick-links">
                            <button className="quick-link-btn"><span>🏘️</span> Browse Properties</button>
                            <button className="quick-link-btn"><span>📝</span> Request Maintenance</button>
                            <button className="quick-link-btn"><span>📋</span> View Lease</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pay Rent Modal */}
            {showPayRent && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '400px' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Pay Rent</h2>
                        </div>
                        {!paymentSuccess ? (
                            <>
                                <div style={{ padding: '24px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Weekly rent for {currentTier.name}</div>
                                    <div style={{ fontSize: '48px', fontWeight: 700, color: '#112e51', marginBottom: '24px' }}>${weeklyRent}</div>
                                </div>
                                <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowPayRent(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handlePayRent} style={{ padding: '10px 24px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay ${weeklyRent}</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                                <div style={{ fontSize: '20px', fontWeight: 600, color: '#112e51' }}>Rent Paid!</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
