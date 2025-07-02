/* eslint-disable @typescript-eslint/no-empty-object-type */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue, VariantProps } from 'tailwind-variants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import * as React from 'react';

/**
 * Recursively clones React children, adding additional props to components with matched display names.
 *
 * @param children - The node(s) to be cloned.
 * @param additionalProps - The props to add to the matched components.
 * @param displayNames - An array of display names to match components against.
 * @param uniqueId - A unique ID prefix from the parent component to generate stable keys.
 * @param asChild - Indicates whether the parent component uses the Slot component.
 *
 * @returns The cloned node(s) with the additional props applied to the matched components.
 */
export function recursiveCloneChildren(
  children: React.ReactNode,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalProps: any,
  displayNames: string[],
  uniqueId: string,
  asChild?: boolean,
): React.ReactNode | React.ReactNode[] {
  const mappedChildren = React.Children.map(
    children,
    (child: React.ReactNode, index) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const displayName =
        (child.type as React.ComponentType)?.displayName || '';
      const newProps = displayNames.includes(displayName)
        ? additionalProps
        : {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const childProps = (child as React.ReactElement<any>).props;

      return React.cloneElement(
        child,
        { ...newProps, key: `${uniqueId}-${index}` },
        recursiveCloneChildren(
          childProps?.children,
          additionalProps,
          displayNames,
          uniqueId,
          childProps?.asChild,
        ),
      );
    },
  );

  return asChild ? mappedChildren?.[0] : mappedChildren;
}

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P);

type PolymorphicComponentProp<
  T extends React.ElementType,
  Props = {},
> = React.PropsWithChildren<Props & AsProp<T>> &
  Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;

export type PolymorphicRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>['ref'];

type PolymorphicComponentPropWithRef<
  T extends React.ElementType,
  Props = {},
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> };

export type PolymorphicComponentPropsWithRef<
  T extends React.ElementType,
  P = {},
> = PolymorphicComponentPropWithRef<T, P>;

export type PolymorphicComponentProps<
  T extends React.ElementType,
  P = {},
> = PolymorphicComponentProp<T, P>;

export type PolymorphicComponent<P> = {
  <T extends React.ElementType>(
    props: PolymorphicComponentPropsWithRef<T, P>,
  ): React.ReactNode;
};

/**
 * Copies the provided text to the user's clipboard using the Clipboard API.
 *
 * @param text - The text string to copy to clipboard
 * @example
 * ```ts
 * copyToClipboard('192.168.1.1');
 * ```
 */
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

/**
 * Opens IP address details in a new browser tab using whatismyipaddress.com.
 * Provides geographical and network information about the IP address.
 *
 * @param ip - The IP address to lookup (IPv4 or IPv6)
 * @example
 * ```ts
 * openIPDetails('192.168.1.1');
 * ```
 */
export const openIPDetails = (ip: string) => {
  window.open(`https://whatismyipaddress.com/ip/${ip}`, '_blank');
};

/**
 * Returns appropriate TailwindCSS classes for styling based on ban count risk level.
 * Uses a color-coded system to indicate the severity of IP address bans:
 * - Red (destructive): 10+ bans (high risk)
 * - Yellow (warning): 3-9 bans (medium risk)
 * - Blue (primary): 1-2 bans (low risk)
 *
 * @param bans - Number of bans for the IP address
 * @returns TailwindCSS class string for background, text and border colors
 * @example
 * ```ts
 * getRiskColor(15); // Returns 'bg-destructive/10 text-destructive border-destructive/20'
 * getRiskColor(5);  // Returns 'bg-warning/10 text-warning border-warning/20'
 * getRiskColor(1);  // Returns 'bg-primary/10 text-primary border-primary/20'
 * ```
 */
export const getRiskColor = (bans: number) => {
  if (bans >= 10)
    return 'bg-destructive/10 text-destructive border-destructive/20';
  if (bans >= 3) return 'bg-warning/10 text-warning border-warning/20';
  return 'bg-primary/10 text-primary border-primary/20';
};
