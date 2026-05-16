export const mathJaxConfig = {
  loader: { load: ['[tex]/ams', '[tex]/color'] },
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    packages: { '[+]': ['ams', 'color'] },
  },
  startup: { typeset: false },
}
