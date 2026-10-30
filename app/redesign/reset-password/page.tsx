import type { Metadata } from 'next';
import AuthShell from '@/components/gems/AuthShell';
import { NewPasswordForm } from '@/components/gems/AuthForms';

export const metadata: Metadata = { title: 'Choose a new password · Asian Gemstone', robots: { index: false } };

/** Reached from the reset email (via /redesign/auth/confirm). proxy.ts sends visitors without a session to sign in. */
export default function ResetPasswordPage() {
  return (
    <AuthShell title="New password" tag={<>Choose a<br /><span className="ag-grad">new password.</span></>}>
      <NewPasswordForm />
    </AuthShell>
  );
}
