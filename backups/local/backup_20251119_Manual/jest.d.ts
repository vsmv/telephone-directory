/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// Ensure Jest globals are available in test files
declare global {
  var jest: typeof import('jest')
  var describe: typeof import('jest').describe
  var it: typeof import('jest').it
  var test: typeof import('jest').test
  var expect: typeof import('jest').expect
  var beforeEach: typeof import('jest').beforeEach
  var afterEach: typeof import('jest').afterEach
  var beforeAll: typeof import('jest').beforeAll
  var afterAll: typeof import('jest').afterAll
}

export {}