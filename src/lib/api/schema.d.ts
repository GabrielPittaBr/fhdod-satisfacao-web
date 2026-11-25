// Gerado por `pnpm api:tipos` a partir do openapi.json da API. Não edite à mão: mude o contrato na API,
// commite o openapi.json de lá e gere de novo.

export interface paths {
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Estado da API e do banco
         * @description Chamada pelo Docker e pelo monitoramento. Fica em `/api/health`, fora do `/api/v1`, porque o endereço não muda com a versão da API. Cada chamada consulta o banco, sem cache.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description A API e o banco estão no ar. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "status": "ok",
                         *         "banco": "ok"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Saude"];
                        };
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description O banco não respondeu. O corpo é o mesmo do 200 e diz o que caiu. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "status": "indisponivel",
                         *         "banco": "indisponivel"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Saude"];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Entra com e-mail e senha
         * @description Devolve o token de acesso no corpo e grava o refresh no cookie. Cada login com sucesso vai para a auditoria. Depois de 5 tentativas erradas em 15 minutos para o mesmo IP e e-mail, a próxima recebe 429, mesmo com a senha certa, até a janela acabar; o `Retry-After` diz quantos segundos faltam.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * Format: email
                         * @description Vale com qualquer combinação de maiúsculas.
                         * @example nome@hospital.com.br
                         */
                        email: string;
                        senha: string;
                    };
                };
            };
            responses: {
                /** @description Login feito. */
                200: {
                    headers: {
                        /** @description O refresh token novo, no cookie `refresh_token`. O banco guarda só o hash dele. */
                        "Set-Cookie"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "tokenAcesso": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.assinatura"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: {
                                /** @description JWT de 15 minutos. O front o guarda só em memória e o envia em `Authorization: Bearer <token>`. */
                                tokenAcesso: string;
                            };
                        };
                    };
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "email",
                         *             "mensagem": "Digite um e-mail válido, como nome@hospital.com.br"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: e-mail ou senha errados, ou usuário inativo, sempre com a mesma mensagem. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "E-mail ou senha incorretos.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `LIMITE_ATINGIDO`: limite de requisições atingido. */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "LIMITE_ATINGIDO",
                         *         "mensagem": "Muitas tentativas. Espere 15 minutos e tente de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Renova a sessão
         * @description Troca o refresh do cookie por um novo (o antigo é revogado) e devolve outro token de acesso. O front chama esta rota ao recarregar a página e ao receber um 401, uma única vez.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Sessão renovada. */
                200: {
                    headers: {
                        /** @description O refresh token novo, no cookie `refresh_token`. O banco guarda só o hash dele. */
                        "Set-Cookie"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "tokenAcesso": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.assinatura"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: {
                                /** @description JWT de 15 minutos. O front o guarda só em memória e o envia em `Authorization: Bearer <token>`. */
                                tokenAcesso: string;
                            };
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem o cookie, ou com o refresh vencido, revogado (já usado) ou de usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sai e encerra todas as sessões
         * @description Revoga todos os refresh tokens da pessoa e apaga o cookie. A pessoa é a do token de acesso ou, se ele já venceu, a do cookie de refresh. Responde 204 mesmo sem sessão válida.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Sessões encerradas e cookie apagado. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Quem está logado
         * @description Usuário, permissões do perfil e setores que a pessoa enxerga, lidos do banco a cada chamada. Funciona também com a senha provisória, para o front saber que precisa pedir a troca (`trocarSenha`).
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description A sessão de quem está logado. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "usuario": {
                         *           "id": 2,
                         *           "nome": "Ana Souza",
                         *           "email": "ana.souza@hospital.com.br",
                         *           "perfil": "GESTOR",
                         *           "trocarSenha": false
                         *         },
                         *         "permissoes": [
                         *           "perguntas:gerenciar",
                         *           "dashboard:ver",
                         *           "respostas:ver",
                         *           "comentarios:ver",
                         *           "exportacao:resumo",
                         *           "exportacao:detalhada",
                         *           "escalas:gerenciar"
                         *         ],
                         *         "setores": [
                         *           {
                         *             "id": 3,
                         *             "nome": "Pronto Atendimento"
                         *           }
                         *         ],
                         *         "todosSetores": false
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Sessao"];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/senha": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Troca a própria senha
         * @description Obrigatória no primeiro acesso, com a senha provisória. Encerra as outras sessões e grava um refresh novo no cookie, para quem trocou continuar logado. Senha atual errada volta em `senhaAtual`, e senha nova fora da regra, em `novaSenha`.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description A senha de agora; no primeiro acesso, a provisória. */
                        senhaAtual: string;
                        /** @description Pelo menos 10 caracteres, com letras e números, e diferente da atual. */
                        novaSenha: string;
                    };
                };
            };
            responses: {
                /** @description Senha trocada. */
                204: {
                    headers: {
                        /** @description O refresh token novo, no cookie `refresh_token`. O banco guarda só o hash dele. */
                        "Set-Cookie"?: string;
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: senha atual errada (em `senhaAtual`) ou senha nova fora da regra ou igual à atual (em `novaSenha`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "senhaAtual",
                         *             "mensagem": "A senha atual não confere."
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/publico/setores/{slug}/pesquisa": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Abre a pesquisa do setor
         * @description Sem login. O nome do setor, as perguntas ativas na ordem, os turnos e os textos e tempos que a tela usa, lidos das configurações.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description O endereço do setor, de `/s/<slug>` e `/totem/<slug>`. */
                    slug: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description A pesquisa do setor. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "setor": {
                         *           "nome": "Pronto Atendimento",
                         *           "slug": "pronto-atendimento"
                         *         },
                         *         "perguntas": [
                         *           {
                         *             "id": 12,
                         *             "texto": "Como foi o atendimento na recepção?",
                         *             "tipo": "ESCALA_1_5",
                         *             "opcoes": null
                         *           },
                         *           {
                         *             "id": 13,
                         *             "texto": "Você recebeu as orientações sobre o exame?",
                         *             "tipo": "MULTIPLA_ESCOLHA",
                         *             "opcoes": [
                         *               "Sim, e entendi tudo",
                         *               "Sim, mas fiquei com dúvidas",
                         *               "Não"
                         *             ]
                         *           },
                         *           {
                         *             "id": 14,
                         *             "texto": "O tempo de espera foi informado?",
                         *             "tipo": "SIM_NAO",
                         *             "opcoes": null
                         *           }
                         *         ],
                         *         "turnos": [
                         *           {
                         *             "id": 1,
                         *             "nome": "Manhã",
                         *             "horaInicio": "07:00",
                         *             "horaFim": "13:00"
                         *           },
                         *           {
                         *             "id": 2,
                         *             "nome": "Tarde",
                         *             "horaInicio": "13:00",
                         *             "horaFim": "19:00"
                         *           },
                         *           {
                         *             "id": 3,
                         *             "nome": "Noite",
                         *             "horaInicio": "19:00",
                         *             "horaFim": "07:00"
                         *           }
                         *         ],
                         *         "npsTexto": "De 0 a 10, qual a probabilidade de você recomendar o hospital a alguém?",
                         *         "textoLimiteCaracteres": 500,
                         *         "totem": {
                         *           "reinicioSegundos": 15,
                         *           "inatividadeSegundos": 60
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["PesquisaPublica"];
                        };
                    };
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "contato.telefone",
                         *             "mensagem": "Telefone com DDD, só números"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este endereço, ou ele está desativado. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Esta pesquisa não está disponível.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publico/setores/{slug}/respostas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Envia a avaliação
         * @description Sem login, com limite de envios por IP (os IPs do `RATE_LIMIT_ALLOWLIST`, como o do hospital, ficam fora dele). Grava a avaliação ao confirmar a nota de 0 a 10, mesmo sem nenhuma outra pergunta respondida, e devolve a classificação e o token de complemento, numa resposta sem cache. A mesma `chaveIdempotencia` enviada de novo devolve a avaliação já gravada (o mesmo `id` e a mesma `classificacao`), com um token novo, que substitui o anterior. O IP de quem envia não é gravado.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description O endereço do setor, de `/s/<slug>` e `/totem/<slug>`. */
                    slug: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["EnvioResposta"];
                };
            };
            responses: {
                /** @description Avaliação gravada (ou já gravada, num reenvio). */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 845,
                         *         "classificacao": "BAIXA",
                         *         "tokenComplemento": "kZ3pX9qT2vLm8RwYc4Nf6Hb1Jd7Ks0Ga5Ue3Oi9Py2",
                         *         "expiraEm": "2026-11-10T14:52:00.000Z"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["RespostaCriada"];
                        };
                    };
                };
                /** @description `VALIDACAO`: um item em `detalhes` por problema: NPS fora de 0 a 10 (em `nps`), data futura (em `dataAtendimento`), turno inexistente (em `turnoId`), chave que não é UUID (em `chaveIdempotencia`), pergunta que não é uma ativa do setor ou repetida (em `itens.N`), valor errado para o tipo da pergunta (em `itens.N.valorNumero` ou `itens.N.valorTexto`) e o campo isca preenchido (em `site`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "nps",
                         *             "mensagem": "Obrigatório, de 0 a 10"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este endereço, ou ele está desativado. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Esta pesquisa não está disponível.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: a chave já foi usada num envio de outro setor, ou no de uma avaliação já complementada. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Esta avaliação já foi enviada. Obrigado por responder!",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `LIMITE_ATINGIDO`: mais de 30 envios do mesmo IP em 15 minutos. */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "LIMITE_ATINGIDO",
                         *         "mensagem": "Muitas avaliações enviadas desta rede. Espere alguns minutos e tente de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publico/respostas/{id}/complemento": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Anexa o comentário e o pedido de retorno
         * @description Sem login: vale o token de complemento do envio, no cabeçalho `X-Complemento-Token`, uma vez só e até 30 minutos depois do envio. Anexa o comentário, o pedido de retorno ou os dois, numa chamada só: depois dela, o token não vale mais, mesmo dentro do prazo. O telefone é gravado cifrado (AES-256-GCM), com os 4 últimos dígitos em claro e a hora do consentimento, e o pedido de retorno nasce `NOVO`. Um erro de validação não gasta o token. O telefone não aparece em nenhuma resposta nem no log.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["Complemento"];
                };
            };
            responses: {
                /** @description Complemento gravado. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: um item em `detalhes` por problema: corpo sem o comentário nem o telefone (em `body`), tipo fora da lista (em `comentario.tipo`), texto vazio ou acima do `textoLimiteCaracteres` (em `comentario.texto`), telefone sem DDD ou sem 10 ou 11 dígitos (em `contato.telefone`) e consentimento que não é `true` (em `contato.consentimento`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "contato.telefone",
                         *             "mensagem": "Informe o telefone com DDD, como (51) 99999-0000"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem o token, com o token de outra avaliação, vencido ou já usado. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "O prazo para complementar esta avaliação terminou.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/setores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Setores que a pessoa enxerga
         * @description Ativos e inativos, em ordem alfabética e sem paginação. Super Admin e Ouvidoria recebem todos; Gestor e Visualizador, só os seus. Qualquer perfil pode listar; só o Super Admin cria e edita.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os setores, em ordem alfabética. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 5,
                         *           "nome": "Ambulatório",
                         *           "slug": "ambulatorio",
                         *           "descricao": "Consultas agendadas",
                         *           "ativo": true
                         *         },
                         *         {
                         *           "id": 6,
                         *           "nome": "Maternidade",
                         *           "slug": "maternidade",
                         *           "descricao": "Em reforma: pesquisa pausada",
                         *           "ativo": false
                         *         },
                         *         {
                         *           "id": 1,
                         *           "nome": "Pronto Atendimento",
                         *           "slug": "pronto-atendimento",
                         *           "descricao": "Urgência e emergência, 24 horas",
                         *           "ativo": true
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Setor"][];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: com a senha provisória, até a troca. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Troque a senha provisória para continuar.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Cria um setor
         * @description O setor nasce ativo, e a pesquisa dele já fica no ar em `/s/<slug>` e `/totem/<slug>`.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 2 a 100 caracteres; os espaços das pontas saem.
                         * @example Pronto Atendimento
                         */
                        nome: string;
                        /**
                         * @description Endereço do setor, que forma os links `/s/<slug>` e `/totem/<slug>` e o QR Code: só letras minúsculas, números e hífen. Não se repete entre setores. Mudá-lo invalida os QR Codes já impressos.
                         * @example pronto-atendimento
                         */
                        slug: string;
                        /**
                         * @description Opcional, até 120 caracteres. Vazia, só com espaços ou `null`, é gravada como `null`.
                         * @example Urgência e emergência, 24 horas
                         */
                        descricao?: string | null;
                    };
                };
            };
            responses: {
                /** @description Setor criado. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 1,
                         *         "nome": "Pronto Atendimento",
                         *         "slug": "pronto-atendimento",
                         *         "descricao": "Urgência e emergência, 24 horas",
                         *         "ativo": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Setor"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 caracteres (em `nome`) ou slug fora do formato (em `slug`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "slug",
                         *             "mensagem": "Use só letras minúsculas, números e hífen, sem espaços"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `setores:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: o slug já é de outro setor. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Já existe um setor com este endereço. Escolha outro.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/setores/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Edita nome, slug ou descrição
         * @description Só os campos enviados mudam. Mudar o slug muda os links da pesquisa e do totem, e os QR Codes já impressos deixam de abrir a pesquisa.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 2 a 100 caracteres; os espaços das pontas saem.
                         * @example Pronto Atendimento
                         */
                        nome?: string;
                        /**
                         * @description Endereço do setor, que forma os links `/s/<slug>` e `/totem/<slug>` e o QR Code: só letras minúsculas, números e hífen. Não se repete entre setores. Mudá-lo invalida os QR Codes já impressos.
                         * @example pronto-atendimento
                         */
                        slug?: string;
                        /**
                         * @description Opcional, até 120 caracteres. Vazia, só com espaços ou `null`, é gravada como `null`.
                         * @example Urgência e emergência, 24 horas
                         */
                        descricao?: string | null;
                    };
                };
            };
            responses: {
                /** @description Setor editado. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 1,
                         *         "nome": "Pronto Atendimento",
                         *         "slug": "pronto-atendimento",
                         *         "descricao": "Urgência e emergência, 24 horas",
                         *         "ativo": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Setor"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 caracteres (em `nome`), slug fora do formato (em `slug`) ou nenhum campo para mudar. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "nome",
                         *             "mensagem": "Informe o nome do setor"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `setores:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Setor não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: o slug já é de outro setor. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Já existe um setor com este endereço. Escolha outro.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/setores/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Ativa ou desativa um setor
         * @description Nada é apagado. O setor inativo sai da pesquisa pública, mas as respostas dele continuam nos indicadores, e ele continua na lista de setores do painel.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description `true` ativa o setor; `false` o desativa. */
                        ativo: boolean;
                    };
                };
            };
            responses: {
                /** @description Situação do setor atualizada. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "ativo",
                         *             "mensagem": "Obrigatório"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `setores:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Setor não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/categorias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Categorias, na ordem
         * @description Ativas e inativas, na ordem definida e sem paginação. As categorias valem para todos os setores: qualquer perfil logado recebe a lista inteira.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description As categorias, na ordem. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 1,
                         *           "nome": "Recepção",
                         *           "ordem": 1,
                         *           "ativa": true
                         *         },
                         *         {
                         *           "id": 2,
                         *           "nome": "Triagem",
                         *           "ordem": 2,
                         *           "ativa": true
                         *         },
                         *         {
                         *           "id": 7,
                         *           "nome": "Tempo de Espera",
                         *           "ordem": 3,
                         *           "ativa": false
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Categoria"][];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: com a senha provisória, até a troca. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Troque a senha provisória para continuar.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Cria uma categoria
         * @description A categoria nasce ativa e entra no fim da ordem.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 2 a 100 caracteres; os espaços das pontas saem. Não se repete entre as categorias, nem com maiúsculas diferentes ("Recepção" e "RECEPÇÃO" são a mesma).
                         * @example Recepção
                         */
                        nome: string;
                    };
                };
            };
            responses: {
                /** @description Categoria criada. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 8,
                         *         "nome": "Farmácia",
                         *         "ordem": 8,
                         *         "ativa": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Categoria"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 caracteres (em `nome`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "nome",
                         *             "mensagem": "Informe o nome da categoria"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `categorias:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: o nome já é de outra categoria, mesmo com maiúsculas diferentes. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Já existe uma categoria com este nome.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/categorias/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Edita, ativa ou desativa uma categoria
         * @description Muda o nome, a situação ou os dois; a ordem não muda. Nada é apagado: as perguntas e as respostas da categoria inativa continuam.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 2 a 100 caracteres; os espaços das pontas saem. Não se repete entre as categorias, nem com maiúsculas diferentes ("Recepção" e "RECEPÇÃO" são a mesma).
                         * @example Recepção
                         */
                        nome?: string;
                        /** @description `true` ativa a categoria; `false` a desativa. */
                        ativa?: boolean;
                    };
                };
            };
            responses: {
                /** @description Categoria editada. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 1,
                         *         "nome": "Recepção",
                         *         "ordem": 1,
                         *         "ativa": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Categoria"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 caracteres (em `nome`), `ativa` que não é booleano ou nada para mudar. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "nome",
                         *             "mensagem": "Informe o nome da categoria"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `categorias:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe categoria com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Categoria não encontrada.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: o nome já é de outra categoria, mesmo com maiúsculas diferentes. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Já existe uma categoria com este nome.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/turnos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Turnos, na ordem
         * @description Todos os turnos, na ordem definida e sem paginação. Qualquer perfil logado recebe a lista inteira.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os turnos, na ordem. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 1,
                         *           "nome": "Manhã",
                         *           "horaInicio": "07:00",
                         *           "horaFim": "13:00",
                         *           "ordem": 1
                         *         },
                         *         {
                         *           "id": 2,
                         *           "nome": "Tarde",
                         *           "horaInicio": "13:00",
                         *           "horaFim": "19:00",
                         *           "ordem": 2
                         *         },
                         *         {
                         *           "id": 3,
                         *           "nome": "Noite",
                         *           "horaInicio": "19:00",
                         *           "horaFim": "07:00",
                         *           "ordem": 3
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Turno"][];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: com a senha provisória, até a troca. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Troque a senha provisória para continuar.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Cria um turno
         * @description O turno entra no fim da ordem. O fim pode ser menor que o início, no turno que passa da meia-noite.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 2 a 100 caracteres; os espaços das pontas saem.
                         * @example Manhã
                         */
                        nome: string;
                        /**
                         * @description Início, em HH:mm, de 00:00 a 23:59.
                         * @example 19:00
                         */
                        horaInicio: string;
                        /**
                         * @description Fim, em HH:mm, de 00:00 a 23:59, diferente do início. Menor que o início no turno que passa da meia-noite, como o das 19:00 às 07:00.
                         * @example 07:00
                         */
                        horaFim: string;
                    };
                };
            };
            responses: {
                /** @description Turno criado. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 3,
                         *         "nome": "Noite",
                         *         "horaInicio": "19:00",
                         *         "horaFim": "07:00",
                         *         "ordem": 3
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Turno"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 caracteres (em `nome`), hora fora do formato HH:mm (em `horaInicio` ou `horaFim`) ou fim igual ao início (em `horaFim`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "horaFim",
                         *             "mensagem": "O fim precisa ser diferente do início"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `turnos:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/turnos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Edita o nome e os horários de um turno
         * @description Recebe o turno inteiro: o nome e os dois horários. A ordem não muda. Turnos não são desativados nem apagados.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 2 a 100 caracteres; os espaços das pontas saem.
                         * @example Manhã
                         */
                        nome: string;
                        /**
                         * @description Início, em HH:mm, de 00:00 a 23:59.
                         * @example 19:00
                         */
                        horaInicio: string;
                        /**
                         * @description Fim, em HH:mm, de 00:00 a 23:59, diferente do início. Menor que o início no turno que passa da meia-noite, como o das 19:00 às 07:00.
                         * @example 07:00
                         */
                        horaFim: string;
                    };
                };
            };
            responses: {
                /** @description Turno editado. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 3,
                         *         "nome": "Noite",
                         *         "horaInicio": "19:00",
                         *         "horaFim": "07:00",
                         *         "ordem": 3
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Turno"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 caracteres (em `nome`), hora fora do formato HH:mm (em `horaInicio` ou `horaFim`) ou fim igual ao início (em `horaFim`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "horaFim",
                         *             "mensagem": "O fim precisa ser diferente do início"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `turnos:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe turno com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Turno não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/setores/{setorId}/perguntas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Perguntas do setor, na ordem
         * @description Ativas e inativas, na ordem da pesquisa e sem paginação. O Gestor só lê as dos seus setores; o Super Admin, as de qualquer um.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    setorId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description As perguntas do setor, na ordem. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 12,
                         *           "setorId": 1,
                         *           "categoriaId": 1,
                         *           "texto": "Como foi o atendimento na recepção?",
                         *           "tipo": "ESCALA_1_5",
                         *           "opcoes": null,
                         *           "ordem": 1,
                         *           "ativa": true,
                         *           "temRespostas": true
                         *         },
                         *         {
                         *           "id": 13,
                         *           "setorId": 1,
                         *           "categoriaId": 4,
                         *           "texto": "Você recebeu as orientações sobre o exame?",
                         *           "tipo": "MULTIPLA_ESCOLHA",
                         *           "opcoes": [
                         *             "Sim, e entendi tudo",
                         *             "Sim, mas fiquei com dúvidas",
                         *             "Não"
                         *           ],
                         *           "ordem": 2,
                         *           "ativa": true,
                         *           "temRespostas": false
                         *         },
                         *         {
                         *           "id": 14,
                         *           "setorId": 1,
                         *           "categoriaId": 7,
                         *           "texto": "O tempo de espera foi informado?",
                         *           "tipo": "SIM_NAO",
                         *           "opcoes": null,
                         *           "ordem": 3,
                         *           "ativa": false,
                         *           "temRespostas": true
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Pergunta"][];
                        };
                    };
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "contato.telefone",
                         *             "mensagem": "Telefone com DDD, só números"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `perguntas:gerenciar` (Super Admin e Gestor a têm), num setor que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Setor não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Cria uma pergunta no setor
         * @description A pergunta nasce ativa e entra no fim da ordem do setor. A criação vai para a auditoria.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    setorId: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 5 a 140 caracteres; os espaços das pontas saem.
                         * @example Como foi o atendimento na recepção?
                         */
                        texto: string;
                        /**
                         * @description Uma categoria ativa. Na edição, vale também a categoria que a pergunta já tem, mesmo desativada.
                         * @example 1
                         */
                        categoriaId: number;
                        tipo: components["schemas"]["TipoPergunta"];
                        /**
                         * @description Só na múltipla escolha, e nela obrigatórias: de 2 a 5 opções, cada uma com até 80 caracteres, sem repetir (nem com maiúsculas diferentes); os espaços das pontas saem. Nos outros tipos, `null`, a lista vazia ou nada.
                         * @example [
                         *       "Sim, e entendi tudo",
                         *       "Sim, mas fiquei com dúvidas",
                         *       "Não"
                         *     ]
                         */
                        opcoes?: string[] | null;
                    };
                };
            };
            responses: {
                /** @description Pergunta criada. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 15,
                         *         "setorId": 1,
                         *         "categoriaId": 4,
                         *         "texto": "Você recebeu as orientações sobre o exame?",
                         *         "tipo": "MULTIPLA_ESCOLHA",
                         *         "opcoes": [
                         *           "Sim, e entendi tudo",
                         *           "Sim, mas fiquei com dúvidas",
                         *           "Não"
                         *         ],
                         *         "ordem": 4,
                         *         "ativa": true,
                         *         "temRespostas": false
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Pergunta"];
                        };
                    };
                };
                /** @description `VALIDACAO`: texto fora de 5 a 140 caracteres (em `texto`), categoria inexistente ou desativada (em `categoriaId`), tipo desconhecido (em `tipo`) ou opções erradas para o tipo (em `opcoes`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "opcoes",
                         *             "mensagem": "As opções não podem se repetir"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `perguntas:gerenciar` (Super Admin e Gestor a têm), num setor que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Setor não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/setores/{setorId}/perguntas/ordem": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Salva a nova ordem das perguntas do setor
         * @description Recebe os IDs de todas as perguntas do setor, ativas e inativas, na ordem nova. A mudança vai para a auditoria, com a ordem de antes e a de depois.
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    setorId: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Os IDs de todas as perguntas do setor, ativas e inativas, na nova ordem: a primeira da lista fica na posição 1.
                         * @example [
                         *       13,
                         *       12,
                         *       14
                         *     ]
                         */
                        ids: number[];
                    };
                };
            };
            responses: {
                /** @description Ordem salva. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: a lista não tem todas as perguntas do setor, uma vez cada, e só elas (em `ids`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "ids",
                         *             "mensagem": "A lista precisa ter todas as perguntas do setor"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `perguntas:gerenciar` (Super Admin e Gestor a têm), num setor que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe setor com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Setor não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/perguntas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Edita o texto, a categoria, o tipo e as opções
         * @description Recebe a pergunta inteira, como na criação; a ordem e a situação não mudam. As respostas antigas guardam o texto que o paciente leu. Uma pergunta que já tem respostas não muda de tipo. A edição vai para a auditoria, com o antes e o depois.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 5 a 140 caracteres; os espaços das pontas saem.
                         * @example Como foi o atendimento na recepção?
                         */
                        texto: string;
                        /**
                         * @description Uma categoria ativa. Na edição, vale também a categoria que a pergunta já tem, mesmo desativada.
                         * @example 1
                         */
                        categoriaId: number;
                        tipo: components["schemas"]["TipoPergunta"];
                        /**
                         * @description Só na múltipla escolha, e nela obrigatórias: de 2 a 5 opções, cada uma com até 80 caracteres, sem repetir (nem com maiúsculas diferentes); os espaços das pontas saem. Nos outros tipos, `null`, a lista vazia ou nada.
                         * @example [
                         *       "Sim, e entendi tudo",
                         *       "Sim, mas fiquei com dúvidas",
                         *       "Não"
                         *     ]
                         */
                        opcoes?: string[] | null;
                    };
                };
            };
            responses: {
                /** @description Pergunta editada. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 12,
                         *         "setorId": 1,
                         *         "categoriaId": 1,
                         *         "texto": "Como foi o atendimento na recepção?",
                         *         "tipo": "ESCALA_1_5",
                         *         "opcoes": null,
                         *         "ordem": 1,
                         *         "ativa": true,
                         *         "temRespostas": true
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Pergunta"];
                        };
                    };
                };
                /** @description `VALIDACAO`: texto fora de 5 a 140 caracteres (em `texto`), categoria inexistente ou desativada (em `categoriaId`), tipo desconhecido (em `tipo`) ou opções erradas para o tipo (em `opcoes`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "opcoes",
                         *             "mensagem": "As opções não podem se repetir"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `perguntas:gerenciar` (Super Admin e Gestor a têm), num setor que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe pergunta com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Pergunta não encontrada.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: a pergunta já tem respostas e o tipo mudou. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Esta pergunta já tem respostas, então o tipo não pode mudar. Crie outra pergunta e desative esta.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/perguntas/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Ativa ou desativa uma pergunta
         * @description Nada é apagado: a pergunta inativa sai da pesquisa, e as respostas dela continuam nos indicadores. A mudança vai para a auditoria.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description `true` ativa a pergunta, que volta à pesquisa; `false` a desativa. */
                        ativa: boolean;
                    };
                };
            };
            responses: {
                /** @description Situação da pergunta atualizada. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "ativa",
                         *             "mensagem": "Obrigatório"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `perguntas:gerenciar` (Super Admin e Gestor a têm), num setor que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe pergunta com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Pergunta não encontrada.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/usuarios": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Contas do painel
         * @description Ativas e inativas, em ordem alfabética e sem paginação.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description As contas, em ordem alfabética. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 7,
                         *           "nome": "Ana Souza",
                         *           "email": "ana.souza@hospital.com.br",
                         *           "perfil": "GESTOR",
                         *           "ativo": true,
                         *           "trocarSenha": false,
                         *           "setorIds": [
                         *             1,
                         *             4
                         *           ],
                         *           "ultimoLoginEm": "2026-11-20T11:42:05.120Z"
                         *         },
                         *         {
                         *           "id": 9,
                         *           "nome": "Bruno Lima",
                         *           "email": "bruno.lima@hospital.com.br",
                         *           "perfil": "OUVIDORIA",
                         *           "ativo": true,
                         *           "trocarSenha": true,
                         *           "setorIds": [],
                         *           "ultimoLoginEm": null
                         *         },
                         *         {
                         *           "id": 3,
                         *           "nome": "Carla Mendes",
                         *           "email": "carla.mendes@hospital.com.br",
                         *           "perfil": "VISUALIZADOR",
                         *           "ativo": false,
                         *           "trocarSenha": false,
                         *           "setorIds": [
                         *             2
                         *           ],
                         *           "ultimoLoginEm": "2026-10-02T19:03:44.981Z"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Usuario"][];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `usuarios:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Cria uma conta com senha provisória
         * @description A conta nasce ativa, sem setores e com a troca de senha obrigatória no primeiro acesso. A senha provisória só aparece nesta resposta, que não fica em cache (`Cache-Control: no-store`). Os setores são definidos em `PUT /usuarios/{id}/setores`. A criação vai para a auditoria, sem a senha.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 3 a 100 caracteres; os espaços das pontas saem.
                         * @example Ana Souza
                         */
                        nome: string;
                        /**
                         * Format: email
                         * @description Gravado em minúsculas. Não se repete entre os usuários e não muda depois.
                         * @example ana.souza@hospital.com.br
                         */
                        email: string;
                        perfil: components["schemas"]["Perfil"];
                    };
                };
            };
            responses: {
                /** @description Conta criada. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "usuario": {
                         *           "id": 7,
                         *           "nome": "Ana Souza",
                         *           "email": "ana.souza@hospital.com.br",
                         *           "perfil": "GESTOR",
                         *           "ativo": true,
                         *           "trocarSenha": true,
                         *           "setorIds": [],
                         *           "ultimoLoginEm": null
                         *         },
                         *         "senhaProvisoria": "Kp7m-Qx3r-Tz9w"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: {
                                usuario: components["schemas"]["Usuario"];
                                /**
                                 * @description Gerada pela API e mostrada só nesta resposta: o banco guarda o hash. Segue a regra de senha, e a troca é obrigatória no primeiro acesso.
                                 * @example Kp7m-Qx3r-Tz9w
                                 */
                                senhaProvisoria: string;
                            };
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 3 caracteres (em `nome`), e-mail inválido (em `email`) ou perfil desconhecido (em `perfil`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "email",
                         *             "mensagem": "Digite um e-mail válido, como nome@hospital.com.br"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `usuarios:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: o e-mail já é de outra conta. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Já existe um usuário com este e-mail.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/usuarios/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Edita o nome e o perfil
         * @description Só os campos enviados mudam; o e-mail não muda. O perfil novo vale na hora, sem esperar o token vencer. A mudança de perfil vai para a auditoria, com o antes e o depois.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description De 3 a 100 caracteres; os espaços das pontas saem.
                         * @example Ana Souza
                         */
                        nome?: string;
                        perfil?: components["schemas"]["Perfil"];
                    };
                };
            };
            responses: {
                /** @description Conta editada. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 7,
                         *         "nome": "Ana Souza",
                         *         "email": "ana.souza@hospital.com.br",
                         *         "perfil": "GESTOR",
                         *         "ativo": true,
                         *         "trocarSenha": false,
                         *         "setorIds": [
                         *           1,
                         *           4
                         *         ],
                         *         "ultimoLoginEm": "2026-11-20T11:42:05.120Z"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Usuario"];
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 3 caracteres (em `nome`), perfil desconhecido (em `perfil`) ou nada para mudar. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "nome",
                         *             "mensagem": "Informe o nome completo"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `usuarios:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe usuário com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Usuário não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: a pessoa tenta mudar o próprio perfil. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Você não pode mudar o próprio perfil.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/usuarios/{id}/setores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Define os setores da pessoa
         * @description A lista substitui os setores de antes. O escopo novo vale na hora. A mudança vai para a auditoria, com o antes e o depois.
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Todos os setores da pessoa, que substituem os de antes; a lista vazia tira todos. Repetidos contam uma vez, e setores inativos valem.
                         * @example [
                         *       1,
                         *       4
                         *     ]
                         */
                        setorIds: number[];
                    };
                };
            };
            responses: {
                /** @description Setores definidos. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: algum setor não existe (em `setorIds`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "setorIds",
                         *             "mensagem": "Um dos setores escolhidos não existe."
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `usuarios:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe usuário com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Usuário não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/usuarios/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Ativa ou desativa uma conta
         * @description Nada é apagado. Desativar derruba na hora todas as sessões da pessoa, que não entra mais até ser ativada de novo. A mudança vai para a auditoria.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description `true` ativa a conta; `false` a desativa e derruba as sessões. */
                        ativo: boolean;
                    };
                };
            };
            responses: {
                /** @description Situação da conta atualizada. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "ativo",
                         *             "mensagem": "Obrigatório"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `usuarios:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe usuário com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Usuário não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `CONFLITO`: a pessoa tenta desativar a própria conta. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "CONFLITO",
                         *         "mensagem": "Você não pode desativar a própria conta.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/usuarios/{id}/redefinir-senha": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Gera outra senha provisória
         * @description Para quem esqueceu a senha: a senha de antes deixa de valer, a troca passa a ser obrigatória no próximo acesso e as sessões da pessoa caem. A senha nova só aparece nesta resposta, que não fica em cache. A redefinição vai para a auditoria, sem a senha.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Senha redefinida. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "senhaProvisoria": "Wr4t-hN8c-Zm2p"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: {
                                /**
                                 * @description Gerada pela API e mostrada só nesta resposta: o banco guarda o hash. Segue a regra de senha, e a troca é obrigatória no primeiro acesso.
                                 * @example Kp7m-Qx3r-Tz9w
                                 */
                                senhaProvisoria: string;
                            };
                        };
                    };
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "contato.telefone",
                         *             "mensagem": "Telefone com DDD, só números"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `usuarios:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe usuário com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Usuário não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/respostas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Avaliações uma a uma, com filtros e ordenação
         * @description Os filtros do painel são todos opcionais aqui: sem `inicio` ou sem `fim`, o período fica aberto daquele lado, e sem `base` vale o dia do atendimento. Além deles, a classificação e se a avaliação tem comentário ou pedido de retorno. 20 por página se o pedido não disser outro número; `meta.total` conta todas as páginas. Sem `ordenarPor` e `ordem`, do envio mais recente para o mais antigo. O telefone nunca aparece na lista. Exige `respostas:ver`: o Super Admin, o Gestor e a Ouvidoria; o Visualizador não tem. Super Admin e Ouvidoria veem todos os setores; o Gestor, só os seus.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio?: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim?: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base?: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                    /** @description A pior entre a do NPS e a de cada nota de 1 a 5, com os limites das configurações (no padrão, NPS até 6 é baixa e até 2 é baixíssima; nota até 3 é baixa e 1 é baixíssima). O front escolhe a próxima tela por ela. */
                    classificacao?: components["schemas"]["Classificacao"];
                    /** @description `true`: só as avaliações com comentário; `false`: só as sem. Sem ele, todas. */
                    comComentario?: boolean;
                    /** @description `true`: só as avaliações com pedido de retorno; `false`: só as sem. Sem ele, todas. */
                    comRetorno?: boolean;
                    pagina?: number;
                    porPagina?: number;
                    /** @description O dia do atendimento, o instante do envio ou o NPS. No empate, a de ID maior primeiro na ordem `desc` e a de ID menor na `asc`. */
                    ordenarPor?: "dataAtendimento" | "enviadoEm" | "nps";
                    /** @description `asc`, do menor para o maior; `desc`, do maior para o menor. */
                    ordem?: "asc" | "desc";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description As avaliações da página. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 845,
                         *           "setorId": 1,
                         *           "setor": "Pronto Atendimento",
                         *           "canal": "TOTEM",
                         *           "dataAtendimento": "2026-11-10",
                         *           "turno": "Manhã",
                         *           "nps": 3,
                         *           "classificacao": "BAIXA",
                         *           "enviadoEm": "2026-11-10T14:22:00.000Z",
                         *           "temComentario": true,
                         *           "pediuRetorno": true
                         *         },
                         *         {
                         *           "id": 844,
                         *           "setorId": 3,
                         *           "setor": "Pediatria",
                         *           "canal": "WEB",
                         *           "dataAtendimento": "2026-11-09",
                         *           "turno": "Tarde",
                         *           "nps": 10,
                         *           "classificacao": "NORMAL",
                         *           "enviadoEm": "2026-11-10T12:05:00.000Z",
                         *           "temComentario": false,
                         *           "pediuRetorno": false
                         *         }
                         *       ],
                         *       "meta": {
                         *         "pagina": 1,
                         *         "porPagina": 20,
                         *         "total": 134
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["RespostaResumo"][];
                            meta: components["schemas"]["Meta"];
                        };
                    };
                };
                /** @description `VALIDACAO`: data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId`, `canal`, `classificacao`, `comComentario`, `comRetorno`, `pagina`, `porPagina` (de 1 a 100), `ordenarPor` ou `ordem` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `respostas:ver` (o Visualizador não a tem), num `setorId` que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/respostas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Uma avaliação inteira
         * @description O resumo da lista, as perguntas como o paciente as viu (o texto, a categoria e o tipo do momento da resposta), a nota de cada uma, o comentário e o pedido de retorno. Cada nota de 1 a 5 vem classificada com os limites de agora. O telefone vem mascarado, com os 4 últimos dígitos; o número completo só sai em `POST /contatos/{id}/revelar-telefone`, com `contatos:ver`. Exige `respostas:ver`: o Super Admin, o Gestor e a Ouvidoria; o Visualizador não tem. Super Admin e Ouvidoria veem todos os setores; o Gestor, só os seus.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description A avaliação. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "id": 845,
                         *         "setorId": 1,
                         *         "setor": "Pronto Atendimento",
                         *         "canal": "TOTEM",
                         *         "dataAtendimento": "2026-11-10",
                         *         "turno": "Manhã",
                         *         "nps": 3,
                         *         "classificacao": "BAIXA",
                         *         "enviadoEm": "2026-11-10T14:22:00.000Z",
                         *         "temComentario": true,
                         *         "pediuRetorno": true,
                         *         "itens": [
                         *           {
                         *             "perguntaId": 12,
                         *             "perguntaTexto": "Como você avalia o atendimento na recepção?",
                         *             "categoria": "Recepção",
                         *             "tipo": "ESCALA_1_5",
                         *             "valorNumero": 2,
                         *             "valorTexto": null,
                         *             "classificacao": "BAIXA"
                         *           },
                         *           {
                         *             "perguntaId": 13,
                         *             "perguntaTexto": "Você foi chamado pelo nome?",
                         *             "categoria": "Triagem",
                         *             "tipo": "SIM_NAO",
                         *             "valorNumero": null,
                         *             "valorTexto": "NAO",
                         *             "classificacao": null
                         *           }
                         *         ],
                         *         "comentario": {
                         *           "tipo": "RECLAMACAO",
                         *           "texto": "Esperei mais de duas horas sem nenhuma informação."
                         *         },
                         *         "contato": {
                         *           "id": 31,
                         *           "telefoneMascarado": "•••• 0042",
                         *           "status": "NOVO"
                         *         }
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["RespostaDetalhe"];
                        };
                    };
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "contato.telefone",
                         *             "mensagem": "Telefone com DDD, só números"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `respostas:ver` (o Visualizador não a tem), numa resposta de um setor que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: a resposta não existe. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Resposta não encontrada.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/contatos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Pacientes que pediram retorno
         * @description Os pedidos de retorno, do consentimento mais recente para o mais antigo, com o telefone mascarado. O período (`inicio` e `fim`, incluídos e opcionais) é comparado com a `base`, como no painel: o dia do atendimento, se o pedido não disser outra coisa, ou o dia do envio em Brasília. 20 por página se o pedido não disser outro número; `meta.total` conta todas as páginas. Exige `contatos:ver`.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio?: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim?: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base?: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    pagina?: number;
                    porPagina?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os pedidos da página. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 31,
                         *           "respostaId": 845,
                         *           "setor": "Pronto Atendimento",
                         *           "dataAtendimento": "2026-11-10",
                         *           "nps": 3,
                         *           "classificacao": "BAIXA",
                         *           "comentario": {
                         *             "tipo": "RECLAMACAO",
                         *             "texto": "Esperei mais de duas horas sem nenhuma informação."
                         *           },
                         *           "telefoneMascarado": "•••• 0042",
                         *           "consentimentoEm": "2026-11-10T14:23:10.000Z",
                         *           "status": "NOVO"
                         *         },
                         *         {
                         *           "id": 30,
                         *           "respostaId": 838,
                         *           "setor": "Ambulatório",
                         *           "dataAtendimento": "2026-11-09",
                         *           "nps": 1,
                         *           "classificacao": "BAIXISSIMA",
                         *           "comentario": null,
                         *           "telefoneMascarado": "•••• 7788",
                         *           "consentimentoEm": "2026-11-09T18:40:02.000Z",
                         *           "status": "NOVO"
                         *         }
                         *       ],
                         *       "meta": {
                         *         "pagina": 1,
                         *         "porPagina": 20,
                         *         "total": 2
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["PedidoRetorno"][];
                            meta: components["schemas"]["Meta"];
                        };
                    };
                };
                /** @description `VALIDACAO`: data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `pagina` ou `porPagina` (de 1 a 100) fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `contatos:ver` (só o Super Admin e a Ouvidoria a têm; o Gestor e o Visualizador, não) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/contatos/{id}/revelar-telefone": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mostra o número completo, para ligar
         * @description Decifra o telefone do pedido e registra na auditoria quem o viu e quando (`revelacao_de_telefone`), a cada vez que é chamado. A resposta não fica em cache (`Cache-Control: no-store`). Sem corpo. Exige `contatos:ver`.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description O número completo. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "telefone": "51999990042"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: {
                                /**
                                 * @description O número completo, só os dígitos, com o DDD (10 ou 11 dígitos).
                                 * @example 51999990042
                                 */
                                telefone: string;
                            };
                        };
                    };
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "contato.telefone",
                         *             "mensagem": "Telefone com DDD, só números"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `contatos:ver` (só o Super Admin e a Ouvidoria a têm; o Gestor e o Visualizador, não) ou com a senha provisória, ou num pedido de um setor que não é da pessoa. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: o pedido não existe. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Pedido de retorno não encontrado.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/resumo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * NPS, respostas, promotores, neutros, detratores e notas baixas
         * @description Os cartões do topo do painel. Os filtros são os mesmos em todos os blocos: o período (`inicio` e `fim`, incluídos) comparado com a `base` (o dia do atendimento ou o dia do envio em Brasília), o setor, o turno e o canal. Super Admin e Ouvidoria veem todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor. Sem respostas, `nps` e `mediaEscala` vêm `null` e as contagens, 0.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os números do período. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "nps": 42,
                         *         "total": 134,
                         *         "promotores": 78,
                         *         "neutros": 34,
                         *         "detratores": 22,
                         *         "notasBaixas": 25,
                         *         "baixissimas": 6,
                         *         "mediaEscala": 4.3
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Resumo"];
                        };
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: o Gestor ou o Visualizador pediu um `setorId` que não é seu, ou a pessoa está com a senha provisória. Os quatro perfis têm `dashboard:ver`. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/nps-por-setor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * NPS de cada setor, do maior para o menor
         * @description Só os setores com respostas no período, também os desativados; a lista vazia quando nenhum teve. No empate do NPS, vem antes o setor com mais respostas e, depois, a ordem alfabética. Os filtros são os mesmos em todos os blocos: o período (`inicio` e `fim`, incluídos) comparado com a `base` (o dia do atendimento ou o dia do envio em Brasília), o setor, o turno e o canal. Super Admin e Ouvidoria veem todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description O NPS de cada setor. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "setorId": 3,
                         *           "setor": "Pediatria",
                         *           "nps": 71,
                         *           "total": 28
                         *         },
                         *         {
                         *           "setorId": 1,
                         *           "setor": "Pronto Atendimento",
                         *           "nps": 38,
                         *           "total": 81
                         *         },
                         *         {
                         *           "setorId": 2,
                         *           "setor": "Ambulatório",
                         *           "nps": -4,
                         *           "total": 25
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["NpsSetor"][];
                        };
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: o Gestor ou o Visualizador pediu um `setorId` que não é seu, ou a pessoa está com a senha provisória. Os quatro perfis têm `dashboard:ver`. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/evolucao": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * NPS por dia, semana ou mês
         * @description Um ponto por período, do que contém o `inicio` ao que contém o `fim`, em ordem, inclusive os sem resposta (`nps` `null` e `total` 0). O `periodo` é o primeiro dia: o próprio dia, a segunda-feira da semana ou o dia 1 do mês, mesmo antes do `inicio`; só contam as respostas de `inicio` a `fim`. No máximo 366 pontos. Os filtros são os mesmos em todos os blocos: o período (`inicio` e `fim`, incluídos) comparado com a `base` (o dia do atendimento ou o dia do envio em Brasília), o setor, o turno e o canal. Super Admin e Ouvidoria veem todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                    /** @description Um ponto por dia, por semana (de segunda a domingo) ou por mês. */
                    granularidade: components["schemas"]["Granularidade"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os pontos da evolução. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "periodo": "2026-10-26",
                         *           "nps": 35,
                         *           "total": 20
                         *         },
                         *         {
                         *           "periodo": "2026-11-02",
                         *           "nps": 48,
                         *           "total": 41
                         *         },
                         *         {
                         *           "periodo": "2026-11-09",
                         *           "nps": null,
                         *           "total": 0
                         *         },
                         *         {
                         *           "periodo": "2026-11-16",
                         *           "nps": 40,
                         *           "total": 37
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["PontoEvolucao"][];
                        };
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos; ou `granularidade` ausente, fora dos valores aceitos ou com mais de 366 pontos no período (em `granularidade`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "granularidade",
                         *             "mensagem": "Escolha um período de até 366 dias ou veja por semana ou por mês"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: o Gestor ou o Visualizador pediu um `setorId` que não é seu, ou a pessoa está com a senha provisória. Os quatro perfis têm `dashboard:ver`. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/categorias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Média e % de notas 4 e 5 de cada categoria
         * @description As notas de 1 a 5 de cada categoria, somando os setores, na ordem das categorias. Só vêm as categorias com notas no período, também as desativadas; a categoria de cada nota é a da pergunta no momento da resposta. Os filtros são os mesmos em todos os blocos: o período (`inicio` e `fim`, incluídos) comparado com a `base` (o dia do atendimento ou o dia do envio em Brasília), o setor, o turno e o canal. Super Admin e Ouvidoria veem todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description As notas de cada categoria. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "categoriaId": 1,
                         *           "categoria": "Recepção",
                         *           "media": 4.4,
                         *           "percentual45": 86,
                         *           "total": 212
                         *         },
                         *         {
                         *           "categoriaId": 2,
                         *           "categoria": "Tempo de espera",
                         *           "media": 3.1,
                         *           "percentual45": 41,
                         *           "total": 198
                         *         },
                         *         {
                         *           "categoriaId": 4,
                         *           "categoria": "Limpeza",
                         *           "media": 4.6,
                         *           "percentual45": 91,
                         *           "total": 150
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["IndicadorCategoria"][];
                        };
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: o Gestor ou o Visualizador pediu um `setorId` que não é seu, ou a pessoa está com a senha provisória. Os quatro perfis têm `dashboard:ver`. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/ranking": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Melhores e piores pontos (setor e categoria)
         * @description Até 3 pontos em cada lista, só os com 5 notas de 1 a 5 ou mais no período. A ordem é a da média, depois a do % de notas 4 e 5 e, no empate, a do ponto com mais notas. Os piores saem dos que não estão nos melhores, então nenhum ponto aparece nas duas listas, e com poucos pontos a lista dos piores fica curta ou vazia. Os filtros são os mesmos em todos os blocos: o período (`inicio` e `fim`, incluídos) comparado com a `base` (o dia do atendimento ou o dia do envio em Brasília), o setor, o turno e o canal. Super Admin e Ouvidoria veem todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os melhores e os piores pontos. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "melhores": [
                         *           {
                         *             "setorId": 3,
                         *             "setor": "Pediatria",
                         *             "categoriaId": 4,
                         *             "categoria": "Limpeza",
                         *             "media": 4.8,
                         *             "percentual45": 96,
                         *             "total": 25
                         *           },
                         *           {
                         *             "setorId": 1,
                         *             "setor": "Pronto Atendimento",
                         *             "categoriaId": 1,
                         *             "categoria": "Recepção",
                         *             "media": 4.5,
                         *             "percentual45": 90,
                         *             "total": 61
                         *           }
                         *         ],
                         *         "piores": [
                         *           {
                         *             "setorId": 1,
                         *             "setor": "Pronto Atendimento",
                         *             "categoriaId": 2,
                         *             "categoria": "Tempo de espera",
                         *             "media": 2.6,
                         *             "percentual45": 22,
                         *             "total": 58
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["Ranking"];
                        };
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: o Gestor ou o Visualizador pediu um `setorId` que não é seu, ou a pessoa está com a senha provisória. Os quatro perfis têm `dashboard:ver`. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/dashboard/comentarios": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Comentários recentes
         * @description Os comentários deixados depois das avaliações do período, do envio mais recente para o mais antigo, 8 por página se o pedido não disser outro número; `meta.total` conta todas as páginas. O `tipo` mostra só elogios, reclamações, sugestões ou outros. Exige também `comentarios:ver`, que o Visualizador não tem. Os filtros são os mesmos em todos os blocos: o período (`inicio` e `fim`, incluídos) comparado com a `base` (o dia do atendimento ou o dia do envio em Brasília), o setor, o turno e o canal. Super Admin e Ouvidoria veem todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                    tipo?: components["schemas"]["TipoComentario"];
                    pagina?: number;
                    porPagina?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os comentários da página. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 91,
                         *           "respostaId": 845,
                         *           "tipo": "ELOGIO",
                         *           "texto": "A equipe da recepção foi muito atenciosa com a minha mãe.",
                         *           "setor": "Pronto Atendimento",
                         *           "dataAtendimento": "2026-11-10",
                         *           "enviadoEm": "2026-11-10T14:22:00.000Z",
                         *           "classificacao": "NORMAL"
                         *         },
                         *         {
                         *           "id": 90,
                         *           "respostaId": 842,
                         *           "tipo": "RECLAMACAO",
                         *           "texto": "Esperei mais de duas horas sem nenhuma informação.",
                         *           "setor": "Pronto Atendimento",
                         *           "dataAtendimento": "2026-11-10",
                         *           "enviadoEm": "2026-11-10T13:05:00.000Z",
                         *           "classificacao": "BAIXA"
                         *         }
                         *       ],
                         *       "meta": {
                         *         "pagina": 1,
                         *         "porPagina": 8,
                         *         "total": 2
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["ComentarioRecente"][];
                            meta: components["schemas"]["Meta"];
                        };
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos; ou `tipo`, `pagina` ou `porPagina` fora dos valores aceitos (`porPagina` de 1 a 100). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "tipo",
                         *             "mensagem": "Escolha o tipo do comentário"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `comentarios:ver` (o Visualizador não a tem), num `setorId` que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exportacoes/resumo.xlsx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resumo dos indicadores em Excel
         * @description Uma aba, Resumo: quem gerou e quando, os filtros aplicados, os números de `/dashboard/resumo`, o NPS por setor de `/dashboard/nps-por-setor` e as médias por categoria de `/dashboard/categorias`, com os mesmos filtros. Os quatro perfis têm `exportacao:resumo`. Os filtros e o escopo são os do dashboard: o período (`inicio` e `fim`, incluídos) comparado com a `base`, o setor, o turno e o canal. Super Admin e Ouvidoria exportam todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor. O arquivo é gerado na hora e enviado em streaming, com o nome no `Content-Disposition`, os cabeçalhos em português e as datas e os números como data e número, no formato brasileiro. Um erro antes de o arquivo começar a sair vem no formato padrão; depois disso, a conexão é encerrada e o download fica incompleto. Cada exportação vai para a auditoria, com os filtros usados e se levou telefones.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description A planilha do resumo. */
                200: {
                    headers: {
                        /** @description O nome com que o arquivo deve ser salvo. */
                        "Content-Disposition"?: string;
                        /** @description O arquivo pode ter dados pessoais: não fica guardado em cache. */
                        "Cache-Control"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": string;
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `exportacao:resumo`, num `setorId` que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exportacoes/resumo.pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resumo dos indicadores em PDF
         * @description O mesmo conteúdo do resumo em Excel, em no máximo 2 páginas A4, para imprimir ou mandar à direção: quem gerou e quando, os filtros aplicados, os indicadores, o NPS por setor e as médias por categoria, com os números escritos como no Brasil (4,3, 1.234 e 67%). Se as tabelas não couberem nem com a letra menor, mostram as primeiras e as últimas linhas, com o aviso de quantas ficaram de fora. Sem gráficos. Gerado no servidor, sem navegador, e enviado na hora, com o nome no `Content-Disposition`; cada exportação vai para a auditoria. Os quatro perfis têm `exportacao:resumo`. Os filtros e o escopo são os do dashboard: o período (`inicio` e `fim`, incluídos) comparado com a `base`, o setor, o turno e o canal. Super Admin e Ouvidoria exportam todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description O PDF do resumo. */
                200: {
                    headers: {
                        /** @description O nome com que o arquivo deve ser salvo. */
                        "Content-Disposition"?: string;
                        /** @description O arquivo pode ter dados pessoais: não fica guardado em cache. */
                        "Cache-Control"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/pdf": string;
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `exportacao:resumo`, num `setorId` que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/exportacoes/respostas.xlsx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Respostas, itens e comentários em Excel
         * @description As abas Resumo (a mesma do arquivo do resumo), Respostas (uma linha por envio), Itens (uma linha por pergunta respondida) e Comentários, do envio mais recente para o mais antigo; o código da resposta liga as abas. Quem tem `contatos:ver` (Super Admin e Ouvidoria) recebe na aba Respostas a coluna "Telefone para retorno", com o número completo; para os outros, a coluna não existe. Uma aba com mais de 1.048.575 linhas, o limite do Excel, continua noutra, como "Itens (2)". Exige `exportacao:detalhada`, que o Visualizador não tem. Os filtros e o escopo são os do dashboard: o período (`inicio` e `fim`, incluídos) comparado com a `base`, o setor, o turno e o canal. Super Admin e Ouvidoria exportam todos os setores; o Gestor e o Visualizador, só os seus, mesmo sem pedir um setor. O arquivo é gerado na hora e enviado em streaming, com o nome no `Content-Disposition`, os cabeçalhos em português e as datas e os números como data e número, no formato brasileiro. Um erro antes de o arquivo começar a sair vem no formato padrão; depois disso, a conexão é encerrada e o download fica incompleto. Cada exportação vai para a auditoria, com os filtros usados e se levou telefones.
         */
        get: {
            parameters: {
                query: {
                    /** @description Primeiro dia do período, em AAAA-MM-DD, incluído. */
                    inicio: string;
                    /** @description Último dia do período, em AAAA-MM-DD, incluído; igual ou depois do início. */
                    fim: string;
                    /** @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10). */
                    base: components["schemas"]["BaseData"];
                    /** @description Só este setor. Sem ele, todos os que a pessoa enxerga; o Gestor e o Visualizador que pedem um setor que não é seu recebem 403. */
                    setorId?: number;
                    /** @description Só as respostas deste turno. */
                    turnoId?: number;
                    /** @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor. */
                    canal?: components["schemas"]["Canal"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description A planilha das respostas. */
                200: {
                    headers: {
                        /** @description O nome com que o arquivo deve ser salvo. */
                        "Content-Disposition"?: string;
                        /** @description O arquivo pode ter dados pessoais: não fica guardado em cache. */
                        "Cache-Control"?: string;
                        [name: string]: unknown;
                    };
                    content: {
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": string;
                    };
                };
                /** @description `VALIDACAO`: sem `inicio`, `fim` ou `base`; data fora do formato AAAA-MM-DD ou que não existe; `fim` antes de `inicio`; ou `base`, `setorId`, `turnoId` ou `canal` fora dos valores aceitos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "fim",
                         *             "mensagem": "A data final precisa ser igual ou depois da inicial"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `exportacao:detalhada` (o Visualizador não a tem), num `setorId` que não é da pessoa ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem acesso a este setor.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tv-telas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Telas de TV cadastradas
         * @description Ativas e desativadas, em ordem alfabética e sem paginação. O token não volta: ele só aparece na criação. O `ultimoAcessoEm` mostra se a TV está ligada; ele é gravado no máximo a cada 5 minutos, e a TV consulta os indicadores a cada 30 s.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description As telas, em ordem alfabética. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": [
                         *         {
                         *           "id": 2,
                         *           "nome": "Corredor da Internação",
                         *           "ativa": false,
                         *           "ultimoAcessoEm": "2026-11-10T21:40:11.006Z"
                         *         },
                         *         {
                         *           "id": 3,
                         *           "nome": "Pronto Atendimento",
                         *           "ativa": true,
                         *           "ultimoAcessoEm": null
                         *         },
                         *         {
                         *           "id": 1,
                         *           "nome": "Recepção principal",
                         *           "ativa": true,
                         *           "ultimoAcessoEm": "2026-11-24T14:55:02.318Z"
                         *         }
                         *       ]
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["TelaTv"][];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `tvwall:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Cria uma tela e devolve o token do link, uma única vez
         * @description A tela nasce ativa. O `token` só aparece nesta resposta, que não fica em cache (`Cache-Control: no-store`): o banco guarda o hash, e o link não pode ser mostrado de novo. O front monta o link `/tv#<token>`, com o token depois do `#`, a parte da URL que o navegador não envia ao servidor. Perdido o link, a tela é desativada e outra é criada.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /**
                         * @description Onde a tela fica, de 2 a 100 caracteres; os espaços das pontas saem.
                         * @example Recepção principal
                         */
                        nome: string;
                    };
                };
            };
            responses: {
                /** @description Tela criada, com o token do link. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "tela": {
                         *           "id": 3,
                         *           "nome": "Pronto Atendimento",
                         *           "ativa": true,
                         *           "ultimoAcessoEm": null
                         *         },
                         *         "token": "jIWDi92T12y8w3ZdkfQFXBxKOtO28BLzEKAK84UyMNs"
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: {
                                tela: components["schemas"]["TelaTv"];
                                /**
                                 * @description Aleatório e mostrado só nesta resposta: o banco guarda o hash. O front monta o link `/tv#<token>`, e a TV o manda no cabeçalho `X-Tv-Token`. Perdido o link, a tela é desativada e outra é criada.
                                 * @example jIWDi92T12y8w3ZdkfQFXBxKOtO28BLzEKAK84UyMNs
                                 */
                                token: string;
                            };
                        };
                    };
                };
                /** @description `VALIDACAO`: nome com menos de 2 ou mais de 100 caracteres, sem contar os espaços das pontas (em `nome`). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "nome",
                         *             "mensagem": "Informe onde a tela fica"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `tvwall:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tv-telas/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Ativa ou desativa uma tela
         * @description Desativada, a tela para de abrir na consulta seguinte da TV, em até 30 s: o link recebe 401. Ativada de novo, o mesmo link volta a abrir. Nada é apagado.
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        /** @description `true` ativa a tela, e o mesmo link volta a abrir; `false` a desativa, e o link para na hora. */
                        ativa: boolean;
                    };
                };
            };
            responses: {
                /** @description Situação da tela atualizada. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description `VALIDACAO`: dados inválidos, com um item em `detalhes` para cada campo errado. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "VALIDACAO",
                         *         "mensagem": "Dados inválidos",
                         *         "detalhes": [
                         *           {
                         *             "campo": "ativa",
                         *             "mensagem": "Obrigatório"
                         *           }
                         *         ],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem login, com a sessão expirada ou com o usuário inativo. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Sua sessão terminou. Entre de novo.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `SEM_PERMISSAO`: sem a permissão `tvwall:gerenciar` (só o Super Admin a tem) ou com a senha provisória. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "SEM_PERMISSAO",
                         *         "mensagem": "Você não tem permissão para isso.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `NAO_ENCONTRADO`: não existe tela com este ID. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_ENCONTRADO",
                         *         "mensagem": "Tela não encontrada.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/tv/indicadores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Indicadores gerais para a TV
         * @description Sem login: vale o token do link da tela, no cabeçalho `X-Tv-Token`. A TV consulta a cada 30 s. Os números juntam todos os setores, também os desativados, com as mesmas contas do dashboard e pela data do atendimento, e são só contagens e médias: nenhum comentário, telefone ou texto escrito pelo paciente. O último acesso da tela é gravado no máximo a cada 5 minutos.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Os números da TV. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "data": {
                         *         "tela": "Recepção principal",
                         *         "geradoEm": "2026-11-24T15:00:00.000Z",
                         *         "mes": {
                         *           "nps": 42,
                         *           "total": 134,
                         *           "promotores": 78,
                         *           "neutros": 34,
                         *           "detratores": 22,
                         *           "mediaEscala": 4.3
                         *         },
                         *         "npsPorSetor": [
                         *           {
                         *             "setor": "Pediatria",
                         *             "nps": 71,
                         *             "total": 28
                         *           },
                         *           {
                         *             "setor": "Pronto Atendimento",
                         *             "nps": 38,
                         *             "total": 81
                         *           },
                         *           {
                         *             "setor": "Ambulatório",
                         *             "nps": -4,
                         *             "total": 25
                         *           }
                         *         ],
                         *         "evolucao": [
                         *           {
                         *             "periodo": "2026-09-07",
                         *             "nps": 35,
                         *             "total": 22
                         *           },
                         *           {
                         *             "periodo": "2026-09-14",
                         *             "nps": 41,
                         *             "total": 30
                         *           },
                         *           {
                         *             "periodo": "2026-09-21",
                         *             "nps": 38,
                         *             "total": 27
                         *           },
                         *           {
                         *             "periodo": "2026-09-28",
                         *             "nps": 44,
                         *             "total": 33
                         *           },
                         *           {
                         *             "periodo": "2026-10-05",
                         *             "nps": null,
                         *             "total": 0
                         *           },
                         *           {
                         *             "periodo": "2026-10-12",
                         *             "nps": 40,
                         *             "total": 29
                         *           },
                         *           {
                         *             "periodo": "2026-10-19",
                         *             "nps": 46,
                         *             "total": 35
                         *           },
                         *           {
                         *             "periodo": "2026-10-26",
                         *             "nps": 39,
                         *             "total": 31
                         *           },
                         *           {
                         *             "periodo": "2026-11-02",
                         *             "nps": 48,
                         *             "total": 41
                         *           },
                         *           {
                         *             "periodo": "2026-11-09",
                         *             "nps": 36,
                         *             "total": 30
                         *           },
                         *           {
                         *             "periodo": "2026-11-16",
                         *             "nps": 40,
                         *             "total": 37
                         *           },
                         *           {
                         *             "periodo": "2026-11-23",
                         *             "nps": 50,
                         *             "total": 12
                         *           }
                         *         ],
                         *         "destaques": [
                         *           {
                         *             "setor": "Pediatria",
                         *             "categoria": "Limpeza",
                         *             "media": 4.8,
                         *             "percentual45": 96
                         *           },
                         *           {
                         *             "setor": "Pronto Atendimento",
                         *             "categoria": "Recepção",
                         *             "media": 4.5,
                         *             "percentual45": 90
                         *           },
                         *           {
                         *             "setor": "Ambulatório",
                         *             "categoria": "Enfermagem",
                         *             "media": 4.4,
                         *             "percentual45": 88
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": {
                            data: components["schemas"]["IndicadoresTv"];
                        };
                    };
                };
                /** @description `NAO_AUTENTICADO`: sem o token, com um que não existe ou com o de uma tela desativada. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "NAO_AUTENTICADO",
                         *         "mensagem": "Esta tela não está ativa.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
                /** @description `ERRO_INTERNO`: erro inesperado. A mensagem é sempre a mesma, e o detalhe fica só no log. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "erro": {
                         *         "codigo": "ERRO_INTERNO",
                         *         "mensagem": "Erro inesperado. Tente de novo em instantes.",
                         *         "detalhes": [],
                         *         "requestId": "01JC9W2K7QXZ4N5M8R3T6V0B1D"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["Erro"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * @description `ATENDIMENTO` compara o período com o dia do atendimento; `ENVIO`, com o dia do envio da avaliação no horário de Brasília (uma resposta enviada às 23h30 do dia 10 conta no dia 10).
         * @default ATENDIMENTO
         * @enum {string}
         */
        BaseData: "ATENDIMENTO" | "ENVIO";
        /**
         * @description `WEB` no celular ou no computador; `TOTEM` no aparelho fixo do setor.
         * @enum {string}
         */
        Canal: "WEB" | "TOTEM";
        /** @description Etapa do atendimento comparável entre setores, como Recepção ou Triagem. */
        Categoria: {
            id: number;
            nome: string;
            /** @description Posição na lista. A categoria nova entra no fim. */
            ordem: number;
            /** @description Desativar não apaga nada: as perguntas e as respostas da categoria continuam. */
            ativa: boolean;
        };
        /**
         * @description A pior entre a do NPS e a de cada nota de 1 a 5, com os limites das configurações (no padrão, NPS até 6 é baixa e até 2 é baixíssima; nota até 3 é baixa e 1 é baixíssima). O front escolhe a próxima tela por ela.
         * @enum {string}
         */
        Classificacao: "NORMAL" | "BAIXA" | "BAIXISSIMA";
        /**
         * @description Código do erro. Cada um tem o seu status HTTP; código novo só entra combinado com o front.
         * @enum {string}
         */
        CodigoDeErro: "VALIDACAO" | "NAO_AUTENTICADO" | "SEM_PERMISSAO" | "NAO_ENCONTRADO" | "CONFLITO" | "LIMITE_ATINGIDO" | "ERRO_INTERNO";
        /** @description Um comentário deixado depois de uma avaliação. */
        ComentarioRecente: {
            id: number;
            respostaId: number;
            tipo: components["schemas"]["TipoComentario"];
            texto: string;
            /** @description O nome do setor da avaliação. */
            setor: string;
            /**
             * Format: date
             * @description O dia do atendimento, em AAAA-MM-DD.
             */
            dataAtendimento: string;
            /**
             * Format: date-time
             * @description O instante do envio da avaliação, em UTC.
             */
            enviadoEm: string;
            classificacao: components["schemas"]["Classificacao"];
        };
        /**
         * @description O que o paciente anexa à avaliação depois do envio: o comentário, o telefone ou os dois.
         * @example {
         *       "comentario": {
         *         "tipo": "RECLAMACAO",
         *         "texto": "Esperei muito na triagem."
         *       },
         *       "contato": {
         *         "telefone": "(51) 99999-0000",
         *         "consentimento": true
         *       }
         *     }
         */
        Complemento: {
            /** @description O comentário, se a pessoa escreveu. */
            comentario?: {
                tipo: components["schemas"]["TipoComentario"];
                /**
                 * @description O que aconteceu, o elogio ou a sugestão: não vazio e até o `textoLimiteCaracteres` da pesquisa (os espaços das pontas saem).
                 * @example Esperei muito na triagem.
                 */
                texto: string;
            };
            /** @description O pedido de retorno, se a pessoa deixou o telefone. A tela o oferece na avaliação baixa. */
            contato?: {
                /**
                 * @description Com DDD, de 10 ou 11 dígitos, com ou sem a máscara (espaços, parênteses, hífen e ponto). É gravado cifrado, só com os dígitos.
                 * @example (51) 99999-0000
                 */
                telefone: string;
                /**
                 * @description A pessoa autorizou o hospital a guardar o telefone e ligar. Sempre `true`.
                 * @enum {boolean}
                 */
                consentimento: true;
            };
        };
        /** @description Problema num campo. */
        DetalheErro: {
            /** @description Caminho do campo no que foi enviado, como `nome` ou `contato.telefone`. */
            campo: string;
            /** @description O que está errado no campo, em português, para mostrar na tela. */
            mensagem: string;
        };
        /** @description Uma avaliação, gravada ao confirmar a nota de 0 a 10. */
        EnvioResposta: {
            /**
             * Format: uuid
             * @description UUID criado pelo front a cada avaliação e repetido em cada nova tentativa do mesmo envio. A mesma chave devolve a avaliação já gravada, sem criar outra.
             * @example 4b7e0c1a-9d2f-4c11-8a35-1f0e6b2d7c90
             */
            chaveIdempotencia: string;
            canal: components["schemas"]["Canal"];
            /**
             * Format: date
             * @description O dia do atendimento, em AAAA-MM-DD; não pode ser depois de hoje no horário de Brasília.
             * @example 2026-11-10
             */
            dataAtendimento: string;
            /** @example 1 */
            turnoId: number;
            /**
             * @description Uma resposta por pergunta ativa do setor, no máximo; as puladas não vêm, e a lista pode ser vazia.
             * @default []
             */
            itens: components["schemas"]["ItemEnvio"][];
            /**
             * @description A nota de 0 a 10, obrigatória.
             * @example 6
             */
            nps: number;
            /** @description Campo isca: o formulário o mantém invisível para pessoas (fora da tela, com `tabindex="-1"` e `autocomplete="off"`) e o envia vazio, ou não o envia. Preenchido, o envio é recusado e nada é gravado. */
            site?: string;
        };
        /** @description Corpo de toda resposta de erro da API. */
        Erro: {
            erro: {
                codigo: components["schemas"]["CodigoDeErro"];
                /** @description Frase curta em português, que o front mostra direto ao usuário. */
                mensagem: string;
                /** @description Um item por campo inválido, no erro `VALIDACAO`; vazio nos outros erros. */
                detalhes: components["schemas"]["DetalheErro"][];
                /** @description ID da requisição, o mesmo do cabeçalho `X-Request-Id`. Liga a mensagem à linha do log. */
                requestId: string;
            };
        };
        /**
         * @description Um ponto por dia, por semana (de segunda a domingo) ou por mês.
         * @enum {string}
         */
        Granularidade: "DIA" | "SEMANA" | "MES";
        /** @description As notas de 1 a 5 de uma categoria no período, de todos os setores. Só vêm as categorias com notas, então `media` e `percentual45` nunca vêm `null` nesta rota. */
        IndicadorCategoria: {
            categoriaId: number;
            /** @description O nome da categoria, também se ela estiver desativada. */
            categoria: string;
            /**
             * @description Média das notas de 1 a 5, com uma casa decimal.
             * @example 4.3
             */
            media: number | null;
            /**
             * @description % de notas 4 e 5, arredondado, de 0 a 100.
             * @example 82
             */
            percentual45: number | null;
            /** @description Notas de 1 a 5 da categoria no período. */
            total: number;
        };
        /** @description Os números gerais da pesquisa para a TV, de todos os setores: só contagens e médias, sem comentário, telefone ou texto escrito pelo paciente. */
        IndicadoresTv: {
            /** @description O nome da tela que pediu os números. */
            tela: string;
            /**
             * Format: date-time
             * @description O instante em que os números foram calculados, em UTC.
             */
            geradoEm: string;
            /** @description O mês corrente, do dia 1 até hoje no horário de Brasília, pela data do atendimento. */
            mes: {
                /**
                 * @description % de promotores (9 e 10) menos % de detratores (0 a 6), arredondado, de -100 a 100; `null` sem respostas.
                 * @example 42
                 */
                nps: number | null;
                /** @description Respostas do mês. */
                total: number;
                /** @description Respostas do mês com NPS 9 ou 10. */
                promotores: number;
                /** @description Respostas do mês com NPS 7 ou 8. */
                neutros: number;
                /** @description Respostas do mês com NPS de 0 a 6. */
                detratores: number;
                /**
                 * @description Média das notas de 1 a 5 de todas as perguntas de escala respondidas no mês, com uma casa decimal; `null` sem nenhuma nota.
                 * @example 4.3
                 */
                mediaEscala: number | null;
            };
            /** @description O NPS de cada setor com respostas no mês, do maior para o menor; no empate, o de mais respostas e depois a ordem alfabética. */
            npsPorSetor: {
                /** @description O nome do setor, também se ele estiver desativado. */
                setor: string;
                /**
                 * @description % de promotores (9 e 10) menos % de detratores (0 a 6), arredondado, de -100 a 100; `null` sem respostas.
                 * @example 42
                 */
                nps: number | null;
                /** @description Respostas do setor no mês. */
                total: number;
            }[];
            /** @description O NPS de cada semana (de segunda a domingo) nas últimas 12, da mais antiga até a atual, que vai até hoje, pela data do atendimento; as semanas sem resposta vêm com `nps` `null` e `total` 0. */
            evolucao: components["schemas"]["PontoEvolucao"][];
            /** @description O ponto (um setor numa categoria) mais bem avaliado de até 3 setores diferentes, nos últimos 30 dias contando hoje, pela data do atendimento, só com os pontos com 5 notas de 1 a 5 ou mais. A ordem é a da maior média, depois a do maior % de notas 4 e 5; com poucos pontos, a lista fica curta ou vazia. */
            destaques: {
                setor: string;
                categoria: string;
                /**
                 * @description Média das notas de 1 a 5, com uma casa decimal.
                 * @example 4.3
                 */
                media: number;
                /**
                 * @description % de notas 4 e 5, arredondado, de 0 a 100.
                 * @example 82
                 */
                percentual45: number;
            }[];
        };
        /** @description A resposta de uma pergunta. A pergunta pulada não vem. */
        ItemEnvio: {
            /** @example 12 */
            perguntaId: number;
            /**
             * @description Na escala de 1 a 5: a nota, inteira, de 1 a 5.
             * @example 4
             */
            valorNumero?: number;
            /** @description No sim ou não, `SIM` ou `NAO`; na múltipla escolha, uma das opções, como veio na pesquisa; no texto livre, a resposta, não vazia e dentro do `textoLimiteCaracteres` (os espaços das pontas saem). */
            valorTexto?: string;
        };
        /** @description Um ponto avaliado: um setor numa categoria. */
        ItemRanking: {
            setorId: number;
            setor: string;
            categoriaId: number;
            categoria: string;
            /**
             * @description Média das notas de 1 a 5, com uma casa decimal.
             * @example 4.3
             */
            media: number;
            /**
             * @description % de notas 4 e 5, arredondado, de 0 a 100.
             * @example 82
             */
            percentual45: number;
            /** @description Notas de 1 a 5 do ponto no período, 5 ou mais. */
            total: number;
        };
        /** @description Uma pergunta respondida, como o paciente a viu. */
        ItemResposta: {
            perguntaId: number;
            /** @description O texto da pergunta como o paciente leu, copiado no momento da resposta. */
            perguntaTexto: string;
            /** @description A categoria da pergunta no momento da resposta. */
            categoria: string;
            tipo: components["schemas"]["TipoPergunta"];
            /** @description A nota de 1 a 5, na escala; `null` nos outros tipos. */
            valorNumero: number | null;
            /** @description `SIM` ou `NAO` no sim ou não, a opção escolhida na múltipla escolha e o texto no texto livre; `null` na escala. */
            valorTexto: string | null;
            /**
             * @description A da nota de 1 a 5, com os limites da escala das configurações (no padrão, 1 é baixíssima e 2 e 3 são baixas); `null` nos outros tipos.
             * @enum {string|null}
             */
            classificacao: "NORMAL" | "BAIXA" | "BAIXISSIMA" | null;
        };
        /** @description Paginação de uma lista. */
        Meta: {
            /** @description Página devolvida, a partir de 1. */
            pagina: number;
            /** @description Itens por página. */
            porPagina: number;
            /** @description Total de itens, somando todas as páginas. */
            total: number;
        };
        /** @description O NPS de um setor no período, com o número de respostas. */
        NpsSetor: {
            setorId: number;
            /** @description O nome do setor, também se ele estiver desativado. */
            setor: string;
            /**
             * @description % de promotores (9 e 10) menos % de detratores (0 a 6), arredondado, de -100 a 100; `null` sem respostas.
             * @example 42
             */
            nps: number | null;
            /** @description Respostas do setor no período. */
            total: number;
        };
        /** @description Um paciente que pediu para o hospital ligar. */
        PedidoRetorno: {
            /** @description O ID do pedido, o de `/contatos/{id}/revelar-telefone`. */
            id: number;
            /** @description A avaliação do pedido, a de `/respostas/{id}`. */
            respostaId: number;
            /** @description O nome do setor da avaliação, também se ele estiver desativado. */
            setor: string;
            /**
             * Format: date
             * @description O dia do atendimento, em AAAA-MM-DD.
             */
            dataAtendimento: string;
            /**
             * @description A nota de 0 a 10.
             * @example 3
             */
            nps: number;
            classificacao: components["schemas"]["Classificacao"];
            /** @description O comentário da avaliação, se houver. */
            comentario: {
                tipo: components["schemas"]["TipoComentario"];
                texto: string;
            } | null;
            /**
             * @description Os 4 últimos dígitos depois de `••••`, montados sem decifrar o número. O número completo só sai em `POST /contatos/{id}/revelar-telefone`.
             * @example •••• 0042
             */
            telefoneMascarado: string;
            /**
             * Format: date-time
             * @description O instante em que o paciente deixou o telefone e autorizou o contato, em UTC.
             */
            consentimentoEm: string;
            status: components["schemas"]["StatusRetorno"];
        };
        /**
         * @description Perfil de acesso ao painel.
         * @enum {string}
         */
        Perfil: "SUPER_ADMIN" | "GESTOR" | "OUVIDORIA" | "VISUALIZADOR";
        /** @description Pergunta da pesquisa de um setor. */
        Pergunta: {
            id: number;
            setorId: number;
            categoriaId: number;
            texto: string;
            tipo: components["schemas"]["TipoPergunta"];
            /** @description As opções da múltipla escolha, na ordem em que aparecem; `null` nos outros tipos. */
            opcoes: string[] | null;
            /** @description Posição na pesquisa do setor: o paciente vê as ativas nesta ordem. A nova entra no fim. */
            ordem: number;
            /** @description Só as ativas aparecem na pesquisa. Desativar não apaga nada: as respostas continuam. */
            ativa: boolean;
            /** @description Já foi respondida ao menos uma vez: o tipo não pode mais mudar. */
            temRespostas: boolean;
        };
        /** @description Pergunta ativa da pesquisa, como o paciente a vê. */
        PerguntaPublica: {
            id: number;
            texto: string;
            tipo: components["schemas"]["TipoPergunta"];
            /** @description As opções da múltipla escolha, na ordem em que aparecem; `null` nos outros tipos. */
            opcoes: string[] | null;
        };
        /**
         * @description O que a pessoa pode fazer no painel. O mapa de cada perfil existe só na API; o front usa a lista do `/auth/me` para esconder menus.
         * @enum {string}
         */
        Permissao: "setores:gerenciar" | "usuarios:gerenciar" | "categorias:gerenciar" | "turnos:gerenciar" | "tvwall:gerenciar" | "configuracoes:gerenciar" | "auditoria:ver" | "perguntas:gerenciar" | "dashboard:ver" | "respostas:ver" | "comentarios:ver" | "contatos:ver" | "contatos:gerenciar" | "exportacao:resumo" | "exportacao:detalhada" | "escalas:gerenciar";
        /** @description O que a tela da pesquisa precisa, lido do cadastro e das configurações. Os limites de nota baixa não vêm: a classificação é da API. */
        PesquisaPublica: {
            setor: {
                nome: string;
                slug: string;
            };
            /** @description Só as ativas, na ordem da pesquisa. */
            perguntas: components["schemas"]["PerguntaPublica"][];
            /** @description Todos os turnos, na ordem definida. O totem usa o do horário atual. */
            turnos: {
                id: number;
                nome: string;
                /**
                 * @description Início, em HH:mm.
                 * @example 07:00
                 */
                horaInicio: string;
                /**
                 * @description Fim, em HH:mm. Menor que o início quando o turno passa da meia-noite.
                 * @example 13:00
                 */
                horaFim: string;
            }[];
            /** @description O texto da pergunta de 0 a 10. */
            npsTexto: string;
            /** @description Tamanho máximo das respostas em texto e dos comentários. */
            textoLimiteCaracteres: number;
            totem: {
                /** @description Espera antes de o totem reiniciar a pesquisa. */
                reinicioSegundos: number;
                /** @description Segundos sem toque até o totem perguntar se a pessoa ainda está lá. */
                inatividadeSegundos: number;
            };
        };
        /** @description Um ponto da evolução do NPS. */
        PontoEvolucao: {
            /**
             * @description Primeiro dia do período, em AAAA-MM-DD: o dia, a segunda-feira da semana ou o dia 1 do mês.
             * @example 2026-11-02
             */
            periodo: string;
            /**
             * @description % de promotores (9 e 10) menos % de detratores (0 a 6), arredondado, de -100 a 100; `null` sem respostas.
             * @example 42
             */
            nps: number | null;
            /** @description Respostas no período; 0 no período sem resposta. */
            total: number;
        };
        /** @description Onde o hospital está melhor e onde está pior. */
        Ranking: {
            /** @description Até 3 pontos, do mais bem avaliado para baixo. */
            melhores: components["schemas"]["ItemRanking"][];
            /** @description Até 3 pontos, do pior para cima, entre os que não estão em `melhores`: com poucos pontos avaliados, a lista fica curta ou vazia. */
            piores: components["schemas"]["ItemRanking"][];
        };
        /** @description A avaliação gravada. */
        RespostaCriada: {
            id: number;
            classificacao: components["schemas"]["Classificacao"];
            /** @description Para anexar o comentário e o telefone, no cabeçalho `X-Complemento-Token`, uma vez só. Um reenvio com a mesma chave recebe outro, que substitui este. */
            tokenComplemento: string;
            /**
             * Format: date-time
             * @description Até quando o token vale: 30 minutos depois do envio.
             */
            expiraEm: string;
        };
        /** @description Uma avaliação inteira: o resumo, as perguntas, o comentário e o pedido de retorno. */
        RespostaDetalhe: {
            id: number;
            setorId: number;
            /** @description O nome do setor, também se ele estiver desativado. */
            setor: string;
            canal: components["schemas"]["Canal"];
            /**
             * Format: date
             * @description O dia do atendimento, em AAAA-MM-DD.
             */
            dataAtendimento: string;
            /** @description O nome do turno do atendimento. */
            turno: string;
            /**
             * @description A nota de 0 a 10.
             * @example 9
             */
            nps: number;
            classificacao: components["schemas"]["Classificacao"];
            /**
             * Format: date-time
             * @description O instante do envio da avaliação, em UTC.
             */
            enviadoEm: string;
            /** @description O paciente deixou um comentário. */
            temComentario: boolean;
            /** @description O paciente deixou o telefone para o hospital ligar. */
            pediuRetorno: boolean;
            /** @description As perguntas, na ordem em que o paciente as viu. */
            itens: components["schemas"]["ItemResposta"][];
            /** @description O comentário, se houver. */
            comentario: {
                tipo: components["schemas"]["TipoComentario"];
                texto: string;
            } | null;
            /** @description O pedido de retorno, se o paciente deixou o telefone; o número vem mascarado. */
            contato: {
                /** @description O ID do pedido de retorno, o de `/contatos/{id}`. */
                id: number;
                /**
                 * @description Os 4 últimos dígitos depois de `••••`, montados sem decifrar o número. O número completo só sai em `POST /contatos/{id}/revelar-telefone`.
                 * @example •••• 0042
                 */
                telefoneMascarado: string;
                status: components["schemas"]["StatusRetorno"];
            } | null;
        };
        /** @description Uma avaliação na lista de respostas. */
        RespostaResumo: {
            id: number;
            setorId: number;
            /** @description O nome do setor, também se ele estiver desativado. */
            setor: string;
            canal: components["schemas"]["Canal"];
            /**
             * Format: date
             * @description O dia do atendimento, em AAAA-MM-DD.
             */
            dataAtendimento: string;
            /** @description O nome do turno do atendimento. */
            turno: string;
            /**
             * @description A nota de 0 a 10.
             * @example 9
             */
            nps: number;
            classificacao: components["schemas"]["Classificacao"];
            /**
             * Format: date-time
             * @description O instante do envio da avaliação, em UTC.
             */
            enviadoEm: string;
            /** @description O paciente deixou um comentário. */
            temComentario: boolean;
            /** @description O paciente deixou o telefone para o hospital ligar. */
            pediuRetorno: boolean;
        };
        /** @description Os números principais da pesquisa no período e nos filtros pedidos. */
        Resumo: {
            /**
             * @description % de promotores (9 e 10) menos % de detratores (0 a 6), arredondado, de -100 a 100; `null` sem respostas.
             * @example 42
             */
            nps: number | null;
            /** @description Respostas no período. */
            total: number;
            /** @description Respostas com NPS 9 ou 10. */
            promotores: number;
            /** @description Respostas com NPS 7 ou 8. */
            neutros: number;
            /** @description Respostas com NPS de 0 a 6. */
            detratores: number;
            /** @description Respostas com classificação baixa ou baixíssima: a pior entre o NPS e as notas de 1 a 5, com os limites das configurações do momento do envio. */
            notasBaixas: number;
            /** @description Respostas com classificação baixíssima. */
            baixissimas: number;
            /**
             * @description Média das notas de 1 a 5 de todas as perguntas de escala respondidas, com uma casa decimal; `null` sem nenhuma nota.
             * @example 4.3
             */
            mediaEscala: number | null;
        };
        /** @description Estado da API e das dependências dela. */
        Saude: {
            /**
             * @description Estado geral da API.
             * @enum {string}
             */
            status: "ok" | "indisponivel";
            /**
             * @description Estado da conexão com o PostgreSQL.
             * @enum {string}
             */
            banco: "ok" | "indisponivel";
        };
        /** @description Quem está logado, o que o perfil permite e quais setores enxerga. */
        Sessao: {
            usuario: {
                id: number;
                nome: string;
                email: string;
                perfil: components["schemas"]["Perfil"];
                /** @description Ainda com a senha provisória: o painel só abre depois da troca, em `PATCH /auth/senha`. */
                trocarSenha: boolean;
            };
            permissoes: components["schemas"]["Permissao"][];
            /** @description Setores que a pessoa enxerga, em ordem alfabética. Vazio quando enxerga todos. */
            setores: {
                id: number;
                nome: string;
            }[];
            /** @description Enxerga todos os setores (Super Admin e Ouvidoria). */
            todosSetores: boolean;
        };
        /** @description Unidade do hospital com pesquisa própria. */
        Setor: {
            id: number;
            nome: string;
            /** @description Forma os links `/s/<slug>` e `/totem/<slug>` e o QR Code. */
            slug: string;
            descricao: string | null;
            /** @description Setor inativo sai da pesquisa pública, mas o histórico dele continua nos indicadores. */
            ativo: boolean;
        };
        /**
         * @description Onde está o retorno ao paciente. No MVP, todo pedido fica `NOVO`; os outros status são do fluxo da fase 2.
         * @enum {string}
         */
        StatusRetorno: "NOVO" | "PENDENTE" | "EM_ATENDIMENTO" | "RESOLVIDO";
        /** @description Uma TV do hospital, com o seu link. */
        TelaTv: {
            id: number;
            /** @description Onde a tela fica. Aparece no topo da TV. */
            nome: string;
            /** @description A tela desativada não abre mais: o link dela recebe 401 até a tela ser ativada de novo. */
            ativa: boolean;
            /**
             * Format: date-time
             * @description A última vez que a TV abriu os indicadores, em UTC, gravada no máximo a cada 5 minutos; `null` se a tela nunca foi aberta.
             */
            ultimoAcessoEm: string | null;
        };
        /** @enum {string} */
        TipoComentario: "ELOGIO" | "RECLAMACAO" | "SUGESTAO" | "OUTRO";
        /**
         * @description Escala de 1 a 5 (com os rostinhos), sim ou não, múltipla escolha ou texto livre. Uma pergunta que já tem respostas não muda de tipo.
         * @enum {string}
         */
        TipoPergunta: "ESCALA_1_5" | "SIM_NAO" | "MULTIPLA_ESCOLHA" | "TEXTO";
        /** @description Período do dia. O paciente escolhe o turno na pesquisa, e o totem usa o do horário atual. Turnos não são desativados nem apagados. */
        Turno: {
            id: number;
            nome: string;
            /**
             * @description Início, em HH:mm.
             * @example 19:00
             */
            horaInicio: string;
            /**
             * @description Fim, em HH:mm. Menor que o início quando o turno passa da meia-noite.
             * @example 07:00
             */
            horaFim: string;
            /** @description Posição na lista. O turno novo entra no fim. */
            ordem: number;
        };
        /** @description Conta do painel. */
        Usuario: {
            id: number;
            nome: string;
            /** @description Em minúsculas. É o login da pessoa e não muda. */
            email: string;
            perfil: components["schemas"]["Perfil"];
            /** @description A conta inativa não entra no painel, e as sessões dela caem. */
            ativo: boolean;
            /** @description Ainda com a senha provisória: a troca é obrigatória no próximo acesso. */
            trocarSenha: boolean;
            /** @description Setores ligados à pessoa, em ordem de ID. Limitam o que o Gestor e o Visualizador enxergam; o Super Admin e a Ouvidoria enxergam todos. */
            setorIds: number[];
            /**
             * Format: date-time
             * @description O último login, em UTC; `null` se a pessoa nunca entrou.
             */
            ultimoLoginEm: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
