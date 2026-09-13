import { Plus_Jakarta_Sans, Inter, Outfit, Poppins, Montserrat, DM_Sans, Manrope, Nunito, Space_Grotesk, Sora, Syne, Bebas_Neue, Oswald, Playfair_Display, Lora, Fraunces } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ variable: '--font-plus-jakarta', subsets: ['latin'], preload: false });
const inter = Inter({ variable: '--font-inter', subsets: ['latin'], preload: false });
const outfit = Outfit({ variable: '--font-outfit', subsets: ['latin'], preload: false });
const poppins = Poppins({ variable: '--font-poppins', subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], preload: false });
const montserrat = Montserrat({ variable: '--font-montserrat', subsets: ['latin'], preload: false });
const dm = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'], preload: false });
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], preload: false });
const nunito = Nunito({ variable: '--font-nunito', subsets: ['latin'], preload: false });
const space = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'], preload: false });
const sora = Sora({ variable: '--font-sora', subsets: ['latin'], preload: false });
const syne = Syne({ variable: '--font-syne', subsets: ['latin'], preload: false });
const bebas = Bebas_Neue({ variable: '--font-bebas-neue', subsets: ['latin'], weight: '400', preload: false });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], preload: false });
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], preload: false });
const lora = Lora({ variable: '--font-lora', subsets: ['latin'], preload: false });
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], preload: false });

export const editorFontVariables = [jakarta, inter, outfit, poppins, montserrat, dm, manrope, nunito, space, sora, syne, bebas, oswald, playfair, lora, fraunces].map(font => font.variable).join(' ');
