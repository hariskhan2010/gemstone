'use client';

import { useActionState, useState, useId } from 'react';
import Link from 'next/link';
import { signIn, signUp, requestPasswordReset, updatePassword, sendContact, type FormState } from '@/lib/auth/actions';
import { checkSignIn, checkSignUp, checkNewPassword, checkContact, hasErrors, passwordScore, EMAIL, type Errors } from '@/lib/auth/validate';

/* ---------- small pieces ---------- */
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="ag-field">
      <label htmlFor={id}>{label}</label>
      {children}
      <p className="ag-err" id={`${id}-e`} role={error ? 'alert' : undefined}>{error}</p>
    </div>
  );
}
const aria = (id: string, error?: string) => ({ 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-e` : undefined });

function Password({ id, name, autoComplete, error, onInput }: { id: string; name: string; autoComplete: string; error?: string; onInput?: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ag-pw">
      <input id={id} name={name} type={show ? 'text' : 'password'} autoComplete={autoComplete} required {...aria(id, error)} onInput={e => onInput?.((e.target as HTMLInputElement).value)} />
      <button type="button" aria-pressed={show} aria-controls={id} onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button>
    </div>
  );
}
function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return <button className="ag-btn ag-pri" type="submit" disabled={pending}>{pending ? 'Please wait…' : children}</button>;
}
function FormError({ state }: { state: FormState }) {
  return state?.error ? <p className="ag-alert ag-bad" role="alert">{state.error}</p> : null;
}
/** Instant browser-side check; the server action checks again. Moves focus to the first bad field. */
function useLocalCheck() {
  const [local, setLocal] = useState<Errors>({});
  const guard = (e: React.FormEvent<HTMLFormElement>, errs: Errors) => {
    setLocal(errs);
    if (hasErrors(errs)) {
      e.preventDefault();
      const first = Object.keys(errs).find(k => errs[k]);
      (e.currentTarget.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
    }
  };
  return { local, guard, clear: () => setLocal({}) };
}
const val = (f: HTMLFormElement, k: string) => String(new FormData(f).get(k) ?? '').trim();
const raw = (f: HTMLFormElement, k: string) => String(new FormData(f).get(k) ?? '');

/* ---------- sign in ---------- */
export function SignInForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState(signIn, null);
  const { local, guard } = useLocalCheck(); const u = useId();
  const err = { ...state?.fields, ...local };
  return (
    <>
      {notice && !state && <p className="ag-alert ag-good" role="status">{notice}</p>}
      <FormError state={state} />
      <form action={action} noValidate onSubmit={e => guard(e, checkSignIn(val(e.currentTarget, 'email'), raw(e.currentTarget, 'password')))}>
        {next && <input type="hidden" name="next" value={next} />}
        <Field id={`${u}e`} label="Email" error={err.email}><input id={`${u}e`} name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} {...aria(`${u}e`, err.email)} /></Field>
        <Field id={`${u}p`} label="Password" error={err.password}><Password id={`${u}p`} name="password" autoComplete="current-password" error={err.password} /></Field>
        <div className="ag-row"><span /><Link className="ag-alt" href="/redesign/forgot-password">Forgot password?</Link></div>
        <Submit pending={pending}>Sign in</Submit>
      </form>
      <p className="ag-alt">New here? <Link href="/redesign/sign-up">Create an account</Link></p>
    </>
  );
}

/* ---------- sign up ---------- */
export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, null);
  const { local, guard } = useLocalCheck(); const u = useId();
  const [score, setScore] = useState(0);
  const err = { ...state?.fields, ...local };
  if (state?.ok) return (
    <div className="ag-done" role="status">
      <h2 className="ag-d" style={{ fontSize: 40 }}>Check your email</h2>
      <p>We sent a confirmation link to <b>{state.values?.email}</b>. Open it to finish creating your account.</p>
      <p className="ag-alt">No email after a few minutes? Check spam, or <Link href="/redesign/sign-up">try again</Link>.</p>
    </div>
  );
  return (
    <>
      <FormError state={state} />
      <form action={action} noValidate onSubmit={e => { const f = e.currentTarget; guard(e, checkSignUp(val(f, 'name'), val(f, 'email'), raw(f, 'password'), raw(f, 'confirm'))); }}>
        <Field id={`${u}n`} label="Full name" error={err.name}><input id={`${u}n`} name="name" autoComplete="name" required maxLength={120} defaultValue={state?.values?.name} {...aria(`${u}n`, err.name)} /></Field>
        <Field id={`${u}e`} label="Email" error={err.email}><input id={`${u}e`} name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} {...aria(`${u}e`, err.email)} /></Field>
        <Field id={`${u}p`} label="Password" error={err.password}>
          <Password id={`${u}p`} name="password" autoComplete="new-password" error={err.password} onInput={v => setScore(passwordScore(v))} />
          <div className="ag-meter" aria-hidden="true"><i style={{ width: `${score / 5 * 100}%` }} /></div>
          <span className="ag-mono">8+ characters, with a letter and a number</span>
        </Field>
        <Field id={`${u}c`} label="Confirm password" error={err.confirm}><input id={`${u}c`} name="confirm" type="password" autoComplete="new-password" required {...aria(`${u}c`, err.confirm)} /></Field>
        <label className="ag-check"><input type="checkbox" name="news" /> Email me when new stones arrive</label>
        <Submit pending={pending}>Create account</Submit>
      </form>
      <p className="ag-alt">Already have an account? <Link href="/redesign/sign-in">Sign in</Link></p>
    </>
  );
}

/* ---------- forgot password ---------- */
export function ForgotForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  const { local, guard } = useLocalCheck(); const u = useId();
  const err = { ...state?.fields, ...local };
  if (state?.ok) return (
    <div className="ag-done" role="status">
      <h2 className="ag-d" style={{ fontSize: 40 }}>Check your email</h2>
      <p>If an account exists for <b>{state.values?.email}</b>, a reset link is on its way.</p>
      <p className="ag-alt"><Link href="/redesign/sign-in">Back to sign in</Link></p>
    </div>
  );
  return (
    <>
      <FormError state={state} />
      <form action={action} noValidate onSubmit={e => guard(e, EMAIL.test(val(e.currentTarget, 'email')) ? {} : { email: 'Enter the email you signed up with.' })}>
        <Field id={`${u}e`} label="Email" error={err.email}><input id={`${u}e`} name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} {...aria(`${u}e`, err.email)} /></Field>
        <Submit pending={pending}>Send reset link</Submit>
      </form>
      <p className="ag-alt"><Link href="/redesign/sign-in">Back to sign in</Link></p>
    </>
  );
}

/* ---------- choose a new password (after the email link) ---------- */
export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, null);
  const { local, guard } = useLocalCheck(); const u = useId();
  const [score, setScore] = useState(0);
  const err = { ...state?.fields, ...local };
  return (
    <>
      <FormError state={state} />
      <form action={action} noValidate onSubmit={e => guard(e, checkNewPassword(raw(e.currentTarget, 'password'), raw(e.currentTarget, 'confirm')))}>
        <Field id={`${u}p`} label="New password" error={err.password}>
          <Password id={`${u}p`} name="password" autoComplete="new-password" error={err.password} onInput={v => setScore(passwordScore(v))} />
          <div className="ag-meter" aria-hidden="true"><i style={{ width: `${score / 5 * 100}%` }} /></div>
        </Field>
        <Field id={`${u}c`} label="Confirm new password" error={err.confirm}><input id={`${u}c`} name="confirm" type="password" autoComplete="new-password" required {...aria(`${u}c`, err.confirm)} /></Field>
        <Submit pending={pending}>Save new password</Submit>
      </form>
    </>
  );
}

/* ---------- contact ---------- */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, null);
  const { local, guard } = useLocalCheck(); const u = useId();
  const [dismissed, setDismissed] = useState<FormState>(null);
  const err = { ...state?.fields, ...local };
  if (state?.ok && state !== dismissed) return (
    <div className="ag-done" role="status">
      <h2 className="ag-d" style={{ fontSize: 40 }}>Message sent</h2>
      <p>Thank you. We typically reply within one business day.</p>
      <button type="button" className="ag-btn" onClick={() => setDismissed(state)}>Write another</button>
    </div>
  );
  return (
    <>
      <FormError state={state} />
      <form action={action} noValidate onSubmit={e => { const f = e.currentTarget; guard(e, checkContact(val(f, 'name'), val(f, 'email'), val(f, 'subject'), val(f, 'message'))); }}>
        <div className="ag-hp" aria-hidden="true"><label htmlFor={`${u}w`}>Website</label><input id={`${u}w`} name="website" tabIndex={-1} autoComplete="off" /></div>
        <Field id={`${u}n`} label="Full name" error={err.name}><input id={`${u}n`} name="name" autoComplete="name" required maxLength={120} defaultValue={state?.ok ? '' : state?.values?.name} {...aria(`${u}n`, err.name)} /></Field>
        <Field id={`${u}e`} label="Email address" error={err.email}><input id={`${u}e`} name="email" type="email" autoComplete="email" required defaultValue={state?.ok ? '' : state?.values?.email} {...aria(`${u}e`, err.email)} /></Field>
        <Field id={`${u}s`} label="Subject" error={err.subject}><input id={`${u}s`} name="subject" required maxLength={160} defaultValue={state?.ok ? '' : state?.values?.subject} {...aria(`${u}s`, err.subject)} /></Field>
        <Field id={`${u}m`} label="Message" error={err.message}><textarea id={`${u}m`} name="message" required maxLength={4000} defaultValue={state?.ok ? '' : state?.values?.message} {...aria(`${u}m`, err.message)} /></Field>
        <Submit pending={pending}>Send Message</Submit>
      </form>
    </>
  );
}

/* ---------- copy button for contact details ---------- */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="ag-copy" aria-label={`Copy ${label}`} onClick={() => {
      navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1600); }).catch(() => undefined);
    }}>{done ? 'Copied' : 'Copy'}</button>
  );
}
