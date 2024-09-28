// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import * as matchers from '@testing-library/jest-dom/matchers';
import { afterAll, beforeAll, expect } from 'vitest';

expect.extend(matchers);

beforeAll((test) => {
  console.log('starting test: ' + test.name);
});

afterAll((test) => {
  console.log('ending test: ' + test.name);
});
