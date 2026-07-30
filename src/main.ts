/**
 * Sushi do Verão — conceito independente da Avantis.
 *
 * A única interatividade da página: filtro por categoria e montagem de um
 * pedido que vira mensagem pronta de WhatsApp. Não há carrinho, valor,
 * checkout nem backend — a conversa de preço acontece com a casa, porque
 * nenhum preço atual foi confirmado.
 */

import './style.css';
import { CATEGORIAS, ITENS, type Categoria, type Item } from './cardapio';

/** Número cadastrado no perfil comercial do restaurante. */
const WHATSAPP = '5567999917786';

type Filtro = Categoria | 'tudo';

const selecionados = new Map<string, number>();
let filtroAtivo: Filtro = 'tudo';

/* ---------------------------------------------------------------- helpers */

function el<T extends HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Elemento ausente no HTML: ${selector}`);
  return node;
}

function linkWhatsApp(texto: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

/* ------------------------------------------------------------- montagem   */

function cardDoItem(item: Item): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'prato';
  li.dataset.categoria = item.categoria;

  const figura = document.createElement('div');
  figura.className = 'prato-img';
  const img = document.createElement('img');
  img.src = `/img/${item.img}-sm.webp`;
  img.alt = item.alt;
  img.width = 800;
  img.height = 600;
  img.loading = 'lazy';
  img.decoding = 'async';
  figura.append(img);

  const corpo = document.createElement('div');
  corpo.className = 'prato-corpo';

  const h3 = document.createElement('h3');
  h3.textContent = item.nome;

  const p = document.createElement('p');
  p.textContent = item.descricao;

  corpo.append(h3, p);

  if (item.nota) {
    const nota = document.createElement('span');
    nota.className = 'nota';
    nota.textContent = item.nota;
    corpo.append(nota);
  }

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'somar';
  botao.dataset.id = item.id;
  botao.setAttribute('aria-pressed', 'false');
  botao.textContent = 'Adicionar ao pedido';
  botao.addEventListener('click', () => alternarItem(item, botao));

  corpo.append(botao);
  li.append(figura, corpo);
  return li;
}

function montarFiltros(): void {
  const caixa = el<HTMLDivElement>('.filtros');
  for (const cat of CATEGORIAS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = cat.rotulo;
    chip.setAttribute('aria-pressed', String(cat.id === filtroAtivo));
    chip.addEventListener('click', () => {
      filtroAtivo = cat.id;
      for (const outro of caixa.querySelectorAll('.chip')) {
        outro.setAttribute('aria-pressed', String(outro === chip));
      }
      aplicarFiltro();
    });
    caixa.append(chip);
  }
}

function montarGrade(): void {
  const grade = el<HTMLUListElement>('#grade-cardapio');
  for (const item of ITENS) grade.append(cardDoItem(item));
}

function aplicarFiltro(): void {
  const grade = el<HTMLUListElement>('#grade-cardapio');
  let visiveis = 0;
  for (const li of grade.querySelectorAll<HTMLLIElement>('.prato')) {
    const mostrar = filtroAtivo === 'tudo' || li.dataset.categoria === filtroAtivo;
    li.hidden = !mostrar;
    if (mostrar) visiveis += 1;
  }
  el<HTMLParagraphElement>('#grade-vazia').hidden = visiveis > 0;
}

/* ------------------------------------------------------------- pedido     */

function alternarItem(item: Item, botao: HTMLButtonElement): void {
  if (selecionados.has(item.id)) {
    selecionados.delete(item.id);
    botao.setAttribute('aria-pressed', 'false');
    botao.textContent = 'Adicionar ao pedido';
  } else {
    selecionados.set(item.id, 1);
    botao.setAttribute('aria-pressed', 'true');
    botao.textContent = 'No pedido ✓';
  }
  atualizarBarra();
}

function textoDoPedido(): string {
  const linhas = [...selecionados.entries()].map(([id, qtd]) => {
    const item = ITENS.find((i) => i.id === id);
    return `• ${qtd}x ${item ? item.nome : id}`;
  });
  return [
    'Olá! Vim pelo site e tenho interesse em:',
    ...linhas,
    '',
    'Pode me passar os valores e o tempo de entrega?',
  ].join('\n');
}

function atualizarBarra(): void {
  const barra = el<HTMLDivElement>('#barra-pedido');
  const total = selecionados.size;

  barra.hidden = total === 0;
  document.body.style.paddingBottom = total > 0 ? '92px' : '';

  el<HTMLSpanElement>('#barra-contagem').textContent =
    total === 1 ? '1 item escolhido' : `${total} itens escolhidos`;

  el<HTMLAnchorElement>('#enviar-pedido').href = linkWhatsApp(textoDoPedido());
}

function limparPedido(): void {
  selecionados.clear();
  for (const botao of document.querySelectorAll<HTMLButtonElement>('.somar')) {
    botao.setAttribute('aria-pressed', 'false');
    botao.textContent = 'Adicionar ao pedido';
  }
  atualizarBarra();
}

/* ------------------------------------------------------------- início     */

function ligarCTAs(): void {
  const simples = linkWhatsApp(
    'Olá! Vim pelo site do Sushi do Verão e gostaria de fazer um pedido.',
  );
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-zap-simples]')) {
    a.href = simples;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  const evento = linkWhatsApp(
    'Olá! Vim pelo site do Sushi do Verão e gostaria de um orçamento para evento.',
  );
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-zap-evento]')) {
    a.href = evento;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
}

function iniciar(): void {
  montarFiltros();
  montarGrade();
  aplicarFiltro();
  ligarCTAs();
  el<HTMLButtonElement>('#limpar-pedido').addEventListener('click', limparPedido);
  el<HTMLAnchorElement>('#enviar-pedido').target = '_blank';
  el<HTMLAnchorElement>('#enviar-pedido').rel = 'noopener noreferrer';
}

iniciar();
