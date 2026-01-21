/**
 * Citizen Portal API Client
 * 
 * Client for connecting to the CO-Economy-Bot's citizen API.
 */

const API_BASE = 'http://localhost:3320';
const API_KEY = 'citizen-portal-key';

export interface Citizen {
    citizenId: string;
    userId: string;
    name: string;
    balance: number;
    bankAccounts: {
        checking: { balance: number };
        savings: { balance: number };
    };
    creditScore: number;
    status: string;
}

export interface Account {
    type: string;
    number: string;
    balance: number;
    icon: string;
}

export interface Transaction {
    transaction_id: string;
    type: string;
    amount: number;
    description: string;
    created_at: string;
}

export interface Loan {
    loan_id: string;
    loan_type: string;
    principal: number;
    remaining_balance: number;
    weekly_payment: number;
    status: string;
}

export interface Fine {
    fine_id: string;
    amount: number;
    reason: string;
    status: string;
    issued_at: string;
}

async function apiRequest<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function getCitizen(userId: string, guildId?: string) {
    const params = guildId ? `?guildId=${guildId}` : '';
    return apiRequest<{ ok: boolean; citizen: Citizen }>(`/api/citizen/${userId}${params}`);
}

export async function getAccounts(userId: string, guildId?: string) {
    const params = guildId ? `?guildId=${guildId}` : '';
    return apiRequest<{ ok: boolean; accounts: Account[]; cards: unknown[]; total: number }>(
        `/api/citizen/${userId}/accounts${params}`
    );
}

export async function getTransactions(userId: string, limit = 20, guildId?: string) {
    const params = new URLSearchParams();
    if (guildId) params.set('guildId', guildId);
    params.set('limit', String(limit));
    return apiRequest<{ ok: boolean; transactions: Transaction[] }>(
        `/api/citizen/${userId}/transactions?${params}`
    );
}

export async function getCredit(userId: string, guildId?: string) {
    const params = guildId ? `?guildId=${guildId}` : '';
    return apiRequest<{ ok: boolean; credit: { score: number; band: string } }>(
        `/api/citizen/${userId}/credit${params}`
    );
}

export async function getLoans(userId: string, guildId?: string) {
    const params = guildId ? `?guildId=${guildId}` : '';
    return apiRequest<{ ok: boolean; loans: Loan[] }>(`/api/citizen/${userId}/loans${params}`);
}

export async function getPayroll(userId: string, guildId?: string) {
    const params = guildId ? `?guildId=${guildId}` : '';
    return apiRequest<{ ok: boolean; payslips: unknown[]; job?: unknown }>(`/api/citizen/${userId}/payroll${params}`);
}

// Alias for getPayroll
export const getPayslips = getPayroll;

export async function getFines(userId: string, guildId?: string) {
    const params = guildId ? `?guildId=${guildId}` : '';
    return apiRequest<{ ok: boolean; fines: Fine[]; debts: unknown[]; warrants: unknown[] }>(
        `/api/citizen/${userId}/fines${params}`
    );
}

export async function getHousing(userId: string) {
    return apiRequest<{
        ok: boolean;
        housing: unknown;
        config: { tiers: unknown; utilities: unknown };
        availableProperties: unknown[]
    }>(`/api/citizen/${userId}/housing`);
}

export async function checkApiHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`);
        return res.ok;
    } catch {
        return false;
    }
}
