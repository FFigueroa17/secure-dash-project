import { render, screen } from '@testing-library/react';

import AnimatedLoading from '@/components/animated-loading';

// Mock framer-motion
jest.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  motion: {
    div: ({ children, className, ...props }: React.ComponentProps<'div'>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('AnimatedLoading', () => {
  it('renders nothing when not loading', () => {
    const { container } = render(<AnimatedLoading isLoading={false} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders loading component when isLoading is true', () => {
    render(<AnimatedLoading isLoading={true} />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
  });

  it('applies default loading state when no prop provided', () => {
    const { container } = render(<AnimatedLoading />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('applies custom className', () => {
    render(<AnimatedLoading isLoading={true} className="custom-class" />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass('custom-class');
  });

  it('has correct default styling classes', () => {
    render(<AnimatedLoading isLoading={true} />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveClass(
      'fixed',
      'top-4',
      'left-1/2',
      '-translate-x-1/2',
      'z-50',
    );
  });

  it('contains shimmer effect elements', () => {
    render(<AnimatedLoading isLoading={true} />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();

    // Check that it contains child elements (shimmer effects)
    expect(loadingElement.children.length).toBeGreaterThan(0);
  });

  it('includes accessibility attributes', () => {
    render(<AnimatedLoading isLoading={true} />);

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveAttribute('aria-label', 'Loading...');
  });
});
