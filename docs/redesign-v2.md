# Redesign v2

Registro da segunda rodada, feita depois de o Marcilio revisar a v1 no desktop
e no celular e rejeitá-la. A v1 continua recuperável no histórico do Git
(`797c469`); esta rodada foi consolidada em `main`, a branch de produção.

A pesquisa e a mídia da v1 foram preservadas. Estratégia, copy, identidade e
interface foram refeitas do zero.

## 1. O que a auditoria encontrou

Cada crítica foi confrontada com evidência antes de virar decisão.

| # | Crítica do Marcilio | O que a evidência mostrou | Resposta na v2 |
| --- | --- | --- | --- |
| 1 | Abaixo de Seveng e Recanto; cara de layout genérico de IA | Confirmado. A v1 era uma grade de 13 cards idênticos com "Adicionar ao pedido", fundo escuro e pílulas âmbar. Nenhum conceito. | Direção visual com razão de ser (o horário da casa) atravessando hero, seções, foto, tipografia e movimento. |
| 2 | A logo real não aparece | Confirmado: o header era texto puro; a marca só existia, borrada, dentro da foto da fachada. | Logo real no header, no hero e no rodapé. Arquivo enviado pelo Marcilio. |
| 3 | Preto + âmbar não convence | O âmbar foi inventado. A marca é **preto, vermelho e branco**; a fachada tem faixas vermelhas; os pratos do salão são vermelhos; há quadros de círculo vermelho na parede. | Paleta derivada da marca e medida nas fotos. |
| 4 | Copy fraca; "Tem sushi na esquina da Antônio João" é banal | Confirmado. Era um endereço no lugar de uma ideia. | Narrativa reescrita inteira. |
| 5 | Remover carrinho e mecânica de pedido | A v1 tinha seleção acumulativa, contador e barra fixa. | Removidos por completo. A carta é vitrine editorial. |
| 6 | O espaço físico precisa pesar mais | "O lugar" era a penúltima seção, com 6 miniaturas. | O salão virou um ato inteiro, com panorâmica e mosaico. |
| 7 | Festas e encomendas como eixo comercial | Existia, mas como faixa secundária. | Bloco próprio, com lista de serviços e CTA de orçamento. |
| 8 | Maps embutido de verdade | **A alegação da v1 estava errada.** Ver seção 4. | Iframe real do Google, com reserva visual e CTA externo. |
| 9 | Fundo e composição sem conceito | Confirmado. | Ver seção 2. |
| 10 | Mais e melhor mídia real | O acervo tinha material de lugar que a v1 não usou. | Quatro enquadramentos novos; três fotos recortadas por privacidade. |
| 11 | Interatividade com propósito | A v1 só tinha filtro e carrinho. | Ver seção 5. |
| 12 | Precisa servir ao portfólio | — | Meta desta rodada. |

## 2. A direção visual

> **Nota da rodada de copy (seção 10):** esta direção nasceu com um nome —
> "A casa acende às 19h" — que virava título na página. O Marcilio rejeitou a
> frase como texto de IA, e com razão. **O nome morreu; o raciocínio visual
> abaixo continua de pé**, porque ele nunca dependeu da frase: depende do
> horário, que é fato.

O escuro não é "dark premium", um estilo escolhido por gosto. Ele responde ao
**horário de funcionamento** — terça a domingo, das 18h às 23h30, informado
pelo Marcilio. A página é feita para ser aberta nesse horário, no celular, por
quem está decidindo onde jantar. Isso resolve o problema apontado no item 9.

A luz é o material de composição. Ela aparece como:

- o vão iluminado da porta na abertura;
- um brilho quente no topo das seções (`.ato--aceso`);
- um halo que sobe sobre a foto do item quando o cursor ou o foco chega nele;
- a revelação progressiva das seções na ordem de leitura.

### Paleta

Nenhuma cor foi escolhida por gosto. O vermelho foi tirado do arquivo da
marca; os tons de superfície foram medidos por amostragem nas fotos da
fachada.

| Token | Valor | Origem |
| --- | --- | --- |
| `--carvao` | `#12100E` | a noite em volta do prédio |
| `--osso` | `#F2ECE2` | o claro da parede da fachada |
| `--vermelho` | `#D02A2A` | a marca, as faixas da fachada, os pratos |
| `--vermelho-btn` | `#C42323` | derivado, para passar 4.5:1 com osso |
| `--vermelho-txt` | `#E2564B` | derivado, para passar 4.5:1 sobre carvão |

