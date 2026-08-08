"""Prepara a selecao final de imagens para o site (v2).

Regras herdadas da v1 e mantidas:
- nenhuma foto com rosto identificavel de cliente;
- nenhuma arte promocional (flyer);
- nenhuma imagem gerada por IA;
- a midia bruta permanece fora do Git; daqui sai so o derivado otimizado.

Em 07/08/2026 a fonte principal deixou de ser o Instagram. A casa foi
reformada e o dono nao reconhecia mais o site: fachada verde, faixa vermelha,
salao antigo. Entraram 18 frames de video que ele mesmo mandou, do evento de
Dia dos Namorados de 2026 — comida, salao e area externa. Sao 464x832, e essa
e a resolucao maxima que existe: nao ha original melhor a buscar.

O acervo de 2023 nao foi apagado do disco, so deixou de ser publicado, com
excecao dos pratos e do canto do salao que a selecao nova nao cobre.

Gera WebP em tres larguras (480, 960, 1600) para srcset. Nunca amplia.
"""
import json
import os

from PIL import Image, ImageOps

RAW = "/mnt/Files/Projetos/sushi-verao-demo/assets/instagram/raw/rodrigo_verao"
# fotos entregues pelo cliente, fora do Instagram. mesma politica do acervo
# bruto: ficam no disco, nao no Git.
CLIENTE = "/mnt/Files/Projetos/sushi-verao-demo/assets/fotos-cliente"
OUT = "/mnt/Files/Projetos/sushi-verao-demo/public/img"

LARGURAS = (480, 960, 1600)

# nome-final : (arquivo-bruto, corte)
#   corte = None                              -> imagem inteira
#   corte = (esq, topo, dir, base) em fracao  -> recorte relativo 0..1
# O que sobrou de 2023.
#
# Em 07/08/2026 a maior parte do acervo do Instagram saiu daqui. O motivo nao e
# estetico: a casa foi reformada, e as fotos da fachada — parede verde num
# quadro, faixa vermelha no outro — mostravam um predio que nao existe mais.
# Quem chegasse pelo site procuraria na rua uma casa que nao esta la. Junto com
# elas saiu tudo o que ganhou substituto de 2026: os tres combinados, sashimi,
# uramaki, makimono, buffet, barca, preparo no maçarico e os quadros do salao.
#
# Ficou o que a selecao de 2026 nao cobre: os pratos quentes, o carpaccio, um
# quadro do salao e a area kids. Nenhum deles mostra fachada, e todos seguem
# verdadeiros. Quando chegar foto nova de cada um, saem tambem.
SELECAO = {
    # --- o salao --------------------------------------------------------
    "salao-janela":   ("2023-06-01_Cs7ieSDAcNK_10.jpg", None),
    "area-kids":      ("2023-05-09_CsCJTFCA9Nj_10.jpg", None),

    # --- a carta --------------------------------------------------------
    # Cada foto foi conferida uma a uma contra o nome do item. Onde a imagem
    # nao correspondia ao prato, o item saiu da carta em vez de ganhar foto
    # aproximada: nomear errado seria enganar.
    "carpaccio":         ("2023-09-07_Cw5gBpIgsK__09.jpg", None),
    # clientes sentados ao fundo, na faixa de cima: cortada fora.
    "hot-roll":          ("2023-09-16_CxO3tBSAf5H_01.jpg", (0.0, 0.14, 1.0, 1.0)),
    "yakisoba":          ("2023-05-28_CszaFM4gLQz_01.jpg", None),
    "risoto-camarao":    ("2023-06-01_Cs7iwWmgw9V_03.jpg", None),
    "polvo":             ("2023-11-29_C0NmZKjgSLz_01.jpg", None),
}

