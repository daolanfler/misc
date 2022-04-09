import { expect, it, test } from 'vitest';
import { parse, tokenize } from '../parse';

test('tokenize works correctly', () => {
  const str = '<div><p>Vue</p><p>Template</p></div>';
  expect(tokenize(str)).toMatchSnapshot();
});

it('should parse to a template ast tree', () => {
  const template = '<div><p>Vue</p><p>Template</p></div>'
  expect(parse(template)).toMatchSnapshot();
});
