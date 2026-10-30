import type { Metadata } from 'next';
import AuthShell from '@/components/gems/AuthShell';
import { SignUpForm } from '@/components/gems/AuthForms';
import GoogleButton from '@/components/gems/GoogleButton';

export const metadata: Metadata = { title: 'Create account · Asian Gemstone', robots: { index: false } };

export default function SignUpPage() {
  return (
    <AuthShell title="Create account" tag={<>Every piece starts<br /><span className="ag-grad">as a rough stone.</span></>}>
      <GoogleButton />
      <SignUpForm />
    </AuthShell>
  );
}