# Fotos enviadas pelo cliente. Mesma forma de SELECAO, outra raiz.
#
# As de 2026-eventos sao frames de video de WhatsApp: 464x832, verticais, e
# essa e a resolucao maxima que existe — nao ha original melhor. Por isso todo
# corte aqui e pensado para caber em card, vitrine ou mosaico, onde 464px ainda
# sustenta. O unico ponto em que elas sobem para largura total e a faixa do
# salao, e isso foi decisao explicita do cliente, ciente da perda.
#
# Como a origem e vertical e o layout pede quadrado ou horizontal, quase toda
# entrada tem corte. Cada janela abaixo foi conferida na imagem gerada, nao so
# no numero.
SELECAO_CLIENTE = {
    # A fachada depois da reforma: parede escura, toldos, letreiro redondo
    # aceso sobre a porta e o piso de losangos vermelhos. Retrato 3:4, contra
    # o quadrado da foto antiga — a abertura foi reenquadrada por causa disso.
    # Ha uma pessoa em silhueta atras do vidro, sem rosto legivel, e a camada
    # escura do veu cai justamente sobre o vao.
    "fachada-noite":  ("2026-08-06_fachada-noite.jpeg", None),

    # --- a carta, 2026 ---------------------------------------------------
    # Cards quadrados: o corte entrega 1:1 pronto em vez de deixar o
    # object-fit do CSS escolher a janela pelo centro geometrico.
    "combinado-variado":  ("2026-eventos/combinado-variado.jpg",
                           (0.0, 0.22, 1.0, 0.7777)),
    # a torre de camarao sobre o abacaxi com a travessa embaixo: o corte
    # comeca acima da torre para nao decapita-la.
    "torre-camarao-travessa": ("2026-eventos/torre-camarao-abacaxi-2.jpg",
                               (0.0, 0.22, 1.0, 0.7777)),
    # travessa de niguiri de salmao com uramaki ao lado: e o arranjo montado
    # na hora, que e o que o Combinado do Chef promete.
    "travessa-niguiri":   ("2026-eventos/sashimi-uramaki.jpg",
                           (0.0, 0.15, 1.0, 0.8936)),
    "sashimi-leque":      ("2026-eventos/sashimi-leque.jpg",
                           (0.0, 0.18, 1.0, 0.7377)),
    # uramaki e o de arroz por fora. duas fontes foram testadas e recusadas
    # antes desta: na travessa de niguiri o niguiri dominava o card, e na faixa
    # de baixo da foto da torre entravam camarões da torre por cima — os dois
    # casos poriam no card chamado "uramaki" algo que nao e uramaki. aqui o
    # primeiro plano e uramaki inteiro, arroz e gergelim por fora.
    "uramaki-2026":       ("2026-eventos/combinado-beterraba.jpg",
                           (0.0, 0.30, 1.0, 0.8577)),
    # makimono e o de alga por fora. mesmo raciocinio ao contrario: o lado
    # direito da travessa e so maki com nori aparente. o corte comeca em 30%
    # da largura, depois da fronteira com os uramaki da esquerda.
    "makimono-2026":      ("2026-eventos/uramaki-nori.jpg",
                           (0.30, 0.40, 1.0, 0.7906)),
    # travessa que sai para entrega: retrato 4:5 no bloco de entrega.
    "combinado-salmao":   ("2026-eventos/combinado-salmao.jpg",
                           (0.0, 0.25, 1.0, 0.9471)),

    # --- festas e encomendas, 2026 ---------------------------------------
    # a torre de camarao inteira, em pe sobre o abacaxi: e a peca de efeito
    # da casa, e o retrato 3:4 e o formato natural dela.
    "torre-camarao":      ("2026-eventos/torre-camarao-abacaxi-1.jpg",
                           (0.0, 0.10, 1.0, 0.8436)),
    "buffet-quente":      ("2026-eventos/buffet-quente.jpg",
                           (0.0, 0.20, 1.0, 0.9436)),
    "evento-mesas-brancas": ("2026-eventos/evento-mesas-brancas.jpg",
                             (0.0, 0.15, 1.0, 0.8936)),
    "evento-mesa-redonda": ("2026-eventos/evento-mesa-redonda.jpg",
                            (0.0, 0.15, 1.0, 0.8936)),
    "fachada-mesa-externa": ("2026-eventos/fachada-mesa-externa.jpg",
                             (0.0, 0.15, 1.0, 0.8936)),

    # --- o salao, 2026 ---------------------------------------------------
    # faixa larga do ato do salao. sai de um quadro vertical de 464px, entao
    # a faixa nasce com 464 de largura e sobe para a tela inteira: e o unico
    # ponto do site onde a imagem e ampliada muito alem do que ela aguenta.
    # Trade-off aceito pelo cliente para nao mostrar mais o salao de 2023.
    "salao-coracoes":     ("2026-eventos/salao-interno-coracao.jpg",
                           (0.0, 0.08, 1.0, 0.2890)),
    "ambiente-petalas":   ("2026-eventos/ambiente-petalas-taca.jpg",
                           (0.0, 0.12, 1.0, 0.8636)),
    # o corte comeca no alto: fechado no centro, os baloes de coracao ficavam
    # de fora e sobrava uma mesa posta qualquer, sem a data que ela conta.
    "mesa-baloes":        ("2026-eventos/mesa-baloes-coracao.jpg",
                           (0.0, 0.03, 1.0, 0.5877)),
    # ha uma pessoa em pe ao fundo, no canto superior esquerdo, diante da TV.
    # o corte entra pela esquerda ate deixa-la inteira fora do quadro.
    "mesa-petalas-taca":  ("2026-eventos/mesa-romantica-tv.jpg",
                           (0.20, 0.28, 1.0, 0.7262)),
}