Contraste conferido por cálculo, não por impressão:

```
osso  sobre carvão          16.16:1  AAA
mudo  sobre carvão           7.45:1  AAA
osso  sobre vermelho-btn      4.95:1  AA
vermelho-txt sobre carvão     5.12:1  AA
vermelho #D02A2A sobre carvão 3.66:1  só AA-large → nunca em texto pequeno
```

O último caso é a razão de existirem três vermelhos em vez de um: o vermelho
da marca reprova em texto pequeno, então ele fica restrito a filete,
grafismo e display grande.

**Decisão de contraste com as outras demos:** o verde-petróleo do salão é
bonito e real, mas dominá-lo colidiria com a Seveng (`#0F3B44` + dourado), e
verde/azul/dourado colidiria com o Recanto. O verde do salão entra apenas
dentro das fotografias, nunca como superfície de interface. O eixo que separa
esta peça das outras duas é **vermelho + preto + osso** — que é literalmente a
marca do cliente.

### Tipografia

- **Fraunces** (variável, eixos `SOFT` e `WONK`) no display. Escolhida por ter
  personalidade e conviver com o script pincelado da marca sem imitá-lo.
- **Inter Tight** no corpo.
- Auto-hospedadas em `public/fontes/` (subsets latin + latin-ext, 256 KB no
  total). Sem requisição a terceiro e sem depender de rede externa para o
  layout fechar.

## 3. O que veio da skill UI/UX Pro Max — e o que foi rejeitado

Stack detectada, não presumida: Vite + TypeScript sem framework
(`package.json`), o que aproxima de `html-tailwind` na tabela da skill, sem
Tailwind no projeto.

Rodei `--design-system --persist` com três formulações diferentes
(`japanese restaurant local dining room ambience events catering premium
editorial`, `upscale neighborhood restaurant physical dining experience warm
intimate photography-led`, `fine dining restaurant reservation ambience
gallery editorial calm`). Resultado persistido em
`design-system/sushi-do-verao/MASTER.md`.

### Adotado

| Recomendação | Onde entrou |
| --- | --- |
| Padrão **Portfolio Grid** — "visuals first, filter by category, fast loading essential" | É exatamente um microcardápio sem carrinho: capítulos navegáveis, foto como protagonista, zero transação. |
| "Neutral background (let work shine)" da estratégia de cor do Portfolio Grid | Superfícies neutras; a cor forte só no acento. |
| `--domain color` → paleta de restaurante com vermelho apetitoso | Confirmou o vermelho como cor de categoria, o que reforçou a decisão que já vinha da marca. |
| Checklist de pré-entrega (contraste, foco visível, reduced-motion, sem emoji como ícone, responsivo em 375/768/1024/1440) | Auditado item a item; três reprovações corrigidas (seção 6). |
| `quick-reference.md` §2 `touch-target-size` e `tap-delay` | Alvos mínimos de 44px e `touch-action: manipulation`. |
| `quick-reference.md` §7 `stagger-sequence` (30–50ms por item) | O escalonamento estava em 60–70ms; baixado para 45ms. |
| `quick-reference.md` §3 `image-dimension` e `content-jumping` | `width`/`height` reais em toda imagem e `aspect-ratio` nas molduras. |
| `quick-reference.md` §5 `viewport-units` | `100svh` no lugar de `100vh`. |

### Rejeitado

| Recomendação | Por que não serve aqui |
| --- | --- |
| Estilo **"Vibrant & Block-based"** — devolvido nas **três** formulações | O eixo de estilo da base está degenerado: devolve o mesmo resultado para consultas opostas. Além disso a própria ficha diz "best for: startups, creative agencies, gaming, social media, youth-focused". É o oposto de uma casa que o Marcilio descreve como a mais chique da cidade. |
| Paleta `#EA580C` laranja + `#2563EB` azul ("Event orange + map blue") | Inventada em relação à marca. Repetiria o erro do âmbar da v1. |
| Paleta `#FEF2F2` / `#450A0A` (vermelho claro) e `#FAFAFA` "gallery" | Fundo claro é implacável com o acervo: 34% das fotos são escuras demais (ver `inventario-conteudo.md` §9). |
| Tipografia **Noto Serif JP + Noto Sans JP** ("Japanese sites, Japanese restaurants") | É o clichê que a direção preliminar já tinha decidido evitar: fonte "japonesa" decorativa. |
| Tipografia **Playfair Display SC + Karla** ("Restaurant Menu") | Playfair é o default de todo site de restaurante; entregaria de novo a sensação de template. |
| Padrão **"Immersive/Interactive Experience"** com "full-screen interactive element" e "CTA after interaction complete" | Transformaria a landing em parque de efeitos — exatamente o que o item 11 do briefing proíbe. |
| Presets GSAP (`--domain gsap`) | Adicionar GSAP a uma página estática com uma ilha de interatividade seria peso sem trabalho removido. O movimento aqui é `IntersectionObserver` + transições CSS. |
| `--domain chart` | Não há dado a visualizar. |

