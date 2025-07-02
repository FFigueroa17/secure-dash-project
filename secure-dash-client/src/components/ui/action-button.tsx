'use client';

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Check, LucideIcon } from 'lucide-react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import * as React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Props for the ActionButton component
 */
interface ActionButtonProps extends Omit<HTMLMotionProps<'button'>, 'onClick'> {
  /** The icon to display in the button */
  icon: LucideIcon;
  /** Function to execute when button is clicked */
  onAction: () => void | Promise<void>;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Custom tooltip message to display on hover */
  tooltipMessage: string;
  /** Position of the tooltip relative to the button */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Size of the icons in pixels */
  iconSize?: number;
  /** Duration to show the success state in milliseconds */
  successDuration?: number;
  /** Whether to show the success check animation */
  showSuccessAnimation?: boolean;
}

/**
 * A reusable action button component with animated icon transitions and tooltip feedback.
 *
 * Features:
 * - Executes custom action when clicked
 * - Shows animated transition from action icon to check icon
 * - Displays tooltip with customizable message
 * - Hover and tap animations for better UX
 * - Automatically resets after specified duration
 *
 * @example
 * ```tsx
 * <ActionButton
 *   icon={ExternalLink}
 *   onAction={() => window.open('https://example.com')}
 *   tooltipMessage="Open external link"
 *   showSuccessAnimation={true}
 * />
 * ```
 */
export function ActionButton({
  icon: Icon,
  onAction,
  className,
  tooltipMessage,
  tooltipSide = 'top',
  iconSize = 14,
  successDuration = 2000,
  showSuccessAnimation = true,
  ...props
}: ActionButtonProps) {
  // Track whether the action has been executed (for showing check icon)
  const [actionExecuted, setActionExecuted] = React.useState(false);
  // Track hover state for icon color changes
  const [isHovered, setIsHovered] = React.useState(false);

  /**
   * Handles the action execution
   * - Executes the provided action function
   * - Shows success state if enabled
   * - Resets state after specified duration
   */
  const handleAction = React.useCallback(async () => {
    await onAction();

    if (showSuccessAnimation) {
      setActionExecuted(true);
      // Reset executed state after specified duration
      setTimeout(() => setActionExecuted(false), successDuration);
    }
  }, [onAction, showSuccessAnimation, successDuration]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            type="button"
            className={cn(
              'h-8 w-8 p-0 rounded-sm transition-colors focus:outline-none',
              'hover:bg-accent hover:text-primary cursor-pointer flex items-center justify-center',
              className,
            )}
            onClick={handleAction}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            // Scale up slightly on hover for visual feedback
            whileHover={{ scale: 1.05 }}
            // Scale down on tap for tactile feedback
            whileTap={{ scale: 0.95 }}
            {...props}
          >
            {/* Animated icon transition between action and check states */}
            <AnimatePresence mode="wait" initial={false}>
              {actionExecuted && showSuccessAnimation ? (
                // Success state - show check icon
                <motion.div
                  key="check"
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check
                    className="text-primary size-4"
                    size={iconSize}
                    aria-hidden="true"
                  />
                </motion.div>
              ) : (
                // Default state - show action icon
                <motion.div
                  key="action"
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon
                    className={cn(
                      'text-muted-foreground transition-colors duration-200 size-4',
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
        {/* Tooltip shows different message based on action state */}
        <TooltipContent side={tooltipSide}>
          {actionExecuted && showSuccessAnimation ? 'Done!' : tooltipMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
