import { expect, it } from 'vitest';
import { compile } from '..';


it('should generate right code', () => {
  const template = '<div><p>Vue</p><p>Template</p></div>'
  expect(compile(template)).toMatchInlineSnapshot(`
    "function render () {
      return h('div', [h('p', 'Vue'), h('p', 'Template')])
    }"
  `)
});