## 4. O mapa: a alegação da v1 estava errada

A v1 registrou que o embed do Google "responde com `x-frame-options:
SAMEORIGIN` — exige chave da Maps Embed API". **Isso não se sustenta.** O
teste da v1 foi feito com `curl`, e o Google devolve resposta diferente para
cliente que não é navegador.

Testado em navegador real:

1. `https://www.google.com/maps?q=<endereço>&output=embed` responde **200** e
   redireciona para `https://www.google.com/maps/embed?origin=mfe&pb=…`.
2. Abrindo esse endpoint no topo da janela, o Google responde, também com 200:
   *"The Google Maps Embed API must be used in an iframe."* Ou seja: é um
   embed sem chave que apenas exige contexto de iframe.
3. Nenhum bloqueio de `X-Frame-Options` ocorreu.

O que de fato falha **nesta máquina** é a entrega dos *tiles*: a requisição do
payload do embed fica pendente, e o embed do OpenStreetMap renderiza marcador
e controles com os tiles pretos. É restrição da rede local, não da técnica —
o mesmo sintoma que a v1 já tinha observado no OSM (`x-blocked: Access
denied`) e atribuído à causa errada no caso do Google.

**Decisão:** a v2 publica o iframe real. Sob ele, e não sobre ele, fica uma
reserva visual com a foto da fachada e o endereço. Se os tiles não pintarem —
rede que bloqueia, extensão, offline —, o visitante vê a fachada e o endereço
em vez de um retângulo vazio, e o botão "Abrir no Google Maps" sempre
funciona.

**Pendência para o Marcilio:** confirmar na máquina dele que os tiles pintam.
Aqui não foi possível verificar isso visualmente.

## 5. Interatividade

Movimento com função, sem virar parque de efeitos:

- **Revelação por seção** na ordem de leitura, com escalonamento de 45ms e
  `unobserve` depois da primeira vez (não pisca ao rolar de volta).
- **Diálogo nativo `<dialog>`** para ver um item de perto: `showModal()` dá
  foco preso e Escape de graça; o foco volta ao botão que abriu.
- **Navegação de capítulos grudada**, com o capítulo corrente marcado por cor
  **e** por fundo — nunca só por cor.
- **Seção corrente** marcada no menu do topo pelo mesmo observador.
- **Header** que passa de transparente a sólido ao sair da abertura.
- **Respiração lenta** da foto de abertura (26s, `scale`).

Tudo depende de JS ativo (classe `.js`) e some por completo em
`prefers-reduced-motion: reduce`. Sem JS, o conteúdo nasce visível — nunca
fica preso invisível.

## 6. Acessibilidade — o que a auditoria reprovou e foi corrigido

Medido no navegador, não presumido:

| Achado | Correção |
| --- | --- |
| Links do menu do topo com 41px de altura | `min-height: 2.75rem` (44px) |
| Links de contato do rodapé com 27px de altura | `min-height: 2.75rem`, com o sublinhado migrando para `box-shadow` para não esticar junto |
| `touch-action: auto` nos alvos | `touch-action: manipulation` em `a` e `button` |

Conferido e aprovado sem ajuste: hierarquia de títulos sem pulo de nível
(`h1→h2→h3→h4`), `alt` em todas as imagens, `width`/`height` em todas as
imagens, ausência de rolagem horizontal em 390px, foco visível, skip link,
foco devolvido ao fechar o diálogo.

## 7. Política de imagem — o que mudou

A regra herdada é "nenhuma foto com rosto identificável de cliente". A v1
declarava cumpri-la, mas a auditoria visual desta rodada encontrou **quatro
violações**, três delas em fotos que a v1 já publicava:

