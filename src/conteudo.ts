/**
 * Conteudo da pagina, separado da apresentacao.
 *
 * Regra de edicao deste arquivo: as descricoes dizem o que a peca e em termos
 * gerais ("enrolado com a alga por fora") e nao entram em ingrediente, porcao,
 * preco ou tecnica que nao esteja confirmado com a casa. Preco nunca entra
 * aqui — ele vive no AnotaAi, que e a fonte unica, e duplicar seria criar duas
 * verdades que divergem na primeira alteracao de cardapio.
 *
 * Ao incluir prato novo, mande junto a foto: item sem imagem quebra a grade.
 */

export interface Imagem {
  /** nome-base do arquivo em /img, sem largura nem extensao */
  arquivo: string
  /** larguras disponiveis, na ordem crescente — vira o srcset */
  larguras: number[]
  /** largura / altura, usado para reservar espaco e evitar CLS */
  proporcao: number
  alt: string
}

export interface ItemCarta {
  id: string
  nome: string
  descricao: string
  /** so aparece quando o proprio perfil declarou o numero */
  nota?: string
  imagem: Imagem
}

export interface CapituloCarta {
  id: string
  titulo: string
  chamada: string
  itens: ItemCarta[]
}

export const CONTATO = {
  telefone: '+5567999917786',
  telefoneVisivel: '(67) 99991-7786',
  instagram: 'https://www.instagram.com/rodrigo_verao/',
  instagramVisivel: '@rodrigo_verao',
  endereco: 'Rua América, 677 — esquina com Antônio João',
  bairro: 'Centro, Corumbá — MS',
  cep: '79302-070',
  coordenadas: { lat: -19.0108, lng: -57.6525 },
  funcionamento: 'Terça a domingo, das 19h às 23h30',
} as const

/** Consulta de endereco usada tanto no embed quanto no link externo. */
export const CONSULTA_MAPA = 'Sushi do Verão, Rua América, 677, Corumbá - MS, 79302-070'

/**
 * Cardapio completo, com preco e carrinho, no AnotaAi.
 *
 * Ate 07/08/2026 o site pedia para o cliente perguntar o valor item a item no
 * WhatsApp. O cardapio com preco ja existia no AnotaAi — eram duas verdades, e
 * a do site custava uma conversa inteira antes do primeiro pedido. A vitrine
 * daqui continua: ela e o que da vontade. Quem decidiu vai para o AnotaAi, que
 * monta o pedido e fecha pelo mesmo WhatsApp da casa, ja com o valor somado.
 *
 * O WhatsApp direto nao saiu: ele continua onde a conversa e mesmo necessaria
 * — festa, encomenda sob medida, mesa no salao e duvida.
 */
export const CARDAPIO_ANOTAAI = 'https://pedido.anota.ai/loja/sushi-do-verao-1'

/**
 * Horario de funcionamento da casa.
 *
 * `dias` usa a convencao de Date.getDay(): 0 = domingo. A casa abre de terca
 * a domingo, entao a segunda (1) fica de fora. Mudou o horario? Mexa aqui e
 * no texto por extenso do HTML — os dois precisam contar a mesma coisa.
 */
export const HORARIO: {
  fuso: string
  dias: readonly number[]
  abre: number
  fecha: number
  abreTexto: string
  fechaTexto: string
  resumo: string
} = {
  fuso: 'America/Campo_Grande',
  dias: [0, 2, 3, 4, 5, 6],
  abre: 19 * 60,
  fecha: 23 * 60 + 30,
  abreTexto: '19h',
  fechaTexto: '23h30',
  resumo: 'Terça a domingo, das 19h às 23h30',
}

const NOMES_DIA = [
  'domingo',
  'segunda',
  'terça',
  'quarta',
  'quinta',
  'sexta',
  'sábado',
] as const

/** Hora corrente em Corumba, independente do fuso de quem esta visitando. */
function agoraNaCasa(): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: HORARIO.fuso,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const pega = (tipo: string): string =>
    partes.find((p) => p.type === tipo)?.value ?? ''

  const semana: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  // alguns runtimes devolvem "24" para meia-noite com hour12: false
  const hora = Number(pega('hour')) % 24
  return { dia: semana[pega('weekday')] ?? 0, minutos: hora * 60 + Number(pega('minute')) }
}

