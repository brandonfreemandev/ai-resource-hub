import path from 'path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Tell Next.js to trace files starting from the monorepo root (one level up from frontend/).
  // This lets the bundler include the ../content directory in the deployment artifact.
  outputFileTracingRoot: path.join(__dirname, '../'),
  outputFileTracingIncludes: {
    // For every route, bundle the content markdown files and heartbeat.
    '/**': ['../content/**/*'],
  },
};

export default config;