| Imagem | Problema | Corte aplicado |
| --- | --- | --- |
| `parede-discos` (nova) | Clientes de rosto visível na metade de baixo. Os cortes de 52% e 42% ainda os deixavam no quadro. | topo 37,5% |
| `combinado-premium` (da v1) | Criança de rosto visível atrás do balcão | de 26% para baixo |
| `preparo-fogo` (da v1) | Cliente sentada, nítida, no terço de cima | de 35% para baixo |
| `hot-roll` (da v1) | Clientes sentados ao fundo, na faixa de cima | de 14% para baixo |

Além disso, a foto de abertura (fachada à noite, com clientes ao fundo pela
porta aberta) tinha sido avaliada e aceita na v1. O conceito da v2 colocava um
**brilho quente justamente sobre o vão da porta**, o que os tornava mais
visíveis do que na v1 — uma regressão introduzida pelo próprio conceito.
Corrigido com `filter: brightness(0.66)` na fotografia e um gradiente escuro
adicional sobre a porta: o clima permanece, a luz agora vem do véu, e restam
apenas silhuetas.

## 8. Fatos e fontes

Nada foi afirmado sem lastro. O que aparece no site:

| Afirmação | Fonte |
| --- | --- |
| Rua América, 677, esquina com Antônio João; Centro, Corumbá — MS; CEP 79302-070 | cadastro comercial do perfil + legendas |
| (67) 99991-7786 | cadastro comercial; ~110 publicações desde 2022 |
| Terça a domingo, das 18h às 23h30 | informado pelo Marcilio |
| Os 11 itens da carta | nomeados pelo próprio perfil |
| "32 peças" no Combinado do Verão | artes do próprio perfil |
| Buffet montado em evento de terceiros | publicações de parceiros |

Descrições dos pratos são autorais e definicionais — dizem o que a peça é em
termos gerais, nunca ingrediente, porção, preço ou técnica não confirmada.

Corrigido nesta rodada: o texto dizia "prédio pintado de vermelho e creme". A
amostragem de cor das fotos mostrou parede **cinza-clara** com faixas
vermelhas. O título passou a "Prédio de esquina, faixa vermelha, letreiro
sobre a porta" — três observações verificáveis.

Continua fora: preços, promoções, história de origem, reserva de mesa (só há
indício, não fato), taxa e raio de entrega.

## 9. O que não foi feito

- Sem deploy, sem publicação, sem alteração de infraestrutura.
- Sem imagem gerada por IA.
- Sem backend, admin ou qualquer transação.
- O acervo bruto continua fora do Git; ao repositório vai só a seleção
  otimizada (`public/img/`, gerada por `scripts/prepara-assets.py`).


## 10. Rodada de copy — o site passa a falar com o cliente

Depois da primeira v2, o Marcilio apontou o erro de endereçamento: a copy
estava escrita para **ele** (portfólio) e para o **dono** (pitch), não para
quem de fato abre o site — alguém que chegou pelo link da bio ou por uma busca
e quer decidir onde jantar.

### O que estava errado

1. **Meta-copy sobre a fabricação do site.** "Onze pratos que o próprio perfil
   da casa nomeia (…) Nenhum item foi ilustrado com imagem aproximada" e "este
   site não inventa nenhuma" descrevem o meu método de curadoria. Não servem a
   quem está com fome.
2. **Descrição no lugar de resposta.** "Prédio de esquina, faixa vermelha,
   letreiro sobre a porta" descrevia a fachada que estava na foto ao lado.
3. **Uma afirmação sem fonte que passou pela primeira revisão.** A chamada do
   capítulo de quentes dizia "e que a vizinhança pede tanto quanto" — demanda
   que a coleta nunca mediu. Removida.
4. **O título conceitual.** "Às sete da noite, a esquina acende" foi rejeitado
   pelo Marcilio como texto de IA — bonito, sem informação. Ele está certo: é
   exatamente o padrão que a regra de texto público manda recusar. A frase e
   todo o registro dela saíram; os outros H2 eram do mesmo naipe e caíram
   junto.

### O que mudou

| Antes | Agora |
| --- | --- |
| "Às sete da noite, a esquina acende." | "Restaurante japonês no Centro de Corumbá." |
| "O que a casa nomeia." | "O que a gente serve." |
| "Mesa posta, luz baixa, prato vermelho." | "Como é comer aqui." |
| "A casa já montou banquete fora do salão." | "A gente monta a sua festa." |
| terceira pessoa ("a casa") | primeira pessoa ("a gente") |

