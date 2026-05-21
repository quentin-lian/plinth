import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function Hello({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

describe('test-config smoke', () => {
  it('renders a React component with jest-dom matchers', () => {
    render(<Hello name="bitfe" />);
    expect(screen.getByRole('heading', { name: 'Hello, bitfe' })).toBeInTheDocument();
  });
});
