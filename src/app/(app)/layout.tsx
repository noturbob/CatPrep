import { Nav } from '@/components/nav';
import { daysToCat } from '@/lib/plan';

export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Nav daysLeft={daysToCat()} />
      {children}
    </>
  );
}
