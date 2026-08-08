/**
 * Sushi do Verão — site.
 *
 * Toda a interatividade daqui serve a quem chegou com uma pergunta: dizer se
 * a casa está aberta agora, mostrar os pratos, abrir um de perto e entregar o
 * pedido a quem sabe fechá-lo. Não existe carrinho, contador, valor nem
 * checkout aqui: isso é do AnotaAi, e o site não finge o contrário. O
 * WhatsApp continua no que é conversa — festa, encomenda e mesa no salão.
 */

import './style.css'
import {
  CAPITULOS,
  CARDAPIO_ANOTAAI,
  LUGAR,
  estadoDaCasa,
  linkWhatsApp,
  type CapituloCarta,
  type Imagem,
  type ItemCarta,
} from './conteudo'

/* =========================================================================
   utilidades de imagem
   ========================================================================= */

function srcset(img: Imagem): string {
  return img.larguras.map((l) => `/img/${img.arquivo}-${l}.webp ${l}w`).join(', ')
}

function maiorLargura(img: Imagem): number {
  return img.larguras[img.larguras.length - 1] ?? 960
}

/**
 * Monta um <img> com srcset, sizes e width/height reais. O par width/height
 * existe para o navegador reservar a altura antes do download — é o que
 * mantém o CLS em zero.
 */
function montaImagem(img: Imagem, sizes: string, lazy = true): HTMLImageElement {
  const el = document.createElement('img')
  const largura = maiorLargura(img)
  el.src = `/img/${img.arquivo}-${largura}.webp`
  el.srcset = srcset(img)
  el.sizes = sizes
  el.width = largura
  el.height = Math.round(largura / img.proporcao)
  el.alt = img.alt
  if (lazy) {
    el.loading = 'lazy'
    el.decoding = 'async'
  }
  return el
}

/* =========================================================================
   ato II — a carta
   ========================================================================= */

const SIZES_ITEM_GRANDE = '(min-width: 48rem) 38vw, 47vw'
const SIZES_ITEM = '(min-width: 48rem) 19vw, 47vw'

function montaItem(item: ItemCarta, capitulo: CapituloCarta, indice: number): HTMLElement {
  const botao = document.createElement('button')
  botao.type = 'button'
  botao.className = 'item'
  botao.dataset.item = item.id
  botao.setAttribute('aria-haspopup', 'dialog')
  // o rótulo acessível diz o que o botão faz, não só o nome do prato
  botao.setAttribute('aria-label', `${item.nome} — ver de perto, em ${capitulo.titulo}`)

  const moldura = document.createElement('div')
  moldura.className = 'item__foto'
  moldura.append(montaImagem(item.imagem, indice === 0 ? SIZES_ITEM_GRANDE : SIZES_ITEM))

  const nome = document.createElement('h4')
  nome.className = 'item__nome'
  nome.append(document.createTextNode(item.nome))
  if (item.nota) {
    const nota = document.createElement('span')
    nota.className = 'item__nota'
    nota.textContent = item.nota
    nome.append(nota)
  }

  const descricao = document.createElement('p')
  descricao.className = 'item__descricao'
  descricao.textContent = item.descricao

  const ver = document.createElement('span')
  ver.className = 'item__ver'
  ver.setAttribute('aria-hidden', 'true')
  ver.textContent = 'Ver de perto'

  botao.append(moldura, nome, descricao, ver)
  return botao
}

