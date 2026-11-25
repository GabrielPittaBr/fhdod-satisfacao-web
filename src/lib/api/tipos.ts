// Tipos do contrato da API. A pesquisa pública, a sessão do painel e o erro padrão já vêm do schema.d.ts,
// gerado do openapi.json por `pnpm api:tipos`. O resto ainda é escrito à mão, com os mesmos nomes de campo do
// Plano de Desenvolvimento, e troca de lugar quando a sua área for ligada à API (tickets 06 a 09).
import type { components } from './schema'

type Contrato = components['schemas']

// Listas de valores que a pesquisa e a sessão usam: as mesmas do contrato, que o painel também lê.
export type Canal = Contrato['Canal']
export type Classificacao = Contrato['Classificacao']
export type TipoPergunta = Contrato['TipoPergunta']
export type TipoComentario = Contrato['TipoComentario']
export type Perfil = Contrato['Perfil']
export type Permissao = Contrato['Permissao']

export type BaseData = 'ATENDIMENTO' | 'ENVIO'
export type Granularidade = 'DIA' | 'SEMANA' | 'MES'

export interface Envelope<T> {
  data: T
}

export interface Meta {
  pagina: number
  porPagina: number
  total: number
}

export interface Lista<T> {
  data: T[]
  meta: Meta
}

export type DetalheErro = Contrato['DetalheErro']

// ---------- Cadastros ----------

export interface Setor {
  id: number
  nome: string
  slug: string
  descricao: string | null
  ativo: boolean
}

export interface Categoria {
  id: number
  nome: string
  ordem: number
  ativa: boolean
}

export interface Turno {
  id: number
  nome: string
  /** "HH:mm" */
  horaInicio: string
  /** "HH:mm"; menor que horaInicio quando o turno atravessa a meia-noite */
  horaFim: string
  ordem: number
}

export interface Pergunta {
  id: number
  setorId: number
  categoriaId: number
  texto: string
  tipo: TipoPergunta
  opcoes: string[] | null
  ordem: number
  ativa: boolean
  /** Com respostas gravadas, o tipo não pode mais mudar. */
  temRespostas: boolean
}

export interface Usuario {
  id: number
  nome: string
  email: string
  perfil: Perfil
  ativo: boolean
  trocarSenha: boolean
  setorIds: number[]
  ultimoLoginEm: string | null
}

export interface TelaTv {
  id: number
  nome: string
  ativa: boolean
  ultimoAcessoEm: string | null
}

// ---------- Autenticação: do contrato gerado ----------

/** Quem está logado, o que o perfil permite e quais setores enxerga (`setores` vazio com `todosSetores`). */
export type Sessao = Contrato['Sessao']

// ---------- Pesquisa pública: do contrato gerado ----------

export type PerguntaPublica = Contrato['PerguntaPublica']
export type PesquisaPublica = Contrato['PesquisaPublica']
export type ItemEnvio = Contrato['ItemEnvio']
/** `site` é o campo isca: invisível para pessoas e sempre vazio quando quem envia é uma delas. */
export type EnvioResposta = Contrato['EnvioResposta']
export type RespostaCriada = Contrato['RespostaCriada']
export type Complemento = Contrato['Complemento']

// ---------- Painel ----------

export interface FiltrosDashboard {
  inicio: string
  fim: string
  base: BaseData
  setorId?: number
  turnoId?: number
  canal?: Canal
}

export interface Resumo {
  nps: number | null
  total: number
  promotores: number
  neutros: number
  detratores: number
  notasBaixas: number
  baixissimas: number
  /** Média das notas de 1 a 5 de todas as perguntas respondidas. */
  mediaEscala: number | null
}

export interface NpsSetor {
  setorId: number
  setor: string
  nps: number | null
  total: number
}

export interface PontoEvolucao {
  /** Primeiro dia do período ("AAAA-MM-DD"). */
  periodo: string
  nps: number | null
  total: number
}

export interface IndicadorCategoria {
  categoriaId: number
  categoria: string
  media: number | null
  /** % de notas 4 e 5 */
  percentual45: number | null
  total: number
}

export interface ItemRanking {
  setorId: number
  setor: string
  categoriaId: number
  categoria: string
  media: number
  percentual45: number
  total: number
}

export interface Ranking {
  melhores: ItemRanking[]
  piores: ItemRanking[]
}

export interface ComentarioRecente {
  id: number
  respostaId: number
  tipo: TipoComentario
  texto: string
  setor: string
  dataAtendimento: string
  enviadoEm: string
  classificacao: Classificacao
}

export interface FiltrosRespostas extends Partial<FiltrosDashboard> {
  classificacao?: Classificacao
  comComentario?: boolean
  comRetorno?: boolean
  pagina?: number
  porPagina?: number
  ordenarPor?: 'dataAtendimento' | 'enviadoEm' | 'nps'
  ordem?: 'asc' | 'desc'
}

export interface RespostaResumo {
  id: number
  setorId: number
  setor: string
  canal: Canal
  dataAtendimento: string
  turno: string
  nps: number
  classificacao: Classificacao
  enviadoEm: string
  temComentario: boolean
  pediuRetorno: boolean
}

export interface ItemResposta {
  perguntaId: number
  perguntaTexto: string
  categoria: string
  tipo: TipoPergunta
  valorNumero: number | null
  valorTexto: string | null
  /** Só para notas de 1 a 5; a API já devolve pronta. */
  classificacao: Classificacao | null
}

export interface RespostaDetalhe extends RespostaResumo {
  itens: ItemResposta[]
  comentario: { tipo: TipoComentario; texto: string } | null
  contato: { id: number; telefoneMascarado: string; status: 'NOVO' } | null
}

export interface PedidoRetorno {
  id: number
  respostaId: number
  setor: string
  dataAtendimento: string
  nps: number
  classificacao: Classificacao
  comentario: { tipo: TipoComentario; texto: string } | null
  telefoneMascarado: string
  consentimentoEm: string
  status: 'NOVO'
}

// ---------- TV Wall ----------

export interface IndicadoresTv {
  tela: string
  geradoEm: string
  /** Mês corrente, pela data do atendimento. */
  mes: Pick<Resumo, 'nps' | 'total' | 'promotores' | 'neutros' | 'detratores' | 'mediaEscala'>
  npsPorSetor: Omit<NpsSetor, 'setorId'>[]
  evolucao: PontoEvolucao[]
  destaques: Pick<ItemRanking, 'setor' | 'categoria' | 'media' | 'percentual45'>[]
}
