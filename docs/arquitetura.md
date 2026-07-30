# Arquitetura e conteúdo do site

> **SUPERADO PELA v2 — leia [`redesign-v2.md`](redesign-v2.md) primeiro.**
>
> Este documento descreve a v1, que o Marcilio rejeitou depois de revisar no
> desktop e no celular. Fica como registro da Fase 3. Três pontos daqui estão
> explicitamente revogados:
>
> 1. **A mecânica de pedido (item 4)** — seleção acumulativa, barra fixa e
>    contagem foram removidas por completo. O site não processa pedido e não
>    finge que processa. A carta virou vitrine editorial.
> 2. **A nota sobre o mapa embutido (item 4)** — a alegação de que o embed
>    "exige chave da Maps Embed API" está **errada**. Ela veio de um teste com
>    `curl`, que recebe do Google uma resposta diferente da de um navegador.
>    Em navegador real o embed responde 200 e só exige contexto de iframe.
>    Ver `redesign-v2.md`, seção 4.
> 3. **O acento âmbar (item 1)** — substituído pelo vermelho da própria marca.
> 4. **A política de imagem (item 5)** — continua valendo, mas a v1 **não a
>    cumpria**: três fotos publicadas tinham cliente de rosto visível. Ver
>    `redesign-v2.md`, seção 7.
>
> O que permanece válido: os fatos, as fontes, a procedência dos itens da
> carta e as restrições de conteúdo.

Documento de consolidação da Fase 3. Define o que será construído, com que
texto e com base em qual fonte. Escrito em 30/07/2026, depois das decisões do
Marcilio.

Regra que atravessa tudo: **nenhuma afirmação sem fonte.** As fontes possíveis
são três — perfil público (coletado), Marcilio (informado diretamente), ou
redação autoral que não afirma fato.

## 1. Decisões fechadas

| Tema | Decisão |
| --- | --- |
| Direção | **C — A Casa, com a mecânica de A.** Atmosfera, estrutura e narrativa de C; seleção acumulativa de itens e barra de pedido fixa de A. |
| Acento | **Âmbar do salão** — o dourado das luminárias de palha que existe nas fotos. Substitui o verde-limão. |
| Nome | **Sushi do Verão** |
| Funcionamento | **Terça a domingo, 19h às 23h30** — informado pelo Marcilio. |
| Localização | Endereço + foto da fachada + links de rota. Ver nota abaixo. |
| Módulo história | **Não existe.** Decisão de 30/07/2026. |
| Preços | **Não exibidos.** |
| Promoções | **Não exibidas.** |
| Rostos de clientes | **Não usados.** Ver item 5. |

### Posicionamento — o que mudou na Fase 3

O Marcilio informou que o Sushi do Verão é o restaurante mais chique de
Corumbá, frequentado pela elite local. Isso explica uma contradição que a
coleta tinha exposto sem conseguir interpretar:

> O perfil de 2022-2023 mostra salão cheio, prato montado e ambiente de
> ocasião. O perfil de 2024-2026 é composto quase inteiramente de flyers de
> oferta — "Quarta Quádrupla", valores em destaque, "somente delivery".

Ou seja: **a comunicação atual sub-posiciona o negócio.** Ela fala de preço
para um público que vai pelo lugar. Esse é o argumento comercial central da
demo, mais forte que a ausência de link na bio: o site devolve à casa o
posicionamento que o feed perdeu.

Consequência de projeto: o site não usa nenhuma linguagem promocional. Sem
selo de desconto, sem urgência, sem "aproveite". O tom é de convite.

## 2. Arquitetura das seções

| # | Seção | Função | Fonte do conteúdo |
| --- | --- | --- | --- |
| 1 | Abertura | Fachada à noite, nome, endereço, dois CTAs | foto coletada; endereço do perfil |
| 2 | Cardápio | Núcleo. Filtro por categoria, grade com foto, seleção acumulativa | itens nomeados pelo perfil |
| 3 | Encomendas e eventos | Ticket alto: festa, barca grande, buffet | legendas e publicações de parceiros |
| 4 | O lugar | Fachada, salão, mesas, área kids | fotos coletadas |
| 5 | Onde e quando | Endereço, horário, mapa embutido, contatos | perfil + Marcilio |
| 6 | Rodapé | Contato, redes, aviso de conceito | perfil |

Não há seção de história, de equipe, de depoimentos nem de preços.

## 3. Cardápio — itens e procedência

Só entram itens que o **próprio perfil** nomeia. Os nomes vindos de publicação
de terceiro de 2024 ("Joe Sofia", "Sofia Camarão", "Skin Uramaki") ficam de
fora por não terem validação.

Regra adicional, descoberta durante a implementação: **um item só entra se
existir foto que corresponda de fato a ele.** Ao conferir imagem por imagem
contra o nome, cinco itens estavam errados — "Camarão do Verão" exibia
sashimi, o bloco de "buffet" era um prato individual, e Uramaki e Makimono
estavam trocados entre si. Corrigi as trocas e **removi** os itens sem foto
correspondente (Niguiri, Temaki, Joe, Paella) em vez de ilustrá-los com uma
imagem aproximada. Onze itens certos valem mais que quinze com legenda errada.

