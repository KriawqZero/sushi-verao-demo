# Sushi do Verão — site

Site do **Sushi do Verão**, restaurante japonês na Rua América, 677, esquina
com a Antônio João, no Centro de Corumbá — MS. Publicado em
[sushidoverao.com.br](https://sushidoverao.com.br/) e feito para ser aberto no
celular, no horário do jantar, por quem está decidindo onde comer.

Página única, estática, sem backend. O pedido fecha no WhatsApp: o site mostra
o que a casa serve, onde ela fica e se está aberta agora, e leva a conversa
para lá. Desenvolvido e mantido pela [Avantis](https://avantis.dev).

## Rodar

```bash
pnpm install
pnpm dev        # desenvolvimento
pnpm typecheck  # só o TypeScript
pnpm lint       # ESLint
pnpm build      # typecheck + build de produção em dist/
pnpm preview    # servir o build
```

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | A página inteira, com metadados, SEO e JSON-LD |
| `src/conteudo.ts` | Cardápio, contatos e horário de funcionamento |
| `src/main.ts` | Carta, detalhe do prato, "aberto agora" e links de WhatsApp |
| `src/style.css` | Estilo, tokens e movimento |
| `public/img/` | Fotos em WebP nas larguras do `srcset` + preview de link |
| `public/marca/` | Logo e ícone |
| `public/fontes/` | Fraunces e Inter Tight auto-hospedadas |
| `scripts/prepara-og.py` | Gera `public/img/abre-social.jpg` (preview de link) |
| `scripts/prepara-assets.py` | Gera `public/img/` a partir do acervo local de fotos |
| `docs/` | Registro interno de pesquisa, decisões e redesign |

`docs/`, `prototipos/`, `design-system/` e o acervo bruto de fotos são material
interno: não sobem para a Vercel (`.vercelignore`), e o acervo fica fora do Git
(`.gitignore`).

## Onde mexer

- **Horário** — `HORARIO` em `src/conteudo.ts` **e** o texto por extenso no
  `index.html`. Os dois precisam dizer a mesma coisa: o marcador "aberto agora"
  sai do primeiro, e sem JS o visitante lê o segundo.
- **Cardápio** — `CAPITULOS` em `src/conteudo.ts`. Prato novo entra com foto;
  as larguras declaradas em `larguras` têm que existir em `public/img/`.
- **Contato e endereço** — `CONTATO` em `src/conteudo.ts`, o rodapé e o bloco
  "Como chegar" no `index.html`, mais o JSON-LD no `<head>`.
- **Preview de link** — rode `python3 scripts/prepara-og.py` depois de trocar a
  foto de abertura.

## Regras que o site segue

- Sem preço na página: valor e composição do dia são acertados na conversa.
- Nenhuma foto com rosto de cliente em primeiro plano; sem arte promocional e
  sem imagem gerada por IA.
- Sem backend, sem admin e sem coleta de dado do visitante — nenhum cookie e
  nenhum script de terceiro além do mapa do Google.
- Endereço, horário e canais na página têm que bater com o que a casa informa;
  JSON-LD só com fato confirmado.

O histórico de pesquisa e as decisões de design estão em [`docs/`](docs/) — a
transição para site público está registrada em
[`redesign-v2.md`](docs/redesign-v2.md), seção 11.
