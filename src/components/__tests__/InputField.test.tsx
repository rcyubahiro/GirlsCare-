import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import InputField from '../InputField';

describe('InputField', () => {
  it('renders label and input by id', () => {
    render(<InputField id="email" label="Email" type="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows validation error text', () => {
    render(<InputField id="password" label="Password" type="password" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
