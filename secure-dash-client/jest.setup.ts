import '@testing-library/jest-dom';

import type { ComponentProps } from 'react';
import React, { createElement } from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ComponentProps<'img'>) => {
    return createElement('img', props);
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Radix UI Slot to prevent asChild prop warnings
jest.mock('@radix-ui/react-slot', () => {
  const MockSlot = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  >(({ asChild, children, ...props }, ref) => {
    // Remove asChild from props to prevent DOM warnings
    const cleanProps = { ...props };
    delete (cleanProps as Record<string, unknown>).asChild;

    return createElement('div', { ...cleanProps, ref }, children);
  });

  MockSlot.displayName = 'MockSlot';

  const MockSlottable = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(React.Fragment, null, children);
  };

  const createSlot = () => MockSlot;

  const createSlottable = (name: string) => {
    const Component = ({ children }: { children: React.ReactNode }) => {
      return React.createElement(React.Fragment, null, children);
    };
    Component.displayName = `MockSlottable(${name})`;
    return Component;
  };

  return {
    Slot: MockSlot,
    Slottable: MockSlottable,
    createSlot,
    createSlottable,
  };
});

// Suppress console errors during tests (optional)
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || '');

    // More comprehensive asChild filtering
    const shouldFilter =
      message.includes('asChild') ||
      message.includes('aschild') ||
      message.includes('as-child') ||
      message.includes('React does not recognize') ||
      message.includes('Warning: ReactDOM.render is no longer supported') ||
      message.includes('Warning: Function components cannot be given refs') ||
      message.includes(
        'Warning: forwardRef render functions accept exactly two parameters',
      ) ||
      message.includes('Warning: React.forwardRef') ||
      /React does not recognize the [`'"]asChild[`'"] prop/i.test(message) ||
      /React does not recognize the [`'"]aschild[`'"] prop/i.test(message);

    if (shouldFilter) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || '');

    const shouldFilter =
      message.includes('asChild') ||
      message.includes('aschild') ||
      message.includes('as-child') ||
      message.includes('React does not recognize') ||
      /React does not recognize the [`'"]asChild[`'"] prop/i.test(message) ||
      /React does not recognize the [`'"]aschild[`'"] prop/i.test(message);

    if (shouldFilter) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
