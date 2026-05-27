import { fireEvent, render, screen } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';

import App from './App.vue';

describe('App', () => {
  it('renders the template heading', () => {
    render(App);
    expect(screen.getByRole('heading', { name: 'plinth Vue Template' })).toBeInTheDocument();
  });

  it('increments the counter on click', async () => {
    render(App);
    const button = screen.getByRole('button', { name: /count is 0/ });
    await fireEvent.click(button);
    expect(screen.getByRole('button', { name: /count is 1/ })).toBeInTheDocument();
  });
});
