import type { Metadata } from 'next';
import AuthShell from '@/components/gems/AuthShell';
import { SignInForm } from '@/components/gems/AuthForms';
import GoogleButton from '@/components/gems/GoogleButton';

export const metadata: Metadata = { title: 'Sign in · Asian Gemstone', robots: { index: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const notice = one('signed_out') ? 'You are signed out.' : one('error') === 'link' ? 'That link has expired or was already used. Sign in, or request a new link.'
    : one('error') === 'google' ? 'Google sign-in did not finish. Please try again.' : undefined;
  return (
    <AuthShell title="Sign in" tag={<>Welcome<br /><span className="ag-grad">back.</span></>}>
      <GoogleButton next={one('next')} />
      <SignInForm next={one('next')} notice={notice} />
    </AuthShell>
  );
}
