import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount any rendered components after each test so one test's DOM can't
// leak into the next.
afterEach(() => {
  cleanup();
});
