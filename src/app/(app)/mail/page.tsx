import { NotBuilt } from '@/components/not-built';
export default function Page() {
  return <NotBuilt
    title="IIM inbox"
    blurb="Gmail scanned every six hours, filed into admission-process categories. Not built yet."
    bullets={[
      'Classification rules and all 21 IIM domains are written and tested (12/12 on realistic subject lines)',
      'Still to wire: Gmail OAuth, the sync route and the cron job',
      'Before CAT this only catches iimcat.ac.in mail; the shortlist flood starts in January',
    ]} />;
}
