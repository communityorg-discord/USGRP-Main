import { getCitizen, getAccounts, getTransactions, getCredit, getLoans, getFines, getHousing } from '@/lib/api';

// For now, use a test user ID - will be replaced with session user
const TEST_USER_ID = process.env.DEV_USER_ID || '723199054514749450';

export async function getDashboardData() {
    try {
        const [citizenRes, accountsRes, txRes, creditRes, loansRes, finesRes, housingRes] = await Promise.all([
            getCitizen(TEST_USER_ID).catch(() => null),
            getAccounts(TEST_USER_ID).catch(() => null),
            getTransactions(TEST_USER_ID, 5).catch(() => null),
            getCredit(TEST_USER_ID).catch(() => null),
            getLoans(TEST_USER_ID).catch(() => null),
            getFines(TEST_USER_ID).catch(() => null),
            getHousing(TEST_USER_ID).catch(() => null),
        ]);

        return {
            citizen: citizenRes?.citizen || null,
            accounts: accountsRes?.accounts || [],
            totalBalance: accountsRes?.total || 0,
            transactions: txRes?.transactions || [],
            credit: creditRes?.credit || { score: 650, band: 'Fair' },
            loans: loansRes?.loans || [],
            fines: finesRes?.fines || [],
            debts: finesRes?.debts || [],
            warrants: finesRes?.warrants || [],
            housing: housingRes?.housing || null,
            apiConnected: !!citizenRes
        };
    } catch (error) {
        console.error('[Dashboard] Error fetching data:', error);
        return {
            citizen: null,
            accounts: [],
            totalBalance: 0,
            transactions: [],
            credit: { score: 650, band: 'Fair' },
            loans: [],
            fines: [],
            debts: [],
            warrants: [],
            housing: null,
            apiConnected: false
        };
    }
}
