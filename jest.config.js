/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // Maps @src/* to the actual src folder
  },
  moduleDirectories: ['node_modules', 'src'],  // Allows Jest to resolve modules from these directories
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Transforms TypeScript files using ts-jest
  },
  testEnvironment: 'node',
};