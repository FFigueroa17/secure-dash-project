'use client';

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Check, Copy } from 'lucide-react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Props for the CopyButton component
 */
interface CopyButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'value' | 'onClick'> {
  /** The text value to copy to clipboard */
  value: string;
  /** Callback function called after successful copy */
  onCopied?: () => void;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Custom tooltip message to display on hover */
  tooltipMessage?: string;
  /** Position of the tooltip relative to the button */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Size of the copy/check icons in pixels */
  iconSize?: number;
}

/**
 * A copy-to-clipboard button component with animated icon transitions and tooltip feedback.
 *
 * Features:
 * - Copies text to clipboard when clicked
 * - Shows animated transition from copy icon to check icon
 * - Displays tooltip with customizable message
 * - Hover and tap animations for better UX
 * - Automatically resets after 2 seconds
 *
 * @example
 * ```tsx
 * <CopyButton
 *   value="Hello World"
 *   tooltipMessage="Copy greeting"
 *   onCopied={() => console.log('Copied!')}
 * />
 * ```
 */
export function CopyButton({
  value,
  onCopied,
  className,
  tooltipMessage = 'Copy to clipboard',
  tooltipSide = 'top',
  iconSize = 14,
  ...props
}: CopyButtonProps) {
  // Track whether the text has been copied (for showing check icon)
  const [copied, setCopied] = React.useState(false);
  // Track hover state for icon color changes
  const [isHovered, setIsHovered] = React.useState(false);

  /**
   * Handles the copy operation
   * - Writes text to clipboard
   * - Shows success state
   * - Calls onCopied callback
   * - Resets state after 2 seconds
   */
  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopied?.();
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }, [value, onCopied]);

  return (
    <TooltipProvider>
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
            // Scale up slightly on hover for visual feedback
            whileHover={{ scale: 1.1 }}
            // Scale down on tap for tactile feedback
            whileTap={{ scale: 0.95 }}
            {...props}
          >
            {/* Animated icon transition between copy and check states */}
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                // Success state - show check icon
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
                // Default state - show copy icon
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
        {/* Tooltip shows different message based on copied state */}
        <TooltipContent side={tooltipSide}>
          {copied ? 'Copied!' : tooltipMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