**Voz.** O indicador pedido pelo Marcilio — "Estamos abertos agora" — só
funciona se o site inteiro falar como a casa. A página passou toda para a
primeira pessoa do plural. O aviso de peça conceitual no rodapé continua na
voz da Avantis, que é onde ele tem que estar. *(Superado pela seção 11: o site
foi aceito para uso público e o aviso saiu.)*

**Ordem das seções.** Reordenada para a sequência em que as perguntas nascem:
cardápio → entrega → salão → festas → como chegar. A antiga seção "A esquina"
foi absorvida por "Como chegar", que é onde as fotos do letreiro e da placa da
rua realmente servem — para reconhecer o lugar.

### Aberto agora

Marcador calculado no navegador a partir do horário, no fuso de Campo Grande.
Estados verificados com o relógio fixado em oito instantes, incluindo as
viradas: 23h29 aberto, 23h31 fechado, domingo à meia-noite aponta terça
(pulando a segunda), segunda aponta amanhã.

O marcador só existe com JS. Sem script ele some e sobra o horário por
extenso, que é a informação de base e nunca fica desatualizada.

**Ressalva registrada:** o horário veio do Marcilio, não do dono, e feriado ou
imprevisto não aparece em cálculo de relógio. Por isso o marcador anda sempre
colado a um caminho de WhatsApp. O Marcilio escreveu "fecha as 23h" ao pedir o
recurso; mantive **23h30**, que é o horário que ele informou originalmente e
que está em todo o site. Se o certo for 23h, é trocar em `HORARIO`.

### Entrega e retirada — escopo reaberto

A v1 tinha deixado delivery fora do escopo. Para quem chega do feed de 2026 —
onde quase toda arte diz "somente delivery ou retirada" — essa era a pergunta
mais provável e o site não respondia. Entrou um bloco curto logo depois do
cardápio.

Fonte: "MUITAS promoções no delivery" e "Delivery bombando" (2026), além de
dezenas de artes com "somente delivery ou retirada".

**Continua fora, por não ter fonte:** taxa de entrega, raio de atendimento,
prazo, pedido mínimo e presença em aplicativos.

---

## 11. Transição para site público (2026-08-04)

O Sushi do Verão aceitou o trabalho e o site passou a ser o site oficial da
casa, em `https://sushidoverao.com.br/`, com o link entrando na bio do
Instagram. Isso muda o **destinatário** da interface: até aqui ela falava, em
parte, com quem avaliava a peça; agora fala só com quem quer comer.

As seções 1 a 10 continuam valendo como registro do que foi feito e por quê.
Onde esta seção contradiz alguma delas, esta prevalece.

### O que saiu da interface

O rodapé tinha um aviso de quatro linhas — conceito independente, não é o site
oficial, não foi encomendado nem aprovado, procedência das fotos, nenhuma
imagem gerada por IA — e a assinatura "Peça conceitual — Avantis". Tudo isso
existia para proteger uma peça não solicitada. Com o aceite, deixou de ter
função e passou a ter custo: um restaurante que explica a origem das próprias
fotos no rodapé soa inseguro para o cliente.

Saíram também os resíduos de bastidor fora do rodapé: o `noindex, nofollow` do
`<head>`, os cabeçalhos de arquivo que descreviam o site como conceito, e os
comentários de código que citavam coleta, procedência ou nome de quem informou
um dado. **A rastreabilidade não foi apagada** — ela vive em `docs/`, que é
material interno e não sobe para a Vercel. O que saiu foi o tom de bastidor na
interface.

### O que entrou no lugar

Remover o aviso deixaria a terceira coluna do rodapé vazia — a grade em
desktop é `logo | contatos | painel`. O painel virou o fecho comercial que a
página inteira propõe: **"Pedidos e encomendas"**, uma linha sobre o que a
conversa resolve (valor do dia, entrega, retirada, mesa) e o botão de
WhatsApp. Mesma moldura, mesmo filete vermelho, função nova. A largura máxima
da coluna caiu de 34rem para 26rem, porque um painel com botão não pede a
mesma medida de um parágrafo corrido.

A assinatura da agência ficou onde assinatura de agência fica: na base, ao
lado do ©, como **"Site por Avantis"**, com link para `avantis.dev` em nova
aba, `rel="noopener noreferrer"` e o mesmo tratamento de foco do resto da
página. Discreta e legível — não é aviso, é crédito.

### Copy revista