function montaCapitulo(capitulo: CapituloCarta): HTMLElement {
  const secao = document.createElement('section')
  secao.className = 'capitulo'
  secao.id = `capitulo-${capitulo.id}`
  secao.setAttribute('aria-labelledby', `titulo-${capitulo.id}`)

  const cabecalho = document.createElement('div')
  cabecalho.className = 'capitulo__cabecalho'
  cabecalho.setAttribute('data-revela', '')

  const titulo = document.createElement('h3')
  titulo.id = `titulo-${capitulo.id}`
  titulo.textContent = capitulo.titulo

  const chamada = document.createElement('p')
  chamada.className = 'capitulo__chamada'
  chamada.textContent = capitulo.chamada

  cabecalho.append(titulo, chamada)

  const grade = document.createElement('div')
  grade.className = 'capitulo__itens'
  capitulo.itens.forEach((item, i) => {
    const el = montaItem(item, capitulo, i)
    el.setAttribute('data-revela', '')
    // escalonamento curto: 45ms por item, com teto para não arrastar
    el.style.setProperty('--atraso', `${Math.min(i, 4) * 45}ms`)
    grade.append(el)
  })

  secao.append(cabecalho, grade)
  return secao
}

function montaNavCapitulos(): HTMLElement {
  const nav = document.createElement('nav')
  nav.className = 'capitulos-nav'
  nav.setAttribute('aria-label', 'Capítulos da carta')
  for (const capitulo of CAPITULOS) {
    const link = document.createElement('a')
    link.className = 'capitulos-nav__item'
    link.href = `#capitulo-${capitulo.id}`
    link.textContent = capitulo.titulo
    link.dataset.alvo = `capitulo-${capitulo.id}`
    nav.append(link)
  }
  return nav
}

function renderizaCarta(): void {
  const alvo = document.querySelector<HTMLElement>('#carta-corpo')
  if (!alvo) return
  alvo.append(montaNavCapitulos())
  for (const capitulo of CAPITULOS) alvo.append(montaCapitulo(capitulo))
}

/* =========================================================================
   ato III — o salão
   ========================================================================= */

function renderizaLugar(): void {
  const alvo = document.querySelector<HTMLElement>('#salao-mosaico')
  if (!alvo) return
  // a primeira imagem (o panorama) já está no HTML; aqui entram as demais
  LUGAR.slice(1).forEach((img, i) => {
    const moldura = document.createElement('div')
    moldura.className = 'foto foto--luz'
    moldura.setAttribute('data-revela', '')
    moldura.style.setProperty('--atraso', `${Math.min(i, 4) * 45}ms`)
    moldura.append(montaImagem(img, '(min-width: 56rem) 33vw, 47vw'))
    alvo.append(moldura)
  })
}

/* =========================================================================
   detalhe do item — diálogo nativo
   ========================================================================= */

interface RefsDialogo {
  dialogo: HTMLDialogElement
  capitulo: HTMLElement
  titulo: HTMLElement
  descricao: HTMLElement
  nota: HTMLElement
  foto: HTMLElement
  acao: HTMLAnchorElement
}

function pegaRefs(): RefsDialogo | null {
  const dialogo = document.querySelector<HTMLDialogElement>('#detalhe')
  if (!dialogo) return null
  const capitulo = dialogo.querySelector<HTMLElement>('#detalhe-capitulo')
  const titulo = dialogo.querySelector<HTMLElement>('#detalhe-titulo')
  const descricao = dialogo.querySelector<HTMLElement>('#detalhe-descricao')
  const nota = dialogo.querySelector<HTMLElement>('#detalhe-nota')
  const foto = dialogo.querySelector<HTMLElement>('#detalhe-foto')
  const acao = dialogo.querySelector<HTMLAnchorElement>('#detalhe-acao')
  if (!capitulo || !titulo || !descricao || !nota || !foto || !acao) return null
  return { dialogo, capitulo, titulo, descricao, nota, foto, acao }
}

