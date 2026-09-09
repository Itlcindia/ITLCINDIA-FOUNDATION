
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/foundation-backend/api'
    : 'http://localhost/foundation-backend/api');

export type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services', label: 'All Services' },
      { href: '/social-welfare', label: 'Social Welfare' },
      { href: '/paryavaran-sanrakshan', label: 'Paryavaran Sanrakshan' },
      { href: '/animal-welfare', label: 'Animal Welfare' },
    ],
  },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Insides' },
  { href: '/contact', label: 'Contact' },
];