O padrão que atravessava a página era a **ressalva defensiva**: "os valores
mudam, então a gente combina na hora", "confirma se tem hoje", "queria saber
sobre X — tem hoje?". Cada uma delas nasceu da mesma cautela do rodapé e todas
denunciavam incerteza de quem escreveu, não uma prática da casa.

| Antes | Agora |
| --- | --- |
| "Os valores mudam, então a gente combina na hora. Manda no WhatsApp o que você quer que a gente te passa o preço e o que tem hoje." | "Manda no WhatsApp o que você quer que a gente te passa o valor do dia e monta o seu pedido." |
| "Manda mensagem que a gente te passa o preço e confirma se tem hoje." | "Gostou? Chama a gente no WhatsApp que a gente passa o valor e monta o seu pedido." |
| botão "Perguntar no WhatsApp" | botão "Pedir no WhatsApp" |
| mensagem pronta "queria saber sobre X. Tem hoje?" | "queria pedir X." |

**Nenhum fato novo entrou.** Não há preço, promoção, ingrediente, prazo, taxa,
raio de entrega, depoimento ou número que já não estivesse confirmado. O que
mudou foi a postura: a casa deixou de pedir desculpa por não ter tabela na
página e passou a convidar para a conversa, que é como ela de fato vende.

O indicador "aberto agora" e o horário por extenso ficaram intactos — o
cálculo é do relógio, o texto por extenso é o fallback sem JS, e nenhum dos
dois carrega ressalva no corpo.

### SEO público

| Item | Antes | Agora |
| --- | --- | --- |
| `robots` | `noindex, nofollow` | `index, follow` |
| canonical | ausente | `https://sushidoverao.com.br/` |
| `og:url` | ausente | absoluto |
| `og:image` | `/img/fachada-noite-1440.webp` (relativo, quadrado; hoje a origem é `fachada-noite-960.webp`) | `https://sushidoverao.com.br/img/abre-social.jpg` (absoluto, 1200×630) |
| Twitter | ausente | `summary_large_image` com título, descrição, imagem e alt |
| JSON-LD | ausente | `Restaurant` |

A imagem de compartilhamento é nova: `scripts/prepara-og.py` corta a faixa do
letreiro e da porta a partir da foto de abertura já versionada e salva em
**JPEG**. WebP em `og:image` ainda tropeça em leitores de preview — WhatsApp
inclusive —, e a prévia do link é justamente o que abre a conversa quando
alguém repassa o site. Rodar o script de novo é a única etapa manual se a foto
de abertura mudar.

O JSON-LD tem **só fato confirmado**: nome, URL, imagem, logo, culinária,
telefone, endereço completo com CEP, Instagram em `sameAs`, link do Maps e o
horário de terça a domingo, das 18h às 23h30. Ficaram de fora `priceRange`,
`aggregateRating`, `acceptsReservations`, `geo` e cardápio com preço — nada
disso está confirmado, e dado estruturado errado é pior que dado estruturado
ausente, porque o Google o exibe como se fosse a casa falando.

### O que continua fora, e por quê

Taxa de entrega, raio de atendimento, prazo, pedido mínimo, presença em
aplicativos, política de reserva, preço e promoção. A lista é a mesma da seção
10 e pelo mesmo motivo: ninguém confirmou. Quando a casa confirmar, entra.

### Dois defeitos que a inspeção do build encontrou

Nenhum dos dois foi introduzido nesta rodada; os dois apareceram quando a
página foi olhada de novo com olho de site público.

1. **A pastilha "aberto agora" vazava sem JS.** O `<p class="estado" hidden>`
   é preenchido por script, mas `.estado { display: flex }` ganha do `[hidden]`
   da folha do navegador — resultado: sem JS aparecia uma pastilha vazia com
   uma bolinha cinza dentro. Corrigido com `.estado[hidden] { display: none }`.
2. **O rodapé espremia o endereço entre 768px e 1024px.** A grade de três
   colunas (`logo | contatos | painel`) só cabe em telas largas; em tablet ela
   quebrava "Rua América, 677 — esquina com Antônio João" em seis linhas.
   Agora a terceira coluna só entra a partir de 64rem; abaixo disso o painel
   desce inteiro. No mesmo passo, os links de contato ganharam
   `justify-self: start` — em grade, quem segura o sublinhado no tamanho do
   texto é o eixo inline, e o `align-self` que estava lá não fazia nada.

### O cardápio sem JavaScript

