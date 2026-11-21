// Mensagens de commit no padrão Conventional Commits, com os tipos do AGENTS.md.
// Commits não levam coautoria nem assinatura do Claude (seção "Sem coautoria nem assinatura" do AGENTS.md).

/** Trailers e assinaturas que ferramentas de IA acrescentam às mensagens. */
const ASSINATURAS_DO_CLAUDE = [
  /^co-authored-by:.*\b(claude|anthropic)\b/im,
  /generated with \[?claude code/i,
  /^claude-session:/im,
]

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'sem-coautoria-do-claude': ({ raw }) => [
          !ASSINATURAS_DO_CLAUDE.some((assinatura) => assinatura.test(raw ?? '')),
          'commits não levam coautoria nem assinatura do Claude; apague a linha (veja o AGENTS.md)',
        ],
      },
    },
  ],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'chore', 'style', 'refactor', 'test', 'ci']],
    'sem-coautoria-do-claude': [2, 'always'],
  },
}
