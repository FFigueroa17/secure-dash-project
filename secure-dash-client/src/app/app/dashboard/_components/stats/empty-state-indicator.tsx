'use client';

import { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface EmptyStateIndicatorProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isLoading?: boolean;
  className?: string;
}

export function EmptyStateIndicator({
  icon: Icon,
  title,
  description,
  isLoading = false,
  className = '',
}: EmptyStateIndicatorProps) {
  const pulseVariants = {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
  };

  const floatingVariants = {
    y: [0, -8, 0],
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      <Card className="h-full bg-gradient-to-br from-background to-muted/20 border-dashed border-2 border-muted-foreground/20 overflow-hidden">
        <CardContent className="h-full flex flex-col items-center justify-center p-8 relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center space-y-4"
                >
                  {/* Loading icon with pulse animation */}
                  <motion.div
                    className="relative"
                    animate={floatingVariants}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <motion.div
                      className="p-4 rounded-full bg-primary/10 backdrop-blur-sm"
                      animate={pulseVariants}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </motion.div>

                    {/* Spinning ring around icon */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/30"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>

                  {/* Loading text skeletons */}
                  <div className="space-y-3 w-full max-w-sm">
                    <Skeleton className="h-6 w-3/4 mx-auto bg-muted-foreground/10" />
                    <Skeleton className="h-4 w-full bg-muted-foreground/5" />
                    <Skeleton className="h-4 w-2/3 mx-auto bg-muted-foreground/5" />
                  </div>

                  {/* Loading dots */}
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary/40 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex flex-col items-center space-y-6"
                >
                  {/* Empty state icon */}
                  <motion.div
                    className="relative"
                    animate={floatingVariants}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <motion.div
                      className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 backdrop-blur-sm shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Icon className="h-12 w-12 text-muted-foreground/70" />
                    </motion.div>
                  </motion.div>

                  {/* Empty state text */}
                  <motion.div
                    className="space-y-3 text-center max-w-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <h3 className="text-xl font-semibold text-muted-foreground">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed">
                      {description}
                    </p>
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    className="flex space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-muted-foreground/20 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
