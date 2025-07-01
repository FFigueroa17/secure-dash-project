'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { parseAsStringEnum, useQueryState } from 'nuqs';

import { HERO_IMAGE_URL } from '@/app/_lib/consts';
import { testimonials } from '@/app/_lib/consts';

import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex items-start gap-3 rounded-3xl bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64">
    <Image
      src={testimonial.avatarSrc}
      width={40}
      height={40}
      className="h-10 w-10 object-cover rounded-2xl"
      alt="avatar"
    />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

// Animation variants
const formVariants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.95,
  },
};

export function AuthPage() {
  const [mode, setMode] = useQueryState<'login' | 'register'>(
    'mode',
    parseAsStringEnum<'login' | 'register'>(['login', 'register']).withDefault(
      'login',
    ),
  );

  const switchToRegister = () => setMode('register');
  const switchToLogin = () => setMode('login');

  return (
    <section className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      {/* Left column: auth forms */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <LoginForm onSwitchToRegister={switchToRegister} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <RegisterForm onSwitchToLogin={switchToLogin} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      <motion.section
        className="hidden lg:block flex-1 relative p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className="absolute inset-4 rounded-3xl bg-cover bg-center brightness-75 contrast-125"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
          <TestimonialCard testimonial={testimonials[0]!} />
          <TestimonialCard testimonial={testimonials[1]!} />
          <TestimonialCard testimonial={testimonials[2]!} />
        </div>
      </motion.section>
    </section>
  );
}
