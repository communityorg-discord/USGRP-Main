import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getAccounts } from '@/lib/api';

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const accountsRes = await getAccounts(userId);
        return NextResponse.json({
            accounts: accountsRes?.accounts || [],
            cards: accountsRes?.cards || [],
            total: accountsRes?.total || 0
        });
    } catch (error) {
        console.error('[API/Banking] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
