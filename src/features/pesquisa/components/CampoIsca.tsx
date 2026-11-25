import type { Ref } from 'react'

/**
 * Campo isca do envio (`site`, no contrato da API). Fica fora da tela, fora da ordem do teclado e escondido
 * do leitor de tela, então uma pessoa nunca o vê nem o preenche: vai vazio. Um robô que preenche todo campo
 * da página o preenche, e a API recusa o envio sem gravar nada. O rótulo pede para deixar em branco, para o caso
 * raro de alguém ver a página sem o CSS (um leitor de texto puro, por exemplo).
 */
export function CampoIsca({ ref }: { ref: Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden className="pointer-events-none fixed top-0 -left-[9999px] size-px overflow-hidden">
      <label>
        Deixe este campo em branco
        <input ref={ref} type="text" name="site" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  )
}
