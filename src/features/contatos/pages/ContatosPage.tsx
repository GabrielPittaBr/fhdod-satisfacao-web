import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { Eye, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Bloco, Consulta, Pagina } from '@/components/layout/Pagina'
import { SeloClassificacao, SeloComentario } from '@/components/Selos'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { mensagemDeErro } from '@/lib/api/erro'
import type { Meta, PedidoRetorno } from '@/lib/api/tipos'
import { dataCurta, dataHora, mascararTelefone, numero } from '@/lib/format'
import { ROTULO_STATUS_RETORNO } from '@/lib/rotulos'
import { listarContatos, revelarTelefone } from '../api'

/** "Anterior" e "Próxima", só quando os pedidos não cabem numa página. */
function Paginas({ meta, aoMudar }: { meta: Meta; aoMudar: (pagina: number) => void }) {
  const paginas = Math.ceil(meta.total / meta.porPagina)
  if (paginas <= 1) return null
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="numeros text-sm text-muted-foreground">
        Página {meta.pagina} de {paginas}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" disabled={meta.pagina <= 1} onClick={() => aoMudar(meta.pagina - 1)}>
          Anterior
        </Button>
        <Button variant="outline" disabled={meta.pagina >= paginas} onClick={() => aoMudar(meta.pagina + 1)}>
          Próxima
        </Button>
      </div>
    </div>
  )
}

/** /painel/contatos: quem pediu retorno da Ouvidoria. O telefone fica mascarado até alguém revelar. */
export default function ContatosPage() {
  const [pagina, setPagina] = useState(1)
  const consulta = useQuery({
    queryKey: ['contatos', pagina],
    queryFn: () => listarContatos(pagina),
    placeholderData: keepPreviousData,
  })
  const [confirmando, setConfirmando] = useState<PedidoRetorno | null>(null)
  // números revelados ficam só na memória desta tela: ao sair, voltam a ficar mascarados
  const [revelados, setRevelados] = useState<Record<number, string>>({})

  const revelacao = useMutation({
    mutationFn: (pedido: PedidoRetorno) => revelarTelefone(pedido.id),
    // nem o cache do TanStack Query guarda o número: ele some da memória junto com a tela
    gcTime: 0,
    onSuccess: (telefone, pedido) => setRevelados((atuais) => ({ ...atuais, [pedido.id]: telefone })),
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Não deu para revelar o telefone agora.')),
  })

  return (
    <Pagina
      titulo="Pedidos de retorno"
      descricao="Pessoas que deixaram o telefone e autorizaram o contato do hospital. Os números ficam mascarados; cada vez que alguém revela um, a ação fica registrada."
    >
      <Bloco>
        <Consulta
          consulta={consulta}
          altura="h-72"
          vazio={(lista) => lista.meta.total === 0}
          textoVazio="Ninguém pediu retorno até agora."
        >
          {({ data: pedidos, meta }) => (
            <>
              <p className="mb-3 text-sm text-muted-foreground" role="status">
                {numero(meta.total)} {meta.total === 1 ? 'pedido de retorno' : 'pedidos de retorno'}, do mais
                recente para o mais antigo
              </p>
              <ul className="grid gap-3">
                {pedidos.map((pedido) => {
                  const telefone = revelados[pedido.id]
                  return (
                    <li
                      key={pedido.id}
                      className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto] md:items-start"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">{pedido.setor}</h2>
                          <SeloClassificacao valor={pedido.classificacao} />
                          <span className="rounded-md border border-input/50 px-1.5 text-xs leading-6 font-medium">
                            {ROTULO_STATUS_RETORNO[pedido.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Atendimento em {dataCurta(pedido.dataAtendimento)}. Nota de recomendação{' '}
                          {pedido.nps}. Pedido feito em {dataHora(pedido.consentimentoEm)}.
                        </p>
                        {pedido.comentario ? (
                          <p className="mt-3 flex flex-wrap items-start gap-2">
                            <SeloComentario tipo={pedido.comentario.tipo} />
                            <span className="min-w-0 flex-1 basis-60">{pedido.comentario.texto}</span>
                          </p>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground">Não deixou comentário.</p>
                        )}
                        <Link
                          to={`/painel/respostas?periodo=90d&resposta=${pedido.respostaId}`}
                          className="mt-2 inline-flex min-h-9 items-center text-sm font-semibold text-primary underline underline-offset-4"
                        >
                          Ver a resposta completa
                        </Link>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        {telefone ? (
                          <a
                            href={`tel:+55${telefone}`}
                            className="numeros flex min-h-10 items-center gap-2 text-lg font-semibold"
                          >
                            <Phone aria-hidden className="size-4" />
                            {mascararTelefone(telefone)}
                          </a>
                        ) : (
                          <>
                            <p
                              className="numeros text-lg font-semibold"
                              aria-label={`Telefone terminado em ${pedido.telefoneMascarado.slice(-4)}`}
                            >
                              {pedido.telefoneMascarado}
                            </p>
                            <Button
                              variant="outline"
                              disabled={revelacao.isPending}
                              onClick={() => setConfirmando(pedido)}
                            >
                              <Eye aria-hidden />
                              Revelar telefone
                            </Button>
                          </>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              <Paginas meta={meta} aoMudar={setPagina} />
            </>
          )}
        </Consulta>
      </Bloco>

      <AlertDialog open={confirmando !== null} onOpenChange={(abrir) => !abrir && setConfirmando(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revelar o telefone desta pessoa?</AlertDialogTitle>
            <AlertDialogDescription>
              A consulta fica registrada com o seu nome, a data e a hora. Use o número só para dar o retorno
              que a pessoa pediu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmando && revelacao.mutate(confirmando)}>
              Revelar telefone
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Pagina>
  )
}