export interface EstadoDaCasa {
  aberto: boolean
  principal: string
  apoio: string
}

/**
 * Diz se a casa esta servindo agora.
 *
 * O calculo e do relogio: feriado e imprevisto nao entram nele. Por isso o
 * marcador anda sempre colado a um caminho de WhatsApp, que e onde a duvida
 * de verdade se resolve.
 */
export function estadoDaCasa(): EstadoDaCasa {
  const { dia, minutos } = agoraNaCasa()
  const abreHoje = HORARIO.dias.includes(dia)

  if (abreHoje && minutos >= HORARIO.abre && minutos < HORARIO.fecha) {
    return {
      aberto: true,
      principal: 'Estamos abertos agora',
      apoio: `Fechamos às ${HORARIO.fechaTexto}`,
    }
  }

  if (abreHoje && minutos < HORARIO.abre) {
    return {
      aberto: false,
      principal: 'Estamos fechados agora',
      apoio: `Abrimos hoje às ${HORARIO.abreTexto}`,
    }
  }

  // já fechou hoje, ou é o dia de folga: procura o próximo dia de abertura
  for (let i = 1; i <= 7; i += 1) {
    const proximo = (dia + i) % 7
    if (!HORARIO.dias.includes(proximo)) continue
    const quando = i === 1 ? 'amanhã' : NOMES_DIA[proximo]
    return {
      aberto: false,
      principal: 'Estamos fechados agora',
      apoio: `Abrimos ${quando} às ${HORARIO.abreTexto}`,
    }
  }

  return { aberto: false, principal: 'Estamos fechados agora', apoio: HORARIO.resumo }
}

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${CONTATO.telefone.replace('+', '')}?text=${encodeURIComponent(mensagem)}`
}

export const CAPITULOS: CapituloCarta[] = [
  {
    id: 'combinados',
    titulo: 'Combinados',
    chamada: 'Travessas para dividir na mesa.',
    itens: [
      {
        id: 'combinado-verao',
        nome: 'Combinado do Verão',
        descricao: 'O combinado que leva o nome da casa.',
        nota: '32 peças',
        imagem: {
          arquivo: 'combinado-variado',
          larguras: [464],
          proporcao: 1,
          alt: 'Travessa cheia de peças variadas — maki de salmão, folhas verdes e salmão picado no centro',
        },
      },
      {
        id: 'combinado-premium',
        nome: 'Combinado Premium',
        descricao: 'A seleção maior, montada para ocupar o meio da mesa.',
        imagem: {
          arquivo: 'torre-camarao-travessa',
          larguras: [464],
          proporcao: 1,
          alt: 'Travessa grande com fileiras de sushi e uma torre de camarão espetada num abacaxi ao fundo',
        },
      },
      {
        id: 'combinado-chef',
        nome: 'Combinado do Chef',
        descricao: 'A escolha do sushiman, decidida na hora.',
        imagem: {
          arquivo: 'travessa-niguiri',
          larguras: [464],
          proporcao: 0.7496,
          alt: 'Travessa redonda com fileiras de niguiri de salmão ao lado de uramaki',
        },
      },
    ],
  },
  {
    id: 'balcao',
    titulo: 'Do balcão',
    chamada: 'Cortado na hora, sem passar pelo fogo.',
    itens: [
      {
        id: 'sashimi',
        nome: 'Sashimi',
        descricao: 'Peixe cru em fatias, servido sem arroz.',
        imagem: {
          arquivo: 'sashimi-leque',
          larguras: [464],
          proporcao: 1,
          alt: 'Fatias de sashimi de salmão dispostas em leque, cobrindo a travessa inteira',
        },
      },
      {
        id: 'carpaccio',
        nome: 'Carpaccio de salmão',
        descricao: 'Lâminas finas de salmão, servidas frias.',
        imagem: {
          arquivo: 'carpaccio',
          larguras: [480, 960, 1440],
          proporcao: 1,
          alt: 'Carpaccio de salmão em lâminas finas cobrindo o prato',
        },
      },
      {
        id: 'uramaki',
        nome: 'Uramaki',
        descricao: 'Enrolado ao contrário: o arroz fica por fora da alga.',
        imagem: {
          arquivo: 'uramaki-2026',
          larguras: [464],
          proporcao: 1,
          alt: 'Peças de uramaki com o arroz e o gergelim por fora, ao lado de beterraba ralada na travessa',
        },
      },
      {
        id: 'makimono',
        nome: 'Makimono',
        descricao: 'O enrolado clássico, com a alga por fora.',
        imagem: {
          arquivo: 'makimono-2026',
          larguras: [325],
          proporcao: 1,
          alt: 'Peças de makimono enroladas com a alga por fora, com salmão no centro',
        },
      },
    ],
  },
  {
    id: 'quentes',
    titulo: 'Da cozinha quente',
    chamada: 'O que sai quente da cozinha.',
    itens: [
      {
        id: 'hot-roll',
        nome: 'Hot roll',
        descricao: 'Enrolado empanado e frito, servido quente.',
        imagem: {
          arquivo: 'hot-roll',
          larguras: [480, 960, 1080],
          proporcao: 1.1625,
          alt: 'Fileira de hot rolls empanados, finalizados com molho escuro',
        },
      },
      {
        id: 'yakisoba',
        nome: 'Yakisoba',
        descricao: 'Macarrão salteado com legumes.',
        imagem: {
          arquivo: 'yakisoba',
          larguras: [480, 960, 1080],
          proporcao: 1.3284,
          alt: 'Yakisoba com macarrão e legumes salteados servido no prato',
        },
      },
      {
        id: 'risoto-camarao',
        nome: 'Risoto de camarão',
        descricao: 'Arroz cremoso com camarão.',
        imagem: {
          arquivo: 'risoto-camarao',
          larguras: [480, 960, 991],
          proporcao: 0.999,
          alt: 'Risoto de camarão servido em prato de louça azul e branca',
        },
      },
      {
        id: 'polvo',
        nome: 'Polvo',
        descricao: 'Servido como prato, não como peça de sushi.',
        imagem: {
          arquivo: 'polvo',
          larguras: [480, 960, 1440],
          proporcao: 0.8,
          alt: 'Prato de polvo servido com molho escuro',
        },
      },
    ],
  },
]

/**
 * Imagens do ato do lugar, na ordem em que aparecem.
 *
 * A primeira e a faixa larga que abre a secao, no HTML; as outras cinco caem
 * no mosaico, cujas proporcoes vem do CSS e nao daqui. Os dois quadros de 2023
 * que sobraram — o canto da janela e a area kids — ocupam justamente as celulas
 * horizontais do mosaico, que as fotos verticais de 2026 nao preenchem.
 */
export const LUGAR: Imagem[] = [
  {
    arquivo: 'salao-coracoes',
    larguras: [464],
    proporcao: 2.6667,
    alt: 'Faixa do salão com luminárias de vime acesas e balões de coração vermelhos sobre a parede de tijolo',
  },
  {
    arquivo: 'ambiente-petalas',
    larguras: [464],
    proporcao: 0.7496,
    alt: 'Mesa de madeira posta com pétalas de rosa espalhadas e uma taça com vela acesa dentro',
  },
  {
    arquivo: 'salao-janela',
    larguras: [480, 960, 1302],
    proporcao: 1,
    alt: 'Mesa de madeira posta ao lado da janela, com bancos estofados e luminárias de papel',
  },
  {
    arquivo: 'mesa-baloes',
    larguras: [464],
    proporcao: 1,
    alt: 'Mesa junto à vidraça com balões de coração, taça com vela e o número da mesa em pé',
  },
  {
    arquivo: 'mesa-petalas-taca',
    larguras: [372],
    proporcao: 1,
    alt: 'Mesa posta com prato branco, pétalas de rosa e uma taça com vela acesa ao fundo',
  },
  {
    arquivo: 'area-kids',
    larguras: [480, 960, 1440],
    proporcao: 0.8,
    alt: 'Área kids com brinquedos de plástico e piso claro',
  },
]
