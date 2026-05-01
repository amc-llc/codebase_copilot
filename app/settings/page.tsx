import { redirect } from 'next/navigation';
import { SettingsPage } from '@/components/settings-page';
import { isSaaSMode } from '@/lib/config/app-mode';

export default function Page() {
  if (isSaaSMode()) {
    redirect('/auth/signin');
  }

  return <SettingsPage />;
}