def recorta(img, corte):
    if corte is None:
        return img
    esq, topo, dir_, base = corte
    w, h = img.size
    return img.crop((int(esq * w), int(topo * h), int(dir_ * w), int(base * h)))


def main():
    os.makedirs(OUT, exist_ok=True)
    manifesto = {}
    faltando = []
    total = 0

    tarefas = [(nome, RAW, arq, corte) for nome, (arq, corte) in SELECAO.items()]
    tarefas += [(nome, CLIENTE, arq, corte)
                for nome, (arq, corte) in SELECAO_CLIENTE.items()]

    for nome, raiz, arquivo, corte in sorted(tarefas):
        origem = os.path.join(raiz, arquivo)
        if not os.path.exists(origem):
            faltando.append((nome, arquivo))
            continue

        img = ImageOps.exif_transpose(Image.open(origem)).convert("RGB")
        img = recorta(img, corte)
        larg0, alt0 = img.size

        larguras = [l for l in LARGURAS if l <= larg0]
        # se a origem for menor que a maior largura da escala, ainda assim
        # publica a resolucao nativa — senao um corte estreito como o do
        # letreiro ficaria limitado a 480px e borraria em tela grande.
        if larg0 not in larguras and larg0 > (larguras[-1] if larguras else 0):
            larguras.append(larg0)

        for largura in larguras:
            altura = round(alt0 * largura / larg0)
            destino = os.path.join(OUT, f"{nome}-{largura}.webp")
            redim = img if largura == larg0 else img.resize(
                (largura, altura), Image.Resampling.LANCZOS
            )
            redim.save(destino, "WEBP", quality=82, method=6)
            total += os.path.getsize(destino)

        manifesto[nome] = {
            "origem": arquivo,
            # shortcode so existe para o que veio do Instagram.
            "shortcode": (arquivo.split("_")[1]
                          if raiz == RAW and "_" in arquivo else ""),
            "corte": list(corte) if corte else None,
            "larguras": larguras,
            "proporcao": round(larg0 / alt0, 4),
        }
        print(f"  {nome:18s} {larg0}x{alt0} -> {larguras}")

    with open(os.path.join(OUT, "manifesto.json"), "w", encoding="utf-8") as f:
        json.dump(manifesto, f, ensure_ascii=False, indent=1)

    if faltando:
        print("\nARQUIVOS BRUTOS AUSENTES:")
        for nome, arquivo in faltando:
            print(f"  {nome}: {arquivo}")

    print(f"\n{len(manifesto)} imagens · {total/1e6:.2f} MB no total")


if __name__ == "__main__":
    main()
