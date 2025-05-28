module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Maps @/ imports to src/
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};