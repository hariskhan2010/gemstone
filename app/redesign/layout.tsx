import type { Metadata } from 'next';
import Link from 'next/link';
import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import RedesignNav from '@/components/gems/RedesignNav';
import { CONTACT_URL } from '@/lib/gems/stones';
import '@/components/gems/gems.css';

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--ag-archivo', display: 'swap' });
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ag-plex', display: 'swap' });

export const metadata: Metadata = {
  title: 'Asian Gemstone · Timeless beauty from earth',
  description: '100% natural gemstones, hand-selected from Asian mines: emerald, ruby, sapphire, aquamarine, topaz, tourmaline and amethyst, rings made to order and stones carved by hand.',
};

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ag-root ${archivo.variable} ${plex.variable}`}>
      <RedesignNav />
      <main>{children}</main>
      <footer className="ag-footer">
        <div className="ag-ft">
          <div>
            <h3>Timeless beauty<br /><span className="ag-grad">from earth</span></h3>
            <p className="ag-small">Founded in 2003. Sourced, graded, cut and set by people we know by name.</p>
          </div>
          <div>
            <span className="ag-mono">Shop</span>
            <ul>
              <li><Link href="/redesign/collection">Collection</Link></li>
              <li><Link href="/redesign/stone/emerald">Emerald</Link></li>
              <li><Link href="/redesign/stone/rings">Gemstone rings</Link></li>
              <li><Link href="/redesign/stone/carved">Custom engraved stone</Link></li>
            </ul>
          </div>
          <div>
            <span className="ag-mono">Company</span>
            <ul>
              <li><Link href="/redesign/about">About</Link></li>
              <li><Link href="/redesign/blog">Blog</Link></li>
              <li><Link href={CONTACT_URL}>Contact Us</Link></li>
              <li><Link href="/redesign/sign-in">Sign in</Link> · <Link href="/redesign/sign-up">Create account</Link></li>
              <li><Link href="/blog/natural-gemstones-vs-synthetic">Natural vs synthetic guide</Link></li>
            </ul>
          </div>
        </div>
        <div className="ag-legal"><span>© 2026 Asian Gemstone. All rights reserved.</span><span>Stones shown are 3D renders.</span></div>
      </footer>
    </div>
  );
}
