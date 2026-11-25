import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lerFiltros } from './filtros'

const ler = (endereco: string) => lerFiltros(new URLSearchParams(endereco))

describe('filtros lidos da URL', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 25, 10))
  })
  afterEach(() => vi.useRealTimers())

  it('sem nada na URL, os últimos 30 dias pelo dia do atendimento', () => {
    expect(ler('')).toEqual({
      periodo: '30d',
      filtros: { inicio: '2026-10-27', fim: '2026-11-25', base: 'ATENDIMENTO' },
    })
  })

  it('lê as datas escolhidas, o setor, o turno, o canal e a base', () => {
    expect(
      ler('periodo=datas&inicio=2026-01-01&fim=2026-03-31&setor=3&turno=2&canal=TOTEM&base=envio'),
    ).toEqual({
      periodo: 'datas',
      filtros: {
        inicio: '2026-01-01',
        fim: '2026-03-31',
        base: 'ENVIO',
        setorId: 3,
        turnoId: 2,
        canal: 'TOTEM',
      },
    })
  })

  it('troca as datas de lugar quando o início vem depois do fim', () => {
    expect(ler('periodo=datas&inicio=2026-03-31&fim=2026-01-01').filtros).toMatchObject({
      inicio: '2026-01-01',
      fim: '2026-03-31',
    })
  })

  it('ignora o que a API recusaria: data que não existe e ID que não é inteiro positivo', () => {
    expect(ler('periodo=datas&inicio=2026-02-31&fim=2026-13-01').filtros).toMatchObject({
      inicio: '2026-10-27',
      fim: '2026-11-25',
    })
    for (const id of ['abc', '0', '-2', '1.5', '1e40']) {
      const { filtros } = ler(`setor=${id}&turno=${id}`)
      expect([filtros.setorId, filtros.turnoId]).toEqual([undefined, undefined])
    }
    expect(ler('canal=FAX').filtros.canal).toBeUndefined()
  })
})
