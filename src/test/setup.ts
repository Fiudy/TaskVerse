import '@testing-library/jest-dom';

// Silence console errors from React during tests when expected
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Allow normal logging; could filter noisy warnings if needed
    originalError.apply(console, args as []);
  };

  // jsdom não implementa matchMedia; alguns componentes (ex.: sonner) dependem dele.
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // deprecated
        removeListener: () => {}, // deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
});

afterAll(() => {
  console.error = originalError;
});