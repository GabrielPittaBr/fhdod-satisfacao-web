import { useMutation } from '@tanstack/react-query'
import { Download, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Pagina } from '@/components/layout/Pagina'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Arquivo } from '@/lib/api/cliente'
import { mensagemGeral } from '@/lib/api/erro'
import type { FiltrosDashboard } from '@/lib/api/tipos'
import { dataCurta } from '@/lib/format'
import { usePode } from '@/stores/sessao'
import { exportarRespostas, exportarResumo, exportarResumoPdf } from '../api'
import { Categorias, Comentarios, Evolucao, Indicadores, NpsPorSetor, Ranking } from '../components/blocos'
import { Filtros } from '../components/Filtros'
import { useFiltros } from '../filtros'

const EXPORTACOES = {
  resumo: { rotulo: 'Resumo dos indicadores (Excel)', gerando: 'Gerando a planilha…', gerar: exportarResumo },
  resumoPdf: { rotulo: 'Resumo dos indicadores (PDF)', gerando: 'Gerando o PDF…', gerar: exportarResumoPdf },
  respostas: {
    rotulo: 'Todas as respostas (Excel)',
    gerando: 'Gerando a planilha…',
    gerar: exportarRespostas,
  },
} as const
type Exportacao = keyof typeof EXPORTACOES

function baixar({ nome, conteudo }: Arquivo) {
  const url = URL.createObjectURL(conteudo)
  const link = Object.assign(document.createElement('a'), { href: url, download: nome })
  document.body.append(link)
  link.click()
  link.remove()
  // o navegador lê o arquivo depois do clique: liberado na hora, o download pode não sair em alguns navegadores
  setTimeout(() => URL.revokeObjectURL(url), 40_000)
}

/**
 * A exportação usa os mesmos filtros da tela e só traz o que o usuário pode ver: a API gera o arquivo com o
 * escopo da sessão. Enquanto ele é gerado, o botão continua com o foco, mas não abre o menu.
 */
function Exportar({ filtros }: { filtros: FiltrosDashboard }) {
  const podeResumo = usePode('exportacao:resumo')
  const podeDetalhar = usePode('exportacao:detalhada')
  const [aberto, setAberto] = useState(false)
  const exportacao = useMutation({
    mutationFn: (qual: Exportacao) => EXPORTACOES[qual].gerar(filtros),
    // sem rede, o TanStack Query guardaria o pedido até a conexão voltar, com o botão em "Gerando…" e o arquivo
    // baixando sozinho depois: assim, o aviso de sem conexão aparece na hora
    networkMode: 'always',
    onSuccess: (arquivo) => {
      baixar(arquivo)
      toast.success('Arquivo baixado', { description: `${arquivo.nome}, com os mesmos filtros da tela.` })
    },
    onError: (erro) => toast.error(mensagemGeral(erro, 'Não deu para gerar o arquivo agora. Tente de novo.')),
  })
  if (!podeResumo && !podeDetalhar) return null

  const gerando = exportacao.isPending ? EXPORTACOES[exportacao.variables].gerando : null
  const item = (qual: Exportacao) => (
    <DropdownMenuItem className="min-h-10" onSelect={() => exportacao.mutate(qual)}>
      {EXPORTACOES[qual].rotulo}
    </DropdownMenuItem>
  )
  return (
    <>
      <DropdownMenu open={aberto} onOpenChange={(abrir) => setAberto(abrir && !exportacao.isPending)}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-disabled={exportacao.isPending || undefined}>
            {gerando ? <LoaderCircle aria-hidden className="animate-spin" /> : <Download aria-hidden />}
            {gerando ?? 'Exportar'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" collisionPadding={8} className="min-w-64">
          {podeResumo && item('resumo')}
          {podeResumo && item('resumoPdf')}
          {podeDetalhar && item('respostas')}
        </DropdownMenuContent>
      </DropdownMenu>
      <span role="status" className="sr-only">
        {gerando}
      </span>
    </>
  )
}

/** /painel: visão geral em segundos, do hospital até o setor e o turno. */
export default function DashboardPage() {
  const estado = useFiltros()
  const { filtros, alterar } = estado
  const veComentarios = usePode('comentarios:ver')

  return (
    <Pagina
      titulo="Indicadores de satisfação"
      descricao={`De ${dataCurta(filtros.inicio)} a ${dataCurta(filtros.fim)}, pelo ${filtros.base === 'ENVIO' ? 'dia em que a resposta foi enviada' : 'dia do atendimento'}.`}
      acoes={<Exportar filtros={filtros} />}
    >
      <Filtros {...estado} />
      <Indicadores filtros={filtros} />
      <div className="grid gap-5 xl:grid-cols-2">
        <NpsPorSetor
          filtros={filtros}
          aoEscolher={(setorId) => alterar({ setor: setorId ? String(setorId) : null })}
        />
        <Evolucao filtros={filtros} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Categorias filtros={filtros} />
        <Ranking filtros={filtros} />
      </div>
      {veComentarios && <Comentarios filtros={filtros} />}
    </Pagina>
  )
}
