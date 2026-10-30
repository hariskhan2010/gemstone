import type { Metadata } from 'next';
import { ContactForm, CopyButton } from '@/components/gems/AuthForms';

export const metadata: Metadata = {
  title: 'Contact · Asian Gemstone',
  description: 'Questions about a stone, a custom carving, or an order? We typically reply within one business day.',
};

const EMAIL = 'asiangemstone@gmail.com', PHONE = '+92 (333) 911-6018';

export default function ContactPage() {
  return (
    <div className="ag-page-hero ag-view"><div className="ag-glow" />
      <div className="ag-contact-grid">
        <div>
          <p className="ag-eyebrow-l"><span className="ag-grad">We typically reply within one business day</span></p>
          <h1 className="ag-d">Contact<br />us</h1>
          <p className="ag-lede">Questions about a stone, a custom carving, or an order? Reach out and we&apos;ll reply as soon as we can.</p>
          <dl className="ag-clist">
            <div><dt>Email</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a><CopyButton text={EMAIL} label="email address" /></dd></div>
            <div><dt>Phone</dt><dd><a href="tel:+923339116018">{PHONE}</a><CopyButton text={PHONE} label="phone number" /></dd></div>
            <div><dt>Address</dt><dd>Gems Street, Namak Mandi, Peshawar, Khyber Pakhtunkhwa 25000, Pakistan</dd></div>
            <div><dt>Hours</dt><dd><span className="ag-hours"><span>Mon–Fri · 10:00 AM – 10:00 PM</span><span>Saturday · 10:30 AM – 11:00 PM</span><span>Sunday · 10:00 AM – 10:00 PM</span></span></dd></div>
          </dl>
          <p className="ag-small" style={{ maxWidth: '52ch', marginTop: 18 }}>For order status, include your order number in the subject. Custom carvings and rings are usually ready in 2 to 4 weeks.</p>
        </div>
        <div className="ag-form-card">
          <h2 className="ag-d" style={{ fontSize: 'clamp(30px,3vw,44px)' }}>Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