| Categoria | Itens |
| --- | --- |
| Combinados | Combinado do Verão (32 peças) · Combinado Premium · Combinado do Chef |
| Do balcão | Sashimi · Carpaccio de salmão · Uramaki · Makimono |
| Hot | Hot roll |
| Quentes | Yakisoba · Risoto de camarão |
| Frutos do mar | Polvo |

As descrições são **autorais e não afirmam fato** — descrevem o que o item é
em termos genéricos ("cone de alga", "empanado e servido quente"), sem
prometer ingrediente, porção, tamanho ou preço que não foram confirmados.

Quantidades de peça só aparecem quando o perfil as declarou: o Combinado do
Verão aparece como 32 peças em artes do próprio perfil.

## 4. Mecânica do pedido

1. Cada item tem um botão de adicionar; a seleção é acumulativa.
2. Uma barra fixa mostra a contagem e o botão de envio.
3. O envio abre o WhatsApp com mensagem pré-montada:

> Olá! Vim pelo site e tenho interesse em:
> · 1x Combinado do Verão
> · 2x Temaki
> Pode me passar os valores e o tempo de entrega?

A mensagem **pede** o orçamento em vez de afirmar preço. Isso resolve a
restrição de não exibir valores e ainda torna o pedido útil.

Número de destino: (67) 99991-7786 — `+5567999917786`, cadastrado no perfil
comercial e presente em ~110 publicações.

### Nota sobre o mapa embutido

O Marcilio pediu Google Maps embutido. **Não foi entregue como iframe**, por
impedimento técnico verificado, não por escolha de estilo:

- o embed do Google (`maps.google.com/...&output=embed`) responde com
  `x-frame-options: SAMEORIGIN` — exige chave da Maps Embed API;
- o embed do OpenStreetMap carrega, mas os tiles voltam com
  `x-blocked: Access denied` pela política de uso da OSM Foundation nesta rede;
- nenhum dos dois renderizou em teste real de navegador aqui.

Um mapa que não carrega é pior que nenhum mapa. O que entrou no lugar: foto
real da fachada como âncora visual, endereço completo e dois botões que
sempre funcionam — "Como chegar" (Google Maps) e "Ver no mapa"
(OpenStreetMap), ambos abrindo fora do site com as coordenadas do cadastro
comercial do perfil.

**Para ter mapa embutido de verdade**, o caminho é uma chave da Google Maps
Embed API. É decisão do Marcilio: exige conta Google Cloud e a chave fica
exposta no HTML, ainda que restrita por domínio.

## 5. Política de imagem

- **Nenhuma foto com rosto identificável de cliente.** Decisão tomada por
  responsabilidade, não por estética: são pessoas reais, a casa é frequentada
  por figuras públicas locais, e nada disso foi autorizado. Só entram tomadas
  de salão vazio, mesas postas, fachada e prato.

  Uma ressalva honesta: a foto de abertura é a fachada à noite, e pela porta
  aberta aparecem clientes ao fundo. Ampliei a região para conferir — são
  silhuetas de costas e de perfil, à distância, sob o escurecimento aplicado
  pelo site; nenhum rosto é reconhecível. Julguei aceitável. Se o Marcilio
  discordar, a substituta é a fachada de dia, que não tem ninguém, ao custo de
  perder o clima noturno que combina com o horário da casa.
- Nenhuma imagem gerada por IA.
- Nenhuma arte promocional (flyer) — não representa o posicionamento adotado.
- Mídia bruta permanece fora do Git; ao repositório vai apenas a seleção
  otimizada.

## 6. Textos-chave

Abertura:
> **Tem sushi na esquina da Antônio João.**
> Salão aberto de terça a domingo, das 19h às 23h30. Delivery e encomenda
> para festa. Peça pelo WhatsApp ou venha sentar.

Encomendas:
> **Sua festa com sushi de verdade.**
> Aniversário, confraternização, réveillon. A casa já montou banquete fora —
> barca grande, mesa completa, combinado sob medida.

O lugar:
> **O lugar.**
> Esquina do Centro, salão com mesa de madeira, luminária de papel e parede
> verde. Tem espaço para criança também.

Aviso de conceito (rodapé):
> Conceito independente criado pela Avantis a partir de conteúdo público do
> Instagram. Não é o site oficial e não foi encomendado, revisado ou aprovado
> pelo estabelecimento.

## 7. Stack

**Vite + TypeScript, sem framework.** Justificativa:

- a página é estática, com uma única ilha de interatividade (filtro + seleção
  de itens); framework aqui adicionaria peso sem remover trabalho;
- é a mesma stack dos dois demos anteriores da Avantis, o que mantém o
  processo consistente e reduz risco;
- TypeScript dá segurança no único ponto com estado real, que é a seleção;
- build estático puro, sem servidor, sem backend, sem admin.

Gerenciador: **pnpm**. Imagens otimizadas em etapa de preparação, versionadas
já processadas em `public/img/`.
