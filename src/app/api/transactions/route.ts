import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getTransactions } from '@/lib/api';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const txRes = await getTransactions(userId, limit);
        return NextResponse.json({
            transactions: txRes?.transactions || []
        });
    } catch (error) {
        console.error('[API/Transactions] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
