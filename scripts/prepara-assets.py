"""Prepara a selecao final de imagens para o site (v2).

Regras herdadas da v1 e mantidas:
- nenhuma foto com rosto identificavel de cliente;
- nenhuma arte promocional (flyer);
- nenhuma imagem gerada por IA;
- a midia bruta permanece fora do Git; daqui sai so o derivado otimizado.

O que muda na v2: o lugar deixou de ser rodape e virou um ato inteiro, entao
entram quatro enquadramentos que a v1 nao usava — o letreiro aceso sobre a
porta, a esquina com a placa da Rua America, a parede de discos de palha e o
box com o prato vermelho da casa. Nos dois quadros em que havia cliente, o
corte foi fechado para exclui-lo por inteiro, e nao apenas reduzido.

Gera WebP em tres larguras (480, 960, 1600) para srcset. Nunca amplia.
"""
import json
import os

from PIL import Image, ImageOps

RAW = "/mnt/Files/Projetos/sushi-verao-demo/assets/instagram/raw/rodrigo_verao"
OUT = "/mnt/Files/Projetos/sushi-verao-demo/public/img"

LARGURAS = (480, 960, 1600)

# nome-final : (arquivo-bruto, corte)
#   corte = None                              -> imagem inteira
#   corte = (esq, topo, dir, base) em fracao  -> recorte relativo 0..1
SELECAO = {
    # --- a esquina e a chegada -----------------------------------------
    "fachada-noite":  ("2023-06-01_Cs7ieSDAcNK_01.jpg", None),
    "fachada-dia":    ("2023-05-09_CsCJTFCA9Nj_01.jpg", None),
    # letreiro real aceso sobre a porta: a marca como sinal fisico da casa.
    # corte pela direita para deixar de fora o reflexo com pessoa na vitrine.
    "letreiro":       ("2023-06-01_Cs7ieSDAcNK_02.jpg", (0.0, 0.0, 0.62, 1.0)),
    # a esquina com a placa "RUA AMERICA" e o numero 677.
    "esquina-placa":  ("2023-05-09_CsCJTFCA9Nj_02.jpg", None),

    # --- o salao --------------------------------------------------------
    "salao-mesas":    ("2023-06-01_Cs7ieSDAcNK_07.jpg", None),
    "salao-janela":   ("2023-06-01_Cs7ieSDAcNK_10.jpg", None),
    "salao-folhagem": ("2023-06-01_Cs7ieSDAcNK_09.jpg", None),
    "salao-mesa3":    ("2023-06-01_Cs7ieSDAcNK_06.jpg", None),
    # parede de discos de palha sob as luminarias de papel. o corte para em
    # 37,5% da altura: abaixo disso ha clientes de rosto identificavel, e os
    # cortes tentados antes (52% e 42%) ainda os deixavam no quadro. conferido na
    # imagem gerada, nao so no numero.
    "parede-discos":  ("2023-06-01_Cs7ieSDAcNK_05.jpg", (0.0, 0.0, 1.0, 0.375)),
    # box de couro com o prato vermelho. corte pela esquerda para excluir a
    # pessoa sentada ao fundo, no canto superior esquerdo do quadro.
    "box-vermelho":   ("2023-06-01_Cs7ieSDAcNK_04.jpg", (0.30, 0.0, 1.0, 1.0)),
    "area-kids":      ("2023-05-09_CsCJTFCA9Nj_10.jpg", None),

    # --- a carta --------------------------------------------------------
    # Cada foto foi conferida uma a uma contra o nome do item. Onde a imagem
    # nao correspondia ao prato, o item saiu da carta em vez de ganhar foto
    # aproximada: nomear errado seria enganar.
    "combinado-verao":   ("2023-06-06_CtKrBRCAXNH_01.jpg", None),
    # havia uma crianca de rosto visivel atras do balcao, no terco de cima.
    # a v1 publicou a foto inteira; aqui ela sai do quadro.
    "combinado-premium": ("2023-11-17_CzxAXeag3XD_01.jpg", (0.0, 0.26, 1.0, 1.0)),
    "combinado-chef":    ("2023-09-07_Cw5gBpIgsK__06.jpg", None),
    "sashimi":           ("2023-09-07_Cw5gBpIgsK__05.jpg", None),
    "carpaccio":         ("2023-09-07_Cw5gBpIgsK__09.jpg", None),
    # uramaki: arroz por fora — prato circular escuro
    "uramaki":           ("2023-02-21_Co8ShluskQ9_01.jpg", None),
    # makimono: alga por fora — estava trocado com o uramaki na v1
    "makimono":          ("2023-10-26_Cy4Zp5Eg4rS_01.jpg", None),
    # clientes sentados ao fundo, na faixa de cima: cortada fora.
    "hot-roll":          ("2023-09-16_CxO3tBSAf5H_01.jpg", (0.0, 0.14, 1.0, 1.0)),
    "yakisoba":          ("2023-05-28_CszaFM4gLQz_01.jpg", None),
    "risoto-camarao":    ("2023-06-01_Cs7iwWmgw9V_03.jpg", None),
    "polvo":             ("2023-11-29_C0NmZKjgSLz_01.jpg", None),

    # --- encomendas e eventos -------------------------------------------
    "buffet":         ("2023-09-17_CxSCpiqABFj_02.jpg", None),
    "barca-grande":   ("2023-11-19_Cz2H9L3AOeT_01.jpg", None),
    # cliente sentada ao fundo, nitida no terco de cima: cortada fora.
    # sobra o que interessa — o maçarico sobre o prato.
    "preparo-fogo":   ("2023-09-30_Cx1YAACANO9_01.jpg", (0.0, 0.35, 1.0, 1.0)),
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

    for nome, (arquivo, corte) in sorted(SELECAO.items()):
        origem = os.path.join(RAW, arquivo)
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
            "shortcode": arquivo.split("_")[1] if "_" in arquivo else "",
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
