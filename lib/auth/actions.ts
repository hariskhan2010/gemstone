'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { checkSignIn, checkSignUp, checkNewPassword, checkContact, hasErrors, EMAIL, type Errors } from './validate';

export type FormState = {
  ok?: boolean;
  /** message for the whole form */
  error?: string;
  /** messages per field */
  fields?: Errors;
  /** values to put back in the form after a failed submit (never passwords) */
  values?: Record<string, string>;
} | null;

/** Shown when the Supabase env vars are missing (see REDESIGN_README.md). */
const NOT_SET_UP = 'Accounts are not available yet. Please check back soon.';
const UNAVAILABLE = 'Accounts are unavailable right now. Please try again in a moment.';
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();

async function siteOrigin() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  return h.get('origin') ?? `${h.get('x-forwarded-proto') ?? 'https'}://${host}`;
}
/** Only redirect inside the redesign, never to another site. */
function safeNext(v: string) {
  return v.startsWith('/redesign/') && !v.startsWith('//') && !v.includes('\\') ? v : '/redesign/account';
}

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, 'email'), password = String(fd.get('password') ?? ''), values = { email };
  const fields = checkSignIn(email, password);
  if (hasErrors(fields)) return { fields, values };
  const supabase = await createClient();
  if (!supabase) return { error: NOT_SET_UP, values };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === 'email_not_confirmed') return { error: 'Confirm your email first: open the link we sent you.', values };
    if (error.status === 429) return { error: 'Too many attempts. Wait a few minutes and try again.', values };
    if (error.code === 'invalid_credentials' || error.status === 400) return { error: 'Email or password is incorrect.', values };
    return { error: UNAVAILABLE, values };
  }
  redirect(safeNext(str(fd, 'next')));
}

export async function signUp(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, 'name'), email = str(fd, 'email'), password = String(fd.get('password') ?? ''), confirm = String(fd.get('confirm') ?? '');
  const news = fd.get('news') === 'on', values = { name, email };
  const fields = checkSignUp(name, email, password, confirm);
  if (hasErrors(fields)) return { fields, values };
  const supabase = await createClient();
  if (!supabase) return { error: NOT_SET_UP, values };
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name, marketing_opt_in: news }, emailRedirectTo: `${await siteOrigin()}/redesign/auth/confirm?next=/redesign/account` },
  });
  if (error) {
    if (error.code === 'weak_password') return { fields: { password: 'Choose a stronger password.' }, values };
    if (error.status === 429) return { error: 'Too many attempts. Wait a few minutes and try again.', values };
    if (!error.status || error.status >= 500) return { error: UNAVAILABLE, values };
    return { error: 'We could not create the account. Please check your details and try again.', values };
  }
  // Email confirmation off in Supabase: the user is signed in straight away.
  if (data.session) redirect('/redesign/account');
  // Email confirmation on (the default). Supabase answers the same way for an address that already has an account, so nobody can probe which emails exist.
  return { ok: true, values: { email } };
}

export async function requestPasswordReset(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, 'email'), values = { email };
  if (!EMAIL.test(email)) return { fields: { email: 'Enter the email you signed up with.' }, values };
  const supabase = await createClient();
  if (!supabase) return { error: NOT_SET_UP, values };
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${await siteOrigin()}/redesign/auth/confirm?next=/redesign/reset-password` });
  if (error?.status === 429) return { error: 'Too many attempts. Wait a few minutes and try again.', values };
  // Same answer whether or not the account exists.
  return { ok: true, values };
}

export async function updatePassword(_: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get('password') ?? ''), confirm = String(fd.get('confirm') ?? '');
  const fields = checkNewPassword(password, confirm);
  if (hasErrors(fields)) return { fields };
  const supabase = await createClient();
  if (!supabase) return { error: NOT_SET_UP };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === 'same_password') return { fields: { password: 'Choose a password you have not used here before.' } };
    if (error.code === 'weak_password') return { fields: { password: 'Choose a stronger password.' } };
    return { error: 'Your reset link has expired. Request a new one.' };
  }
  redirect('/redesign/account?updated=1');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect('/redesign/sign-in?signed_out=1');
}

export async function sendContact(_: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: real people never see or fill this field.
  if (str(fd, 'website')) return { ok: true };
  const name = str(fd, 'name'), email = str(fd, 'email'), subject = str(fd, 'subject'), message = str(fd, 'message');
  const values = { name, email, subject, message };
  const fields = checkContact(name, email, subject, message);
  if (hasErrors(fields)) return { fields, values };
  const supabase = await createClient();
  if (!supabase) return { error: 'The contact inbox is not connected yet. Please email asiangemstone@gmail.com.', values };
  const { error } = await supabase.from('contact_messages').insert({ name, email, subject, message });
  if (error) return { error: 'We could not send your message. Please try again or email asiangemstone@gmail.com.', values };
  return { ok: true };
}

/** "Continue with Google". Needs the Google provider switched on in Supabase (see REDESIGN_README.md). */
export async function signInWithGoogle(fd: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect('/redesign/sign-in?error=setup');
  const next = safeNext(str(fd, 'next'));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${await siteOrigin()}/redesign/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect('/redesign/sign-in?error=google');
  redirect(data.url);
}
