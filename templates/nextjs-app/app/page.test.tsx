import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from './page';

describe('HomePage', () => {
  it('renders the template heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'plinth Next.js Template' })).toBeInTheDocument();
  });
});
