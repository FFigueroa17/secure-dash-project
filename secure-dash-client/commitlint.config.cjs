module.exports = {
  // conventional types  +  gitmoji check
  extends: ['@commitlint/config-conventional', 'gitmoji'],
  plugins: ['commitlint-plugin-gitmoji'],

  parserPreset: {
    // <type>(optional-scope): <emoji> <subject>
    parserOpts: {
      headerPattern: /^(\w+)(?:\(([^)]+)\))?:\s(:\S+?:)\s(.+)$/u,
      headerCorrespondence: ['type', 'scope', 'emoji', 'subject'],
    },
  },
};
