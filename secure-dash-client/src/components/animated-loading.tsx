'use client';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

interface AnimatedLoadingProps {
  isLoading?: boolean;
  className?: string;
}

const AnimatedLoading = ({
  isLoading = false,
  className,
}: AnimatedLoadingProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed top-4 left-1/2 -translate-x-1/2 z-50 h-2.5 w-full max-w-[300px] bg-border rounded-full overflow-hidden shadow-xl',
            className,
          )}
          style={{ transformOrigin: 'left' }}
          role="status"
          aria-label="Loading..."
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--primary-foreground), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedLoading;
