'use client';

import { useState } from 'react';

const tierConfig = {
    1: { name: 'Studio Apartment', bedrooms: 1, weeklyRent: 550, purchasePrice: 28600, features: ['Essential bills'], icon: '🏠' },
    2: { name: '1BR Apartment', bedrooms: 1, weeklyRent: 850, purchasePrice: 44200, features: ['Parking', 'Laundry'], icon: '🏢' },
    3: { name: '2BR Apartment', bedrooms: 2, weeklyRent: 1200, purchasePrice: 62400, features: ['WiFi', 'Guest room'], icon: '🏢' },
    4: { name: '3BR Townhouse', bedrooms: 3, weeklyRent: 1800, purchasePrice: 93600, features: ['Garage', 'Yard'], icon: '🏡' },
    5: { name: '4BR House', bedrooms: 4, weeklyRent: 2500, purchasePrice: 130000, features: ['Pool', 'Office'], icon: '🏘️' },
    6: { name: 'Luxury Estate', bedrooms: 5, weeklyRent: 4000, purchasePrice: 208000, features: ['Guest House', 'Security'], icon: '🏰' },
};

const utilities = [
    { id: 'wifi', name: 'WiFi/Internet', cost: 75, desc: 'Remote work enabled', active: true },
    { id: 'cable', name: 'Premium Cable', cost: 50, desc: '+10% luck in events', active: false },
    { id: 'security', name: 'Security System', cost: 100, desc: '-50% robbery chance', active: true },
    { id: 'lawn', name: 'Lawn Service', cost: 40, desc: 'Prevents HOA fines', active: false },
    { id: 'insurance', name: 'Home Insurance', cost: 30, desc: '80-100% disaster coverage', active: true },
];

const mockHousing = { propertyId: 'STU-Y9N3IZ', tier: 1, address: '3853 Peachtree Commons, Apt 12D', city: 'Washington', state: 'DC', neighborhood: 'Suburbs', moveInDate: 'Jan 16, 2026', status: 'Renting', rentDue: 5 };

const availableProperties = [
    { id: 'P1', tier: 2, city: 'Washington', state: 'DC', lat: 38.9, lng: -77.0 },
    { id: 'P2', tier: 3, city: 'New York', state: 'NY', lat: 40.7, lng: -74.0 },
    { id: 'P3', tier: 4, city: 'Los Angeles', state: 'CA', lat: 34.0, lng: -118.2 },
    { id: 'P4', tier: 5, city: 'Miami', state: 'FL', lat: 25.8, lng: -80.2 },
    { id: 'P5', tier: 2, city: 'Chicago', state: 'IL', lat: 41.9, lng: -87.6 },
    { id: 'P6', tier: 3, city: 'Houston', state: 'TX', lat: 29.8, lng: -95.4 },
    { id: 'P7', tier: 1, city: 'Seattle', state: 'WA', lat: 47.6, lng: -122.3 },
    { id: 'P8', tier: 6, city: 'Phoenix', state: 'AZ', lat: 33.4, lng: -112.1 },
    { id: 'P9', tier: 2, city: 'Denver', state: 'CO', lat: 39.7, lng: -105.0 },
    { id: 'P10', tier: 4, city: 'Atlanta', state: 'GA', lat: 33.7, lng: -84.4 },
    { id: 'P11', tier: 3, city: 'Boston', state: 'MA', lat: 42.4, lng: -71.1 },
    { id: 'P12', tier: 1, city: 'Portland', state: 'OR', lat: 45.5, lng: -122.7 },
];

const rentHistory = [{ month: 'January 2026', amount: 550, status: 'paid', paidAt: 'Jan 3' }, { month: 'December 2025', amount: 550, status: 'paid', paidAt: 'Dec 2' }];

