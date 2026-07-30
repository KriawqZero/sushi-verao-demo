# Sushi do Verão — conceito de site

Peça de conceito criada pela **Avantis** para prospecção e portfólio, a partir
de conteúdo público do Instagram [@rodrigo_verao](https://www.instagram.com/rodrigo_verao/).

> **Não é o site oficial.** O Sushi do Verão não encomendou, não revisou e não
> aprovou este trabalho. Nada aqui deve ser apresentado como material da casa.

## Rodar

```bash
pnpm install
pnpm dev        # desenvolvimento
pnpm build      # typecheck + build de produção
pnpm preview    # servir o build
```

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | Página única |
| `src/cardapio.ts` | Itens do cardápio, com regra de procedência |
| `src/main.ts` | Filtro de categoria e montagem do pedido |
| `src/style.css` | Estilo — direção "A Casa" |
| `public/img/` | Seleção otimizada em WebP |
| `scripts/prepara-assets.py` | Gera `public/img/` a partir do acervo bruto |
| `docs/` | Briefing, coleta, inventário e arquitetura |
| `assets/instagram/raw/` | Acervo bruto — **fora do Git** |
| `prototipos/` | Rascunhos das três direções (fase 3) |

## Princípios

- Nenhuma afirmação sem fonte: perfil público, informação do Marcilio, ou
  redação autoral que não afirma fato.
- Sem preço e sem promoção — nenhum valor atual foi confirmado.
- Nenhuma foto com rosto identificável de cliente.
- Nenhuma imagem gerada por IA.
- Sem backend, sem admin, sem coleta de dados do visitante.

O raciocínio por trás de cada decisão está em [`docs/`](docs/) — comece por
[`briefing.md`](docs/briefing.md) e [`arquitetura.md`](docs/arquitetura.md).