function ligaDetalhe(): void {
  const encontrado = pegaRefs()
  if (!encontrado) return
  // cópia já estreitada: funções aninhadas não herdam o narrowing do guard
  const refs: RefsDialogo = encontrado

  const indice = new Map<string, { item: ItemCarta; capitulo: CapituloCarta }>()
  for (const capitulo of CAPITULOS) {
    for (const item of capitulo.itens) indice.set(item.id, { item, capitulo })
  }

  // guarda quem abriu, para devolver o foco no fechamento
  let origem: HTMLElement | null = null

  function abre(id: string, gatilho: HTMLElement): void {
    const achado = indice.get(id)
    if (!achado) return
    const { item, capitulo } = achado

    refs.capitulo.textContent = capitulo.titulo
    refs.titulo.textContent = item.nome
    refs.descricao.textContent = item.descricao

    if (item.nota) {
      refs.nota.textContent = item.nota
      refs.nota.hidden = false
    } else {
      refs.nota.hidden = true
    }

    refs.foto.replaceChildren(montaImagem(item.imagem, '(min-width: 46rem) 32rem, 100vw', false))

    // O AnotaAi não expõe link por item, então a ação leva ao cardápio inteiro.
    // Antes daqui saía um WhatsApp com "queria pedir X" pré-escrito: parecia
    // mais direto, mas era o começo de uma negociação de preço, não um pedido.
    refs.acao.href = CARDAPIO_ANOTAAI

    origem = gatilho
    refs.dialogo.showModal()
  }

  document.addEventListener('click', (ev) => {
    const alvo = (ev.target as HTMLElement | null)?.closest<HTMLElement>('[data-item]')
    if (alvo?.dataset.item) abre(alvo.dataset.item, alvo)
  })

  // clique no backdrop fecha: o <dialog> recebe o clique fora do conteúdo
  refs.dialogo.addEventListener('click', (ev) => {
    if (ev.target === refs.dialogo) refs.dialogo.close()
  })

  refs.dialogo.querySelector('[data-fechar]')?.addEventListener('click', () => {
    refs.dialogo.close()
  })

  refs.dialogo.addEventListener('close', () => {
    origem?.focus()
    origem = null
  })
}

/* =========================================================================
   header: estado preso e seção corrente
   ========================================================================= */

function ligaTopo(): void {
  const topo = document.querySelector<HTMLElement>('.topo')
  if (!topo) return

  const sentinela = document.createElement('div')
  sentinela.setAttribute('aria-hidden', 'true')
  sentinela.style.cssText = 'position:absolute;top:4rem;height:1px;width:1px;'
  document.body.prepend(sentinela)

  new IntersectionObserver(
    ([entrada]) => {
      topo.dataset.preso = entrada?.isIntersecting ? 'nao' : 'sim'
    },
    { threshold: 0 },
  ).observe(sentinela)
}

/**
 * Marca no menu a seção que está sendo lida. Vale para a navegação do topo e
 * para a navegação de capítulos da carta, com o mesmo observador.
 */
function ligaSecaoCorrente(): void {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>('.topo__link[data-alvo]'),
    ...document.querySelectorAll<HTMLAnchorElement>('.capitulos-nav__item[data-alvo]'),
  ]
  if (!links.length) return

  const porAlvo = new Map<string, HTMLAnchorElement[]>()
  for (const link of links) {
    const alvo = link.dataset.alvo
    if (!alvo) continue
    porAlvo.set(alvo, [...(porAlvo.get(alvo) ?? []), link])
  }

  const visiveis = new Set<string>()
  const ordem = [...porAlvo.keys()]

  function atualiza(): void {
    const corrente = ordem.find((id) => visiveis.has(id))
    for (const [id, lista] of porAlvo) {
      for (const link of lista) {
        if (id === corrente) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      }
    }
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) visiveis.add(e.target.id)
        else visiveis.delete(e.target.id)
      }
      atualiza()
    },
    // a faixa central da tela decide qual seção está "sendo lida"
    { rootMargin: '-45% 0px -45% 0px' },
  )

  for (const id of ordem) {
    const secao = document.getElementById(id)
    if (secao) observador.observe(secao)
  }
}

/* =========================================================================
   revelação: a luz acendendo na ordem de leitura
   ========================================================================= */

