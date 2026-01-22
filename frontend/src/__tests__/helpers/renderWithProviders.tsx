import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createTestQueryClient } from './createTestQueryClient';
import type { ReactNode } from 'react';

export function renderWithProviders(ui: ReactNode) {
  const client = createTestQueryClient();

  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}
