// Salvar com aviso e copiar: usados pelas telas de cadastro do painel.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ErroApi, mensagemDeErro } from '@/lib/api/erro'

/**
 * Grava, recarrega as listas afetadas e avisa o resultado.
 * Com `aoFalhar`, o erro vai para o formulário (campo a campo); sem ele, vira um aviso na tela.
 */
export function useSalvar<TDados, TResultado>(
  acao: (dados: TDados) => Promise<TResultado>,
  opcoes: {
    recarregar: string[]
    sucesso?: string
    aoConcluir?: (resultado: TResultado) => void
    aoFalhar?: (erro: unknown) => void
  },
) {
  const clienteDeDados = useQueryClient()
  return useMutation({
    mutationFn: acao,
    onSuccess: (resultado) => {
      if (opcoes.sucesso) toast.success(opcoes.sucesso)
      opcoes.aoConcluir?.(resultado)
    },
    onError: (erro) => (opcoes.aoFalhar ? opcoes.aoFalhar(erro) : toast.error(mensagemGeral(erro))),
    // Recarrega também depois de uma falha: a tela pode já mostrar o que não foi gravado (a ordem das
    // perguntas muda antes da resposta), ou outra pessoa mudou os dados, e a falha veio disso.
    onSettled: () => {
      for (const chave of opcoes.recarregar) void clienteDeDados.invalidateQueries({ queryKey: [chave] })
    },
  })
}

/**
 * A mensagem do aviso geral. Na validação de um campo que não está na tela, como a lista da ordem das
 * perguntas, a mensagem do campo, já escrita pela API para quem está na tela, diz mais que "Dados inválidos".
 */
function mensagemGeral(erro: unknown) {
  const primeiro = erro instanceof ErroApi && erro.codigo === 'VALIDACAO' ? erro.detalhes[0] : undefined
  return primeiro?.mensagem ?? mensagemDeErro(erro)
}

/** Copia para a área de transferência e confirma com um aviso. */
export async function copiar(texto: string, oQue: string) {
  try {
    await navigator.clipboard.writeText(texto)
    // "Copiado: senha provisória", sem concordar com o gênero de cada rótulo
    toast.success(`Copiado: ${oQue.toLocaleLowerCase('pt-BR')}`)
  } catch {
    // fora de HTTPS o navegador bloqueia a cópia: o texto continua na tela para copiar à mão
    toast.error('Não deu para copiar. Selecione o texto e copie manualmente.')
  }
}

/**
 * A API valida de novo o que o formulário já validou. Erros por campo voltam para o campo;
 * o resto (conflito, rede) vira a mensagem geral.
 */
export function aplicarErroDaApi<T extends FieldValues>(form: UseFormReturn<T>, erro: unknown) {
  const campos = Object.keys(form.getValues())
  const detalhes = erro instanceof ErroApi ? erro.detalhes.filter((d) => campos.includes(d.campo)) : []
  if (detalhes.length === 0) return form.setError('root', { message: mensagemGeral(erro) })
  detalhes.forEach((d, i) =>
    form.setError(d.campo as Path<T>, { message: d.mensagem }, { shouldFocus: i === 0 }),
  )
}
