// pnpm api:tipos — gera src/lib/api/schema.d.ts a partir do openapi.json da API.
//
// De onde vem o contrato: OPENAPI_JSON, do ambiente ou do .env (o modelo está no .env.example). Pode ser um
// caminho, relativo a esta pasta, ou o endereço da API rodando (http://localhost:3333/api/docs/openapi.json).
// Sem a variável, vale o openapi.json commitado na API, com os dois repositórios lado a lado.
//
// O arquivo gerado é commitado, para o CI checar os tipos sem a API ao lado, e nunca é editado à mão.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destino = path.join(raiz, 'src/lib/api/schema.d.ts')
const origem = process.env.OPENAPI_JSON || '../fhdod-satisfacao-api/openapi.json'
const endereco = /^https?:\/\//.test(origem) ? new URL(origem) : pathToFileURL(path.resolve(raiz, origem))

const cabecalho = `// Gerado por \`pnpm api:tipos\` a partir do openapi.json da API. Não edite à mão: mude o contrato na API,
// commite o openapi.json de lá e gere de novo.

`

try {
  const ast = await openapiTS(endereco)
  await writeFile(destino, cabecalho + astToString(ast))
  console.log(`Tipos gerados em ${path.relative(raiz, destino)}, a partir de ${origem}.`)
} catch (erro) {
  console.error(`Não deu para gerar os tipos a partir de ${origem}.`)
  console.error(
    'Confira se a API está na pasta ao lado (../fhdod-satisfacao-api) ou aponte o OPENAPI_JSON para o openapi.json dela.',
  )
  console.error(erro instanceof Error ? erro.message : erro)
  process.exitCode = 1
}