O texto sem script prometia "toque em qualquer prato para ver de perto" e
entregava uma seção vazia, porque a grade é montada em JS. A frase passou a
viver dentro de `.so-com-js`, escondida por um `<style>` dentro de `<noscript>`
— sem piscar, porque quem esconde é o próprio navegador antes da primeira
pintura. No lugar da grade entra um bloco de `<noscript>` que resolve a mesma
pergunta pelo caminho que a casa já usa: pedir o cardápio no WhatsApp.

### Verificação

`pnpm typecheck`, `pnpm lint` e `pnpm build` passam. Inspeção do build servido
em três viewports (390×844, 768×1024, 1440×1000) via CDP: zero erro de
console, zero exceção, zero requisição falha, zero overflow horizontal, 30
imagens carregadas sem quebra — a única "quebra" reportada é a terceira foto
de "Como chegar", que é `display: none` no celular e por isso nunca carrega.
Diálogo de prato, fallback sem JS e rodapé conferidos a olho nas capturas em
`artifacts/previews-publico/` (fora do Git).

## Adendo — 06/08/2026: a fachada reformada

O cliente enviou uma foto nova da casa, e ela não é a mesma casa: a fachada
verde de faixas marrons virou parede escura com toldos, luzes penduradas,
porta de vidro e um letreiro redondo aceso sobre ela. A foto entrou no lugar
de `fachada-noite`. Três coisas mudaram junto, e nenhuma era opcional:

**O enquadramento.** A foto do acervo era quadrada; a nova é retrato 3:4.
Em tela larga o `object-fit: cover` corta na vertical, então o ponto de
ancoragem foi de 42% para 60% da altura — mais alto que isso e o letreiro
caía atrás do menu do cabeçalho.

**A luz.** As duas camadas radiais do véu apontavam para onde estava a porta
na foto antiga (62% × 46% e 60% × 60%). Na nova, o vão está em 44% × 51% e o
letreiro aceso em 51% × 30%; os gradientes foram para lá. O `brightness` caiu
de 0.66 para 0.88: a foto nova tem luminância média 50 contra 90 da anterior,
e o filtro antigo simplesmente a apagava.

**A logo do hero saiu.** Isto corrige, sem desdizer, a linha 2 da tabela de
críticas lá em cima. A logo foi posta no hero quando a marca não aparecia em
lugar nenhum — a fachada antiga tinha um letreiro preto e discreto. Agora a
marca está acesa na própria casa, e em tela estreita o corte é lateral: o
letreiro reaparece sempre, ao lado da logo carimbada, e a primeira dobra ficava
com três vezes o mesmo sinal. A marca segue no cabeçalho e no rodapé. Com
isso, `public/marca/logo-1200.webp` deixou de ter uso e saiu do repositório.

A foto original vive em `assets/fotos-cliente/`, fora do Git, sob a mesma
política do acervo bruto do Instagram, e entra pelo `prepara-assets.py` por
uma segunda tabela (`SELECAO_CLIENTE`) — o que o script gera continua sendo a
única fonte do que vai para `public/img/`. Origem de 960×1280: a escala para
em 960, sem ampliar, e a variante de 1440 deixou de existir.

### Verificação

`pnpm typecheck`, `pnpm lint` e `pnpm build` passam. Abertura conferida em
capturas de 390×844, 820×1180 e 1440×1000 do build servido. Há uma pessoa em
silhueta atrás do vidro da porta, sem rosto legível, e a camada escura do véu
cai justamente sobre o vão — a regra de não publicar cliente identificável
segue valendo.

## Adendo — 07/08/2026: o acervo de 2026 e o cardápio no AnotaAi

Duas mudanças de fundo nesta rodada. A primeira troca a fonte das fotos; a
segunda troca o destino do pedido. Elas revogam pontos deste documento, e os
parágrafos abaixo dizem quais.

### As fotos: o acervo do Instagram deixou de ser a fonte

O cliente não reconhecia mais a própria casa no site, e o motivo não era
estético: a reforma da fachada tornou **falsas** as três fotos da seção "Como
chegar" — letreiro sobre parede verde, esquina de faixa vermelha, fachada de
dia. Quem chegasse pelo site procuraria na rua um prédio que não está lá. Isso
não era um defeito de gosto, era informação errada na única seção cujo trabalho
é fazer a pessoa achar o lugar.

Entraram 18 frames de vídeo que o cliente mandou do evento de Dia dos
Namorados de 2026 — comida, salão e área externa. São **464×832, verticais, de
vídeo de WhatsApp**: essa é a resolução máxima que existe, não há original
melhor a buscar, e o script nunca amplia. A consequência prática é que essas
fotos sustentam card, vitrine e mosaico, e não sustentam largura total.

