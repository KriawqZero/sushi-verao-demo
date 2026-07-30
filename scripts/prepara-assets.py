"""Prepara a selecao final de imagens para o site.

Regras aplicadas aqui:
- nenhuma foto com rosto identificavel de cliente;
- nenhuma arte promocional (flyer);
- nenhuma imagem gerada por IA;
- a midia bruta permanece fora do Git; daqui sai so o derivado otimizado.

Gera WebP em duas larguras (800 e 1600) para uso com srcset.
"""
import json
import os

from PIL import Image, ImageOps

RAW = "/mnt/Files/Projetos/sushi-verao-demo/assets/instagram/raw/rodrigo_verao"
OUT = "/mnt/Files/Projetos/sushi-verao-demo/public/img"

# nome-final : (arquivo-bruto, proporcao-de-corte ou None)
SELECAO = {
    # --- abertura e lugar (sem pessoas identificaveis) ---
    "fachada-noite":   ("2023-06-01_Cs7ieSDAcNK_01.jpg", None),
    "fachada-dia":     ("2023-05-09_CsCJTFCA9Nj_01.jpg", None),
    "salao-mesas":     ("2023-06-01_Cs7ieSDAcNK_07.jpg", None),
    "salao-janela":    ("2023-06-01_Cs7ieSDAcNK_10.jpg", None),
    "salao-folhagem":  ("2023-06-01_Cs7ieSDAcNK_09.jpg", None),
    "salao-mesa3":     ("2023-06-01_Cs7ieSDAcNK_06.jpg", None),
    "area-kids":       ("2023-05-09_CsCJTFCA9Nj_10.jpg", None),

    # --- cardapio ---
    # Cada foto foi conferida uma a uma contra o nome do item. Onde a imagem
    # nao correspondia ao prato, o item saiu do cardapio em vez de ganhar uma
    # foto aproximada: nomear errado seria enganar.
    "combinado-verao":   ("2023-06-06_CtKrBRCAXNH_01.jpg", None),
    "combinado-premium": ("2023-11-17_CzxAXeag3XD_01.jpg", None),
    "combinado-chef":    ("2023-09-07_Cw5gBpIgsK__06.jpg", None),
    "sashimi":           ("2023-09-07_Cw5gBpIgsK__05.jpg", None),
    "carpaccio":         ("2023-09-07_Cw5gBpIgsK__09.jpg", None),
    # uramaki: arroz por fora — prato circular escuro
    "uramaki":           ("2023-02-21_Co8ShluskQ9_01.jpg", None),
    # makimono: alga por fora — estava trocado com o uramaki
    "makimono":          ("2023-10-26_Cy4Zp5Eg4rS_01.jpg", None),
    "hot-roll":          ("2023-09-16_CxO3tBSAf5H_01.jpg", None),
    "yakisoba":          ("2023-05-28_CszaFM4gLQz_01.jpg", None),
    # risoto de camarao: item do cardapio publicado, e a foto vem do mesmo post
    "risoto-camarao":    ("2023-06-01_Cs7iwWmgw9V_03.jpg", None),
    "polvo":             ("2023-11-29_C0NmZKjgSLz_01.jpg", None),

    # --- encomendas e eventos ---
    # buffet: mesa montada em evento, nao prato individual
    "buffet":       ("2023-09-17_CxSCpiqABFj_02.jpg", None),
    "barca-grande": ("2023-11-19_Cz2H9L3AOeT_01.jpg", None),
    "preparo-fogo": ("2023-09-30_Cx1YAACANO9_01.jpg", None),
}

LARGURAS = (800, 1600)


def main():
    os.makedirs(OUT, exist_ok=True)
    manifesto = {}
    total = 0
    for nome, (arq, _) in SELECAO.items():
        src = os.path.join(RAW, arq)
        if not os.path.exists(src):
            print(f"  FALTA: {arq}")
            continue
        im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        w0, h0 = im.size
        # Sufixo fixo (-sm/-lg) em vez da largura no nome: o HTML fica com
        # srcset previsivel mesmo com originais de tamanhos diferentes.
        # Nunca amplia — o -lg tem no maximo a largura original.
        saidas = []
        for sufixo, teto in (("sm", LARGURAS[0]), ("lg", LARGURAS[1])):
            larg = min(teto, w0)
            copia = im.copy()
            copia.thumbnail((larg, larg * 3))
            destino = os.path.join(OUT, f"{nome}-{sufixo}.webp")
            copia.save(destino, "WEBP", quality=80, method=6)
            saidas.append((sufixo, copia.size, os.path.getsize(destino)))
            total += os.path.getsize(destino)
        manifesto[nome] = {
            "origem": arq,
            "shortcode": arq.split("_")[1] if "_" in arq else "",
            "original": [w0, h0],
            "saidas": [{"variante": v, "tamanho": list(s), "bytes": b}
                       for v, s, b in saidas],
        }
        print(f"  {nome}: {w0}x{h0} -> " +
              ", ".join(f"{v} {s[0]}x{s[1]} ({b/1024:.0f}KB)" for v, s, b in saidas))

    with open(os.path.join(OUT, "manifesto.json"), "w", encoding="utf-8") as f:
        json.dump(manifesto, f, ensure_ascii=False, indent=1)
    print(f"\n{len(manifesto)} imagens · {total/1e6:.2f} MB no total")


if __name__ == "__main__":
    main()
