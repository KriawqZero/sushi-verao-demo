/**
 * Conteudo da pagina, separado da apresentacao.
 *
 * Regra que atravessa este arquivo: nada aqui afirma fato sem lastro. As
 * descricoes sao autorais e definicionais — dizem o que a peca e em termos
 * gerais ("enrolado com a alga por fora"), nunca ingrediente, porcao, preco
 * ou tecnica que a coleta nao confirmou. Onde ha numero, ele veio do proprio
 * perfil e esta marcado em `nota`.
 *
 * Ver docs/redesign-v2.md e docs/inventario-conteudo.md para a procedencia.
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
 * Horario de funcionamento, informado pelo Marcilio.
 *
 * `dias` usa a convencao de Date.getDay(): 0 = domingo. A casa abre de terca
 * a domingo, entao a segunda (1) fica de fora.
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
 * A redacao evita fingir certeza que o site nao tem: o horario veio do
 * Marcilio, nao do dono, e feriado ou imprevisto nao aparece em calculo de
 * relogio. Por isso o aviso anda sempre colado a um caminho de WhatsApp.
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
          arquivo: 'combinado-verao',
          larguras: [480, 960, 1080],
          proporcao: 1,
          alt: 'Combinado do Verão servido em travessa, com peças variadas de sushi',
        },
      },
      {
        id: 'combinado-premium',
        nome: 'Combinado Premium',
        descricao: 'A seleção maior, montada para ocupar o meio da mesa.',
        imagem: {
          arquivo: 'combinado-premium',
          larguras: [480, 960, 1080],
          proporcao: 1.35,
          alt: 'Combinado Premium com fileiras de sushi em travessa escura',
        },
      },
      {
        id: 'combinado-chef',
        nome: 'Combinado do Chef',
        descricao: 'A escolha do sushiman, decidida na hora.',
        imagem: {
          arquivo: 'combinado-chef',
          larguras: [480, 960, 1440],
          proporcao: 1,
          alt: 'Combinado do Chef com peças dispostas em arranjo sobre o prato',
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
          arquivo: 'sashimi',
          larguras: [480, 960, 1440],
          proporcao: 1.0007,
          alt: 'Fatias de sashimi de salmão dispostas em leque sobre o prato',
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
          arquivo: 'uramaki',
          larguras: [480, 960, 1080],
          proporcao: 1,
          alt: 'Peças de uramaki com arroz por fora, dispostas em prato escuro',
        },
      },
      {
        id: 'makimono',
        nome: 'Makimono',
        descricao: 'O enrolado clássico, com a alga por fora.',
        imagem: {
          arquivo: 'makimono',
          larguras: [480, 960, 1024],
          proporcao: 1,
          alt: 'Peças de makimono enroladas com alga por fora',
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

/** Imagens do ato do lugar, na ordem em que aparecem. */
export const LUGAR: Imagem[] = [
  {
    arquivo: 'parede-discos',
    larguras: [480, 960, 1302],
    proporcao: 2.668,
    alt: 'Parede do salão coberta de discos de palha trançada sob três luminárias de papel acesas',
  },
  {
    arquivo: 'box-vermelho',
    larguras: [480, 912],
    proporcao: 0.7005,
    alt: 'Mesa do salão com prato vermelho, bowl preto e hashi, diante de um box de couro',
  },
  {
    arquivo: 'salao-janela',
    larguras: [480, 960, 1302],
    proporcao: 1,
    alt: 'Mesa de madeira posta ao lado da janela, com bancos estofados e luminárias de papel',
  },
  {
    arquivo: 'salao-mesas',
    larguras: [480, 960, 1302],
    proporcao: 1,
    alt: 'Mesa de tampo claro com cadeiras pretas e dois quadros de círculo vermelho na parede',
  },
  {
    arquivo: 'salao-folhagem',
    larguras: [480, 960, 1302],
    proporcao: 1,
    alt: 'Canto do salão com parede de folhagem ao lado de uma janela de vidro quadriculado',
  },
  {
    arquivo: 'area-kids',
    larguras: [480, 960, 1440],
    proporcao: 0.8,
    alt: 'Área kids com brinquedos de plástico e piso claro',
  },
]
