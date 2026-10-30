import type { Metadata } from 'next';
import AuthShell from '@/components/gems/AuthShell';
import { ForgotForm } from '@/components/gems/AuthForms';

export const metadata: Metadata = { title: 'Forgot password · Asian Gemstone', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password" tag={<>Reset<br /><span className="ag-grad">your password.</span></>}>
      <ForgotForm />
    </AuthShell>
  );
}
