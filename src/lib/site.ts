/** Single source of truth for brand facts, navigation and route paths. */

function profileUrl(value: string | undefined) {
  const url = value?.trim();
  return url && /^https:\/\/\S+$/.test(url) ? url : undefined;
}

export const site = {
  name: "PickASparky",
  legalName: "PickASparky",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  tagline: "Find trusted EV charger installers across the UK.",
  description:
    "Compare up to 5 free quotes from vetted, local EV charger installers. Enter your postcode and PickASparky connects you with qualified electricians in your area.",
  locale: "en_GB",
  email: "hello@pickasparky.co.uk",
  privacyEmail: "privacy@pickasparky.co.uk",
  hours: { days: "Monday – Friday", time: "9:00am – 5:00pm (UK time)" },
  social: {
    x: profileUrl(process.env.NEXT_PUBLIC_SOCIAL_X_URL),
    linkedin: profileUrl(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL),
  },
} as const;

export const routes = {
  home: "/",
  quotes: "/get-quotes",
  howItWorks: "/how-it-works",
  howItWorksInstallers: "/how-it-works#for-electricians",
  faq: "/faq",
  faqInstallers: "/faq#for-electricians",
  accreditations: "/electrician-accreditations",
  safety: "/electrical-safety-regulations",
  vetting: "/how-we-vet-installers",
  about: "/about",
  contact: "/contact",
  join: "/join",
  register: "/join/register",
  login: "/installer/login",
  forgotPassword: "/installer/forgot-password",
  account: "/installer/account",
  installers: "/ev-charger-installers",
  privacy: "/privacy-policy",
  terms: "/terms-and-conditions",
  cookies: "/cookie-policy",
} as const;

export const locationPath = (locationSlug: string) =>
  `${routes.installers}/${locationSlug}`;

export const installerPath = (locationSlug: string, installerSlug: string) =>
  `${routes.installers}/${locationSlug}/${installerSlug}`;

export type NavLink = { label: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };

/** Shared by the header menu and the footer so they never drift apart. */
export const navigation: NavGroup[] = [
  {
    title: "For Homeowners",
    links: [
      { label: "Get Quotes", href: routes.quotes },
      { label: "How It Works", href: routes.howItWorks },
      { label: "FAQ", href: routes.faq },
      { label: "Electrician Accreditations", href: routes.accreditations },
      { label: "Electrical Safety & Regulations", href: routes.safety },
    ],
  },
  {
    title: "For Installers",
    links: [
      { label: "Join as an Installer", href: routes.join },
      { label: "How It Works", href: routes.howItWorksInstallers },
      { label: "Installer FAQ", href: routes.faqInstallers },
      { label: "Installer Login", href: routes.login },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About PickASparky", href: routes.about },
      { label: "Contact Us", href: routes.contact },
      { label: "How We Vet Installers", href: routes.vetting },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: routes.privacy },
  { label: "Terms & Conditions", href: routes.terms },
  { label: "Cookie Policy", href: routes.cookies },
];
