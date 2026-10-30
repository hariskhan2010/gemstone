/** Shared rules, used in the browser for instant feedback and again on the server, which is the one that counts. */
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export type Errors = Partial<Record<string, string>>;

export function checkSignIn(email: string, password: string): Errors {
  const e: Errors = {};
  if (!EMAIL.test(email)) e.email = 'Enter the email you signed up with.';
  if (!password) e.password = 'Enter your password.';
  return e;
}
export function passwordProblem(pw: string) {
  return pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw) ? 'Use 8 or more characters with at least one letter and one number.' : '';
}
export function checkSignUp(name: string, email: string, password: string, confirm: string): Errors {
  const e: Errors = {};
  if (name.length < 2 || name.length > 120) e.name = 'Enter your full name.';
  if (!EMAIL.test(email)) e.email = 'Enter a valid email address.';
  const p = passwordProblem(password); if (p) e.password = p;
  if (!password || confirm !== password) e.confirm = 'Passwords do not match.';
  return e;
}
export function checkNewPassword(password: string, confirm: string): Errors {
  const e: Errors = {};
  const p = passwordProblem(password); if (p) e.password = p;
  if (!password || confirm !== password) e.confirm = 'Passwords do not match.';
  return e;
}
export function checkContact(name: string, email: string, subject: string, message: string): Errors {
  const e: Errors = {};
  if (name.length < 2 || name.length > 120) e.name = 'Enter your full name.';
  if (!EMAIL.test(email) || email.length > 254) e.email = 'Enter a valid email address.';
  if (!subject || subject.length > 160) e.subject = 'Add a subject (include your order number for order questions).';
  if (message.length < 10) e.message = 'Write a few more words so we can help.';
  else if (message.length > 4000) e.message = 'Keep the message under 4,000 characters.';
  return e;
}
export function passwordScore(v: string) {
  let n = 0; if (v.length >= 8) n++; if (v.length >= 12) n++; if (/[a-z]/.test(v) && /[A-Z]/.test(v)) n++; if (/\d/.test(v)) n++; if (/[^A-Za-z0-9]/.test(v)) n++; return n;
}
export const hasErrors = (e: Errors) => Object.values(e).some(Boolean);
