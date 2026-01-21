import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { getHousing } from '@/lib/api';

export async function GET() {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const housingRes = await getHousing(userId);
        return NextResponse.json({
            housing: housingRes?.housing || null,
            config: housingRes?.config || {},
            availableProperties: housingRes?.availableProperties || []
        });
    } catch (error) {
        console.error('[API/Housing] Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