function ligaRevelacao(): void {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const alvos = document.querySelectorAll<HTMLElement>('[data-revela]')

  if (reduzido || !('IntersectionObserver' in window)) {
    for (const el of alvos) el.dataset.visivel = 'sim'
    return
  }

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        ;(e.target as HTMLElement).dataset.visivel = 'sim'
        obs.unobserve(e.target) // revela uma vez só; não pisca ao rolar de volta
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
  )

  for (const el of alvos) observador.observe(el)
}

/* =========================================================================
   estamos abertos agora?
   ========================================================================= */

/**
 * Responde a pergunta que quem chega pelo link da bio faz primeiro. O
 * marcador só é preenchido por JS: sem script, o visitante continua vendo o
 * horário por extenso, que é a informação de base e nunca fica desatualizada.
 */
function ligaEstado(): void {
  const alvo = document.querySelector<HTMLElement>('[data-estado]')
  if (!alvo) return

  function pinta(): void {
    if (!alvo) return
    const estado = estadoDaCasa()
    alvo.dataset.aberto = estado.aberto ? 'sim' : 'nao'

    const principal = alvo.querySelector<HTMLElement>('[data-estado-principal]')
    const apoio = alvo.querySelector<HTMLElement>('[data-estado-apoio]')
    if (principal) principal.textContent = estado.principal
    if (apoio) apoio.textContent = estado.apoio

    alvo.hidden = false
  }

  pinta()
  // a página pode ficar aberta atravessando a hora de abrir ou fechar
  window.setInterval(pinta, 60_000)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) pinta()
  })
}

/* =========================================================================
   caminhos de pedido
   ========================================================================= */

/**
 * Reafirma o endereço do cardápio nos botões marcados com [data-cardapio].
 *
 * O href já está escrito no HTML de propósito: sem JS o botão precisa
 * funcionar. Isto aqui existe pelo mesmo motivo dos links de WhatsApp — se a
 * loja no AnotaAi mudar de endereço, muda-se `CARDAPIO_ANOTAAI` e o HTML vira
 * fallback, não a fonte que alguém esqueceu de atualizar.
 */
function ligaCardapio(): void {
  for (const el of document.querySelectorAll<HTMLAnchorElement>('[data-cardapio]')) {
    el.href = CARDAPIO_ANOTAAI
  }
}

/* =========================================================================
   links de WhatsApp com mensagem pronta
   ========================================================================= */

function ligaWhatsApp(): void {
  const mensagens: Record<string, string> = {
    // "geral" deixou de ser o caminho do pedido quando o cardápio foi para o
    // AnotaAi: aqui chega quem tem uma pergunta, não quem quer o valor de um
    // item. A mensagem pronta acompanhou a mudança.
    geral: 'Olá! Vim pelo site de vocês e queria tirar uma dúvida.',
    evento:
      'Olá! Vim pelo site e queria um orçamento para uma festa. ' +
      'Posso passar a data, quantas pessoas e o local?',
    mesa: 'Olá! Vim pelo site e queria falar sobre mesa no salão.',
    entrega: 'Olá! Vim pelo site e queria pedir para entrega. Posso passar o meu endereço?',
  }
  const padrao = mensagens.geral ?? ''
  for (const el of document.querySelectorAll<HTMLAnchorElement>('[data-zap]')) {
    const chave = el.dataset.zap ?? 'geral'
    el.href = linkWhatsApp(mensagens[chave] ?? padrao)
  }
}

/* =========================================================================
   partida
   ========================================================================= */

function inicia(): void {
  document.documentElement.classList.add('js')
  renderizaCarta()
  renderizaLugar()
  ligaDetalhe()
  ligaTopo()
  ligaSecaoCorrente()
  ligaEstado()
  ligaCardapio()
  ligaWhatsApp()
  ligaRevelacao()

  // o ano do rodapé sai do relógio, não de um número escrito à mão
  const ano = document.querySelector<HTMLElement>('[data-ano]')
  if (ano) ano.textContent = String(new Date().getFullYear())
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicia, { once: true })
} else {
  inicia()
}