Quinze delas entraram; três (`mesa-romantica`, `mesa-vela-petalas` e o segundo
quadro da torre) ficaram fora por serem fracas demais. O acervo de 2023 caiu de
26 entradas para sete: os pratos quentes, o carpaccio, um canto do salão e a
área kids — o que a seleção nova não cobre e que não mostra fachada. O bruto de
2026 vive em `assets/fotos-cliente/2026-eventos/`, fora do Git, sob a mesma
política de sempre.

**Revoga a seção 7.** Das quatro imagens da tabela de cortes por rosto de
cliente, três saíram do site (`parede-discos`, `combinado-premium`,
`preparo-fogo`); só `hot-roll` continua publicada, com o mesmo corte. A regra
segue valendo e foi reaplicada: um dos quadros novos tinha uma pessoa em pé
diante da TV e o corte a deixou inteira fora do quadro.

**Revoga a nota de verificação sobre "a terceira foto de Como chegar".** Aquele
bloco tinha três fotos e uma delas era `display: none` no celular; agora tem
duas, ambas de 2026, e a regra de CSS que escondia a terceira saiu junto.

### A faixa do salão: uma perda aceita de propósito

A faixa larga que abre o ato do salão mostrava a parede de discos de palha, de
2023, com 1302px de origem. Ela passou a mostrar o salão atual, com 464px
esticados para a largura da tela. **Isso fica visivelmente mole em desktop** e
foi escolha explícita do cliente, que preferiu a foto verdadeira e sem
nitidez à foto nítida de um salão que já mudou. Se aparecer foto melhor do
salão, é o primeiro lugar a trocar.

### O cardápio: uma fonte de verdade, não duas

A seção `#carta` montava a vitrine sem preço e mandava o cliente perguntar o
valor **item a item no WhatsApp**. O cardápio real, com preço e carrinho, já
existia no AnotaAi. Eram duas verdades sobre a mesma coisa, e a do site cobrava
uma conversa inteira antes do primeiro pedido.

A vitrine ficou — é ela que dá vontade, e é onde as fotos novas trabalham. O
que mudou foi o destino: o botão leva a
`https://pedido.anota.ai/loja/sushi-do-verao-1`, que soma o valor e **fecha no
mesmo WhatsApp da casa** — o AnotaAi não é um canal concorrente do WhatsApp,
é o WhatsApp com o pedido montado. Preço continua sem viver no site, agora por
um motivo melhor que "ninguém confirmou": duplicá-lo criaria a divergência na
primeira mudança de cardápio.

O WhatsApp direto não saiu. Ficou onde a conversa é mesmo necessária — festa,
encomenda sob medida, mesa no salão e dúvida — e saiu de onde só atrasava o
pedido: cabeçalho, abertura e a chamada do rodapé. A mensagem pronta do link
"geral" deixou de dizer "queria fazer um pedido" e passou a dizer "queria tirar
uma dúvida", que é quem chega por ali agora.

O endereço da loja vive em `CARDAPIO_ANOTAAI`, em `conteudo.ts`. O href também
está escrito no HTML, de propósito: sem JS o botão precisa funcionar. O
`[data-cardapio]` reafirma o valor da constante em runtime, mesmo padrão dos
links de WhatsApp.

**Revoga a subseção "O cardápio sem JavaScript".** O bloco de `<noscript>` não
oferece mais pedir o cardápio no WhatsApp: oferece o cardápio do AnotaAi, que
funciona sem script. O aviso da seção também deixou de ser `.so-com-js` pelo
mesmo motivo. E o `menu` do JSON-LD, que apontava para `/#carta`, passou a
apontar para o cardápio de verdade.

### Verificação

`pnpm typecheck`, `pnpm lint` e `pnpm build` passam. Os 24 cortes foram
conferidos um a um na imagem gerada — três janelas foram recusadas e refeitas
por mostrarem coisa diferente do nome do item, e as recusas estão registradas
em comentário no `prepara-assets.py`. O link da loja no AnotaAi responde 200.
**O que não foi feito:** a inspeção da página montada em três viewports, como
nas rodadas anteriores — a automação do navegador falhou nesta sessão. Falta
conferir a olho a faixa do salão em desktop, o mosaico com as proporções novas
e o bloco de "Como chegar" agora com duas fotos.
