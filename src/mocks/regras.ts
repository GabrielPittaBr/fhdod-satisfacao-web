// Regras que, no sistema real, existem só na API. O front nunca as repete:
// ele exibe a classificação e as permissões que recebe.
import type { Classificacao } from '@/lib/api/tipos'

export interface Limites {
  npsBaixa: number
  npsBaixissima: number
  escalaBaixa: number
  escalaBaixissima: number
}

export const LIMITES_PADRAO: Limites = {
  npsBaixa: 6,
  npsBaixissima: 2,
  escalaBaixa: 3,
  escalaBaixissima: 1,
}

const GRAVIDADE: Classificacao[] = ['NORMAL', 'BAIXA', 'BAIXISSIMA']
const pior = (a: Classificacao, b: Classificacao) => (GRAVIDADE.indexOf(a) >= GRAVIDADE.indexOf(b) ? a : b)

export function classificarNps(nps: number, l: Limites = LIMITES_PADRAO): Classificacao {
  if (nps <= l.npsBaixissima) return 'BAIXISSIMA'
  if (nps <= l.npsBaixa) return 'BAIXA'
  return 'NORMAL'
}

export function classificarNota(nota: number, l: Limites = LIMITES_PADRAO): Classificacao {
  if (nota <= l.escalaBaixissima) return 'BAIXISSIMA'
  if (nota <= l.escalaBaixa) return 'BAIXA'
  return 'NORMAL'
}

/** Vale a pior entre o NPS e as notas de 1 a 5. */
export function classificarResposta(
  nps: number,
  notas: number[],
  l: Limites = LIMITES_PADRAO,
): Classificacao {
  return notas.map((n) => classificarNota(n, l)).reduce(pior, classificarNps(nps, l))
}

/** % de promotores (9 e 10) menos % de detratores (0 a 6). */
export function calcularNps(notas: number[]): number | null {
  if (notas.length === 0) return null
  const promotores = notas.filter((n) => n >= 9).length
  const detratores = notas.filter((n) => n <= 6).length
  return Math.round(((promotores - detratores) / notas.length) * 100)
}

export const mascararTelefone = (telefone: string) => `•••• ${telefone.slice(-4)}`
