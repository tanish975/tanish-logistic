/**
 * Jest config — enables smoke tests for pages/components.
 * Uses node environment + react-dom/server renderToString (fast, no jsdom).
 */
const config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/scripts/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default config;