export default function HousingPage() {
    const [activeTab, setActiveTab] = useState<'current' | 'marketplace' | 'utilities'>('current');
    const [showPayRent, setShowPayRent] = useState(false);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<typeof availableProperties[0] | null>(null);
    const [userUtilities, setUserUtilities] = useState(utilities);
    const [paySuccess, setPaySuccess] = useState(false);
    const [filterTier, setFilterTier] = useState<number | null>(null);

    const currentTier = tierConfig[mockHousing.tier as keyof typeof tierConfig];
    const totalUtilityCost = userUtilities.filter(u => u.active).reduce((s, u) => s + u.cost, 0);
    const filteredProperties = filterTier ? availableProperties.filter(p => p.tier === filterTier) : availableProperties;

    const handlePayRent = () => { setPaySuccess(true); setTimeout(() => { setShowPayRent(false); setPaySuccess(false); }, 2000); };
    const toggleUtility = (id: string) => { setUserUtilities(userUtilities.map(u => u.id === id ? { ...u, active: !u.active } : u)); };
    const openProperty = (prop: typeof availableProperties[0]) => { setSelectedProperty(prop); setShowPropertyModal(true); };

    // Convert lat/lng to SVG coordinates
    const toSvg = (lat: number, lng: number) => ({ x: ((lng + 130) / 60) * 800, y: ((50 - lat) / 28) * 400 });

    return (
        <div>
            <div className="welcome-banner">
                <div><h1>Housing</h1><p>Manage your residence, utilities, and explore properties</p></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Monthly Cost</div><div style={{ fontSize: '32px', fontWeight: 700 }}>${(currentTier.weeklyRent * 4 + totalUtilityCost * 4).toLocaleString()}</div></div>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
                {[{ id: 'current', label: '🏠 My Home' }, { id: 'marketplace', label: '🗺️ Property Market' }, { id: 'utilities', label: '⚡ Utilities' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? 'white' : 'transparent', fontWeight: activeTab === tab.id ? 600 : 400, cursor: 'pointer', boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>{tab.label}</button>
                ))}
            </div>

            {activeTab === 'current' && (
                <div className="content-grid">
                    <div className="main-content">
                        <div className="panel">
                            <div className="panel-header"><h2>Current Residence</h2><span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>{mockHousing.status}</span></div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                                    <div style={{ width: '180px', height: '140px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>{currentTier.icon}</div>
                                    <div style={{ flex: 1 }}><div style={{ fontSize: '24px', fontWeight: 700, color: '#112e51', marginBottom: '4px' }}>{currentTier.name}</div><div style={{ color: '#64748b', marginBottom: '12px' }}>{mockHousing.address}, {mockHousing.city}, {mockHousing.state}</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{currentTier.features.map((f, i) => (<span key={i} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '13px' }}>{f}</span>))}</div></div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                                    <div><div style={{ fontSize: '12px', color: '#64748b' }}>Bedrooms</div><div style={{ fontWeight: 600, fontSize: '18px' }}>{currentTier.bedrooms}</div></div>
                                    <div><div style={{ fontSize: '12px', color: '#64748b' }}>Weekly Rent</div><div style={{ fontWeight: 600, fontSize: '18px', color: '#22c55e' }}>${currentTier.weeklyRent}</div></div>
                                    <div><div style={{ fontSize: '12px', color: '#64748b' }}>Neighborhood</div><div style={{ fontWeight: 600, fontSize: '18px' }}>{mockHousing.neighborhood}</div></div>
                                    <div><div style={{ fontSize: '12px', color: '#64748b' }}>Move-in</div><div style={{ fontWeight: 600, fontSize: '18px' }}>{mockHousing.moveInDate}</div></div>
                                </div>
                            </div>
                        </div>
                        <div className="panel" style={{ marginTop: '24px' }}><div className="panel-header"><h2>Rent History</h2></div><table className="tx-table"><thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Paid</th></tr></thead><tbody>{rentHistory.map((r, i) => (<tr key={i}><td style={{ fontWeight: 500 }}>{r.month}</td><td>${r.amount}</td><td><span style={{ padding: '4px 12px', background: '#f0fdf4', color: '#22c55e', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>✓ Paid</span></td><td style={{ color: '#64748b' }}>{r.paidAt}</td></tr>))}</tbody></table></div>
                    </div>
                    <div className="sidebar-widgets">
                        <div className="sidebar-widget"><h3>Next Payment</h3><div style={{ textAlign: 'center', padding: '16px' }}><div style={{ fontSize: '40px', fontWeight: 700, color: 'var(--primary)' }}>${currentTier.weeklyRent}</div><div style={{ color: '#64748b', marginTop: '4px' }}>Due on the {mockHousing.rentDue}th</div><button onClick={() => setShowPayRent(true)} style={{ marginTop: '16px', width: '100%', padding: '12px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay Rent</button></div></div>
                        <div className="sidebar-widget"><h3>Quick Actions</h3><div className="quick-links"><button className="quick-link-btn"><span>📋</span> View Lease</button><button className="quick-link-btn"><span>🔧</span> Request Repair</button><button className="quick-link-btn" onClick={() => setActiveTab('marketplace')}><span>🏠</span> Find New Home</button></div></div>
                    </div>
                </div>
            )}

            {activeTab === 'marketplace' && (
                <div>
                    {/* Filter Bar */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>Filter by Tier:</span>
                        <button onClick={() => setFilterTier(null)} style={{ padding: '8px 16px', borderRadius: '20px', border: filterTier === null ? 'none' : '1px solid #e2e8f0', background: filterTier === null ? '#112e51' : 'white', color: filterTier === null ? 'white' : '#475569', cursor: 'pointer', fontSize: '13px' }}>All</button>
                        {Object.entries(tierConfig).map(([tier, config]) => (
                            <button key={tier} onClick={() => setFilterTier(Number(tier))} style={{ padding: '8px 16px', borderRadius: '20px', border: filterTier === Number(tier) ? 'none' : '1px solid #e2e8f0', background: filterTier === Number(tier) ? '#112e51' : 'white', color: filterTier === Number(tier) ? 'white' : '#475569', cursor: 'pointer', fontSize: '13px' }}>{config.icon} {config.name.split(' ')[0]}</button>
                        ))}
                    </div>

                    {/* Full Width Map */}
                    <div className="panel" style={{ marginBottom: '24px' }}>
                        <div className="panel-header"><h2>🗺️ Interactive Property Map</h2><span style={{ fontSize: '13px', color: '#64748b' }}>{filteredProperties.length} properties available</span></div>
                        <div style={{ padding: '24px', background: '#f8fafc' }}>
                            <svg viewBox="0 0 800 400" style={{ width: '100%', height: '400px', background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                {/* USA Outline - Simplified polygon */}
                                <path d="M120,80 L180,60 L240,55 L280,50 L340,48 L400,45 L480,50 L540,55 L600,65 L680,80 L720,100 L740,140 L750,200 L740,260 L720,300 L680,340 L600,360 L540,350 L500,360 L460,350 L400,355 L340,340 L280,350 L220,340 L160,320 L120,280 L100,220 L90,160 L100,100 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                                {/* Property markers */}
                                {filteredProperties.map(prop => {
                                    const pos = toSvg(prop.lat, prop.lng);
                                    const tier = tierConfig[prop.tier as keyof typeof tierConfig];
                                    const colors = ['#22c55e', '#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
                                    return (
                                        <g key={prop.id} onClick={() => openProperty(prop)} style={{ cursor: 'pointer' }}>
                                            <circle cx={pos.x} cy={pos.y} r="16" fill={colors[prop.tier - 1]} stroke="white" strokeWidth="3" />
                                            <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="14">{tier.icon}</text>
                                            <text x={pos.x} y={pos.y + 32} textAnchor="middle" fontSize="11" fontWeight="600" fill="#112e51">{prop.city}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Property Grid */}
                    <div className="panel">
                        <div className="panel-header"><h2>Available Properties</h2></div>
                        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {filteredProperties.map(prop => {
                                const tier = tierConfig[prop.tier as keyof typeof tierConfig];
                                return (
                                    <div key={prop.id} onClick={() => openProperty(prop)} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}><div style={{ fontSize: '32px' }}>{tier.icon}</div><div style={{ padding: '4px 8px', background: '#112e51', color: 'white', borderRadius: '6px', fontSize: '11px' }}>Tier {prop.tier}</div></div>
                                        <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{tier.name}</div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>{prop.city}, {prop.state}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: '10px', color: '#64748b' }}>Rent</div><div style={{ fontWeight: 700, color: '#22c55e' }}>${tier.weeklyRent}/wk</div></div><div><div style={{ fontSize: '10px', color: '#64748b' }}>Buy</div><div style={{ fontWeight: 700, color: '#112e51' }}>${(tier.purchasePrice / 1000).toFixed(0)}k</div></div></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'utilities' && (
                <div className="content-grid">
                    <div className="main-content">
                        <div className="panel">
                            <div className="panel-header"><h2>⚡ Manage Utilities</h2></div>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {userUtilities.map(util => (
                                    <div key={util.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: util.active ? '#f0fdf4' : '#f8fafc', borderRadius: '12px', border: util.active ? '1px solid #22c55e33' : '1px solid #e2e8f0' }}>
                                        <div><div style={{ fontWeight: 700, marginBottom: '4px' }}>{util.name}</div><div style={{ fontSize: '13px', color: '#64748b' }}>{util.desc}</div></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}><div style={{ fontWeight: 700, color: util.active ? '#22c55e' : '#64748b' }}>${util.cost}/wk</div><button onClick={() => toggleUtility(util.id)} style={{ width: '50px', height: '28px', borderRadius: '14px', background: util.active ? '#22c55e' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative' }}><div style={{ width: '24px', height: '24px', borderRadius: '12px', background: 'white', position: 'absolute', top: '2px', left: util.active ? '24px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} /></button></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-widgets">
                        <div className="sidebar-widget"><h3>Monthly Summary</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Rent (4 weeks)</span><span style={{ fontWeight: 600 }}>${currentTier.weeklyRent * 4}</span></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Utilities (4 weeks)</span><span style={{ fontWeight: 600 }}>${totalUtilityCost * 4}</span></div><div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 600 }}>Total</span><span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '20px' }}>${(currentTier.weeklyRent + totalUtilityCost) * 4}</span></div></div></div>
                    </div>
                </div>
            )}

            {showPayRent && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}><div style={{ background: 'white', borderRadius: '16px', width: '400px' }}><div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>Pay Rent</h2></div>{!paySuccess ? (<><div style={{ padding: '24px', textAlign: 'center' }}><div style={{ fontSize: '48px', fontWeight: 700, color: '#22c55e' }}>${currentTier.weeklyRent}</div></div><div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}><button onClick={() => setShowPayRent(false)} style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Cancel</button><button onClick={handlePayRent} style={{ padding: '10px 24px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Pay Rent</button></div></>) : (<div style={{ padding: '48px', textAlign: 'center' }}><div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div><div style={{ fontSize: '20px', fontWeight: 600 }}>Rent Paid!</div></div>)}</div></div>)}

            {showPropertyModal && selectedProperty && (() => {
                const tier = tierConfig[selectedProperty.tier as keyof typeof tierConfig];
                return (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}><div style={{ background: 'white', borderRadius: '16px', width: '520px' }}><div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}><h2 style={{ fontSize: '20px', fontWeight: 700, color: '#112e51' }}>{tier.name}</h2><p style={{ fontSize: '14px', color: '#64748b' }}>{selectedProperty.city}, {selectedProperty.state}</p></div><div style={{ padding: '24px' }}><div style={{ textAlign: 'center', marginBottom: '24px' }}><div style={{ fontSize: '64px' }}>{tier.icon}</div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}><div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}><div style={{ fontSize: '12px', color: '#64748b' }}>Weekly Rent</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${tier.weeklyRent}</div></div><div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}><div style={{ fontSize: '12px', color: '#64748b' }}>Purchase Price</div><div style={{ fontSize: '24px', fontWeight: 700, color: '#112e51' }}>${tier.purchasePrice.toLocaleString()}</div></div></div><div style={{ marginBottom: '24px' }}><div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Features</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{tier.features.map((f, i) => (<span key={i} style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '13px' }}>✓ {f}</span>))}</div></div></div><div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}><button onClick={() => setShowPropertyModal(false)} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>Close</button><button style={{ flex: 1, padding: '12px', background: '#22c55e', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>🏠 Rent</button><button style={{ flex: 1, padding: '12px', background: '#112e51', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>💰 Buy</button></div></div></div>);
            })()}
        </div>
    );
}
