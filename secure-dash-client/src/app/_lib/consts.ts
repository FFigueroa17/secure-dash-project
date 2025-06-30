import { Testimonial } from '@/app/_components/auth-page';

// Sample testimonials data
export const testimonials: Testimonial[] = [
  {
    avatarSrc: 'https://randomuser.me/api/portraits/women/57.jpg',
    name: 'Sarah Chen',
    handle: '@sarahsecurity',
    text: 'Secure Dash revolutionized our server monitoring! Real-time Fail2ban log analysis helps us stay ahead of threats.',
  },
  {
    avatarSrc: 'https://randomuser.me/api/portraits/men/64.jpg',
    name: 'Marcus Johnson',
    handle: '@marcussysadmin',
    text: 'The interactive dashboard makes monitoring logs effortless. Clear visualizations and alerts are game-changers.',
  },
  {
    avatarSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'David Martinez',
    handle: '@daviddevops',
    text: "Best Fail2ban monitoring solution I've used. Secure Dash provides deep insights into attack patterns and server protection status.",
  },
] as const;

// Hero image from Unsplash
export const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' as const;
