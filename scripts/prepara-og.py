"""Gera a imagem de compartilhamento (Open Graph / Twitter) do site.

Sai da maior variante versionada da fachada, entao roda em qualquer clone —
nao depende do acervo local.

Duas escolhas conscientes:
- JPEG, e nao WebP: alguns leitores de preview (WhatsApp entre eles) ainda
  tropecam em WebP, e a previa do link e justamente o que abre a conversa.
- corte 1200x630 na faixa do letreiro e da porta: e o que identifica a casa
  quando o preview vem espremido no feed.
"""
from PIL import Image

ORIGEM = "public/img/fachada-noite-960.webp"
DESTINO = "public/img/abre-social.jpg"

LARGURA, ALTURA = 1200, 630
# Onde comeca a faixa, em fracao da altura. Fracao e nao pixel: a foto da
# fachada ja trocou uma vez e o numero absoluto nao sobreviveu. Em 20,8% a
# faixa abre logo acima do letreiro (30% da altura) e fecha abaixo da porta
# iluminada (51%) — os dois sinais que identificam a casa no feed.
TOPO_FRACAO = 0.208

with Image.open(ORIGEM) as img:
    largura = img.width
    faixa = round(largura * ALTURA / LARGURA)
    topo = min(round(img.height * TOPO_FRACAO), img.height - faixa)
    corte = img.crop((0, topo, largura, topo + faixa))
    corte = corte.resize((LARGURA, ALTURA), Image.Resampling.LANCZOS).convert("RGB")
    corte.save(DESTINO, "JPEG", quality=86, optimize=True, progressive=True)

print(f"{DESTINO} — {LARGURA}x{ALTURA}")
