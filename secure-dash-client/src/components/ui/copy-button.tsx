'use client';

import { Check, Copy } from 'lucide-react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CopyButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'value' | 'onClick'> {
  value: string;
  onCopied?: () => void;
  className?: string;
  tooltipMessage?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  iconSize?: number;
}

export function CopyButton({
  value,
  onCopied,
  className,
  tooltipMessage = 'Copy to clipboard',
  tooltipSide = 'top',
  iconSize = 14,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), 2000);
  }, [value, onCopied]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          className={cn(
            'rounded-sm transition-colors focus:outline-none',
            'hover:text-primary cursor-pointer',
            className,
          )}
          onClick={handleCopy}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Check
                  className="text-primary"
                  size={iconSize}
                  aria-hidden="true"
                />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.15 }}
              >
                <Copy
                  className={cn(
                    'text-muted-foreground',
                    isHovered && 'text-primary',
                  )}
                  size={iconSize}
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        {copied ? 'Copied!' : tooltipMessage}
      </TooltipContent>
    </Tooltip>
  );
}
