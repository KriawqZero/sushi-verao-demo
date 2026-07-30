/**
 * Itens do cardápio.
 *
 * Regra de procedência: só entram itens que o próprio perfil `@rodrigo_verao`
 * nomeia publicamente. Nomes vindos de publicação de terceiro sem validação
 * (por exemplo "Joe Sofia", "Skin Uramaki") ficam de fora.
 *
 * As descrições são autorais e propositalmente genéricas: dizem o que o item
 * é, sem prometer ingrediente, porção ou preço que não foram confirmados.
 * Preço não é exibido em lugar nenhum — a conversa de valor acontece no
 * WhatsApp, por decisão de briefing.
 */

export type Categoria =
  | 'combinados'
  | 'balcao'
  | 'hot'
  | 'quentes'
  | 'mar';

export interface Item {
  readonly id: string;
  readonly nome: string;
  /** Descrição autoral; não afirma fato não confirmado. */
  readonly descricao: string;
  readonly categoria: Categoria;
  /** Base do arquivo em /img (sufixos -sm e -lg). */
  readonly img: string;
  /** Texto alternativo da imagem. */
  readonly alt: string;
  /** Detalhe só quando declarado pelo próprio perfil. */
  readonly nota?: string;
}

export const CATEGORIAS: ReadonlyArray<{ id: Categoria | 'tudo'; rotulo: string }> = [
  { id: 'tudo', rotulo: 'Tudo' },
  { id: 'combinados', rotulo: 'Combinados' },
  { id: 'balcao', rotulo: 'Do balcão' },
  { id: 'hot', rotulo: 'Hot' },
  { id: 'quentes', rotulo: 'Quentes' },
  { id: 'mar', rotulo: 'Frutos do mar' },
];

export const ITENS: readonly Item[] = [
  {
    id: 'combinado-verao',
    nome: 'Combinado do Verão',
    descricao: 'O combinado que leva o nome da casa, com peças variadas.',
    categoria: 'combinados',
    img: 'combinado-verao',
    alt: 'Combinado de sushi variado servido em barca de madeira',
    nota: '32 peças',
  },
  {
    id: 'combinado-premium',
    nome: 'Combinado Premium',
    descricao: 'Seleção maior, pensada para dividir na mesa.',
    categoria: 'combinados',
    img: 'combinado-premium',
    alt: 'Bandeja com combinado premium de sushi e sashimi',
  },
  {
    id: 'combinado-chef',
    nome: 'Combinado do Chef',
    descricao: 'A escolha do sushiman, montada na hora.',
    categoria: 'combinados',
    img: 'combinado-chef',
    alt: 'Barca grande de sushi montada sobre bandeja escura',
  },
  {
    id: 'sashimi',
    nome: 'Sashimi',
    descricao: 'Fatias de peixe cru, cortadas na hora e servidas sem arroz.',
    categoria: 'balcao',
    img: 'sashimi',
    alt: 'Sashimi de salmão disposto em formato de flor sobre prato escuro',
  },
  {
    id: 'carpaccio',
    nome: 'Carpaccio de salmão',
    descricao: 'Lâminas finas de salmão, finalizadas no maçarico.',
    categoria: 'balcao',
    img: 'carpaccio',
    alt: 'Lâminas de salmão maçaricado dispostas em leque',
  },
  {
    id: 'uramaki',
    nome: 'Uramaki',
    descricao: 'Enrolado ao contrário, com o arroz por fora.',
    categoria: 'balcao',
    img: 'uramaki',
    alt: 'Peças de uramaki dispostas em círculo sobre prato escuro',
  },
  {
    id: 'makimono',
    nome: 'Makimono',
    descricao: 'Enrolado clássico, com a alga por fora.',
    categoria: 'balcao',
    img: 'makimono',
    alt: 'Peças de makimono com alga por fora sobre bandeja escura',
  },
  {
    id: 'hot-roll',
    nome: 'Hot roll',
    descricao: 'Enrolado empanado e frito, servido quente.',
    categoria: 'hot',
    img: 'hot-roll',
    alt: 'Hot roll empanado com cobertura de molho escuro',
  },
  {
    id: 'yakisoba',
    nome: 'Yakisoba',
    descricao: 'Macarrão salteado com legumes e carne.',
    categoria: 'quentes',
    img: 'yakisoba',
    alt: 'Yakisoba servido com legumes e tiras de carne',
  },
  {
    id: 'risoto-camarao',
    nome: 'Risoto de camarão',
    descricao: 'Prato quente da casa, servido com camarão.',
    categoria: 'quentes',
    img: 'risoto-camarao',
    alt: 'Risoto servido com camarões, em prato de louça azul e branca',
  },
  {
    id: 'polvo',
    nome: 'Polvo',
    descricao: 'Frutos do mar preparados na cozinha da casa.',
    categoria: 'mar',
    img: 'polvo',
    alt: 'Prato de polvo preparado pela cozinha',
  },
];
