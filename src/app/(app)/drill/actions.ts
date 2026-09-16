'use server';

import { redirect } from 'next/navigation';
import { startDrillSession, type DrillFilters } from '@/lib/drill';

export async function beginDrill(filters: DrillFilters) {
  const sessionId = await startDrillSession(filters);
  redirect(`/drill/${sessionId}`);
}
