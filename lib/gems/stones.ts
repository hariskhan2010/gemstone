/**
 * Stone categories shown in the redesign. Copy comes from asiangemstone.vercel.app;
 * gem data (Mohs, RI, SG, crystal system, birthstone) is standard gemology.
 * When real listings exist, pass them to the pages as products and keep these as category pages.
 */
export type StoneCategory = 'gemstone' | 'jewelry' | 'carved';
export type ModelKey = 'ruby' | 'sapphire' | 'emerald' | 'aquamarine' | 'topaz-tourmaline' | 'amethyst' | 'rings' | 'carved';

export interface StoneInfo {
  id: ModelKey;
  cat: StoneCategory;
  name: string;
  family: string;
  /** "r,g,b" wash colour used behind the render */
  wash: string;
  desc: string;
  origin?: string;
  spec: [string, string][];
  note?: string;
}

export const LIVE = 'https://asiangemstone.vercel.app';
/** Internal route on the store; change if your contact page lives elsewhere. */
export const CONTACT_URL = '/redesign/contact';
export const CATNAME: Record<StoneCategory, string> = { gemstone: 'Gemstones', jewelry: 'Jewelry', carved: 'Carved stone' };
export const CERT_NOTE = 'Each stone ships with details on origin, carat, and treatment. Independent gemological certificates (GIA/IGI) are available on request for an additional fee.';

export const STONES: StoneInfo[] = [
  { id: 'ruby', cat: 'gemstone', name: 'Ruby', family: 'Corundum', wash: '255,70,110', desc: 'Vivid red corundum, one of the classic precious gemstones.',
    spec: [['Mohs', '9'], ['Refractive index', '1.762–1.770'], ['Specific gravity', '4.00'], ['Crystal system', 'Trigonal'], ['Birthstone', 'July'], ['Shown as', 'Oval, brilliant cut']] },
  { id: 'sapphire', cat: 'gemstone', name: 'Sapphire', family: 'Corundum', wash: '70,100,255', desc: 'Rich blue and fancy-colored sapphires with excellent cut.',
    spec: [['Mohs', '9'], ['Refractive index', '1.762–1.770'], ['Specific gravity', '4.00'], ['Crystal system', 'Trigonal'], ['Birthstone', 'September'], ['Shown as', 'Round brilliant']] },
  { id: 'emerald', cat: 'gemstone', name: 'Emerald', family: 'Beryl', wash: '20,190,130', desc: 'Deep green stones from Swat and trusted mines, prized worldwide for color and clarity.', origin: 'Swat, Pakistan',
    spec: [['Mohs', '7.5–8'], ['Refractive index', '1.565–1.602'], ['Specific gravity', '2.72'], ['Crystal system', 'Hexagonal'], ['Birthstone', 'May'], ['Shown as', 'Emerald cut']] },
  { id: 'aquamarine', cat: 'gemstone', name: 'Aquamarine', family: 'Beryl', wash: '60,190,220', desc: 'Clear blue-green stones from the Gilgit and Karakoram region.', origin: 'Gilgit and Karakoram',
    spec: [['Mohs', '7.5–8'], ['Refractive index', '1.567–1.590'], ['Specific gravity', '2.72'], ['Crystal system', 'Hexagonal'], ['Birthstone', 'March'], ['Shown as', 'Emerald cut']] },
  { id: 'topaz-tourmaline', cat: 'gemstone', name: 'Topaz & Tourmaline', family: 'Topaz · Tourmaline', wash: '255,150,80', desc: 'Colorful semi-precious stones for everyday jewelry.',
    spec: [['Mohs', '8 · 7–7.5'], ['Refractive index', '1.609–1.643 · 1.62–1.64'], ['Specific gravity', '3.53 · 3.06'], ['Crystal system', 'Orthorhombic · Trigonal'], ['Birthstone', 'November · October'], ['Shown as', 'Oval topaz, emerald-cut tourmaline']] },
  { id: 'amethyst', cat: 'gemstone', name: 'Amethyst', family: 'Quartz', wash: '160,90,255', desc: 'Purple quartz prized for its deep, even color.',
    spec: [['Mohs', '7'], ['Refractive index', '1.544–1.553'], ['Specific gravity', '2.65'], ['Crystal system', 'Trigonal'], ['Birthstone', 'February'], ['Shown as', 'Cushion brilliant']] },
  { id: 'rings', cat: 'jewelry', name: 'Handmade gemstone jewelry', family: 'Rings · Pendants · Bracelets', wash: '240,180,90', desc: 'Rings, pendants, and bracelets, set by hand in silver, gold, and brass.',
    spec: [['Metals', 'Silver · Gold · Brass'], ['Made', 'To order, in your exact size'], ['For', 'Men and women'], ['Stones', 'Natural only']],
    note: 'Handmade natural stone rings for men and women, made to order in your exact size.' },
  { id: 'carved', cat: 'carved', name: 'Custom engraved stone', family: 'Carved by hand', wash: '60,170,120', desc: 'Custom carvings and personalized messages, cut into natural stone.',
    spec: [['Engraving', 'Name, date, coordinate or symbol'], ['Lead time', '2 to 4 weeks'], ['Made', 'By hand'], ['Gift', 'One of a kind']],
    note: 'A natural stone with a name, date, coordinate, or symbol carved by hand by our artisans. It makes a one-of-a-kind personalized gift.' },
];

export const stoneById = (id: string) => STONES.find(s => s.id === id);
export const thumbSrc = (id: ModelKey) => `/gems/thumbs/${id}.webp`;
