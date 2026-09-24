import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Was 'src/**/*.test.ts' — silently never matched a .tsx test file
    // (e.g. components/__tests__/ProxiedPhoto.test.tsx), so it never ran.
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    // Mirrors tsconfig.json's "paths": { "@/*": ["./src/*"] }. Without this,
    // plain Vitest doesn't resolve the @/ alias at all — any test that
    // imports a component using @/... (e.g. ProxiedPhoto.tsx importing
    // @/lib/photoProxy) fails with "Cannot find package '@/lib/...'"
    // even once it's correctly discovered by the include pattern above.
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
