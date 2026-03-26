import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Button from '../Button';

describe('Button', () => {
  it('renders button content', () => {
    render(<Button>Get Started</Button>);
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('applies secondary variant style class', () => {
    render(<Button variant="secondary">Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveClass('bg-secondary');
  });

  it('applies full width class when enabled', () => {
    render(<Button fullWidth>Continue</Button>);
    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button).toHaveClass('w-full');
  });
});
