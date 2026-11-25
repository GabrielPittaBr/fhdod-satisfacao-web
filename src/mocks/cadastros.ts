// Telas de TV do painel, simuladas até o ticket 08. Setores, categorias, turnos, perguntas e usuários já vêm
// da API (ticket 06); os dados simulados deles, em banco.ts, só alimentam os indicadores e as respostas simulados.
import type { DetalheErro, Envelope, TelaTv } from '@/lib/api/tipos'
import { autenticar, exigir } from './auth'
import { banco, proximoId, salvar } from './banco'
import { erros, rede, tokenAleatorio } from './rede'

function validar(regras: [campo: string, valido: boolean, mensagem: string][]) {
  const detalhes: DetalheErro[] = regras
    .filter(([, valido]) => !valido)
    .map(([campo, , mensagem]) => ({ campo, mensagem }))
  if (detalhes.length) throw erros.validacao(detalhes)
}

function achar<T extends { id: number }>(lista: T[], id: number, oQue: string): T {
  const item = lista.find((i) => i.id === id)
  if (!item) throw erros.naoEncontrado(`${oQue} não encontrado.`)
  return item
}

// ---------- Telas de TV ----------

const telaParaApi = ({ token: _token, ...tela }: (typeof banco.tvTelas)[number]): TelaTv => tela

/** GET /tv-telas */
export async function listarTelasTv(token: string): Promise<Envelope<TelaTv[]>> {
  await rede()
  exigir(autenticar(token), 'tvwall:gerenciar')
  return { data: banco.tvTelas.map(telaParaApi) }
}

/** POST /tv-telas: o token da tela só é devolvido aqui, uma única vez. */
export async function criarTelaTv(
  token: string,
  corpo: { nome: string },
): Promise<Envelope<{ tela: TelaTv; token: string }>> {
  await rede()
  exigir(autenticar(token), 'tvwall:gerenciar')
  validar([['nome', corpo.nome.trim().length >= 2, 'Informe onde a tela fica']])
  const tela = {
    id: proximoId(banco.tvTelas),
    nome: corpo.nome.trim(),
    ativa: true,
    ultimoAcessoEm: null,
    token: tokenAleatorio(),
  }
  banco.tvTelas.push(tela)
  salvar()
  return { data: { tela: telaParaApi(tela), token: tela.token } }
}

/** PATCH /tv-telas/:id/status: desativar faz o link parar de funcionar. */
export async function alterarStatusTelaTv(token: string, id: number, ativa: boolean): Promise<void> {
  await rede()
  exigir(autenticar(token), 'tvwall:gerenciar')
  achar(banco.tvTelas, id, 'Tela').ativa = ativa
  salvar()
}
