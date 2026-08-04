"""Gera a imagem de compartilhamento (Open Graph / Twitter) do site.

Sai de `public/img/fachada-noite-1440.webp`, que ja esta versionado, entao
roda em qualquer clone — nao depende do acervo local.

Duas escolhas conscientes:
- JPEG, e nao WebP: alguns leitores de preview (WhatsApp entre eles) ainda
  tropecam em WebP, e a previa do link e justamente o que abre a conversa.
- corte 1200x630 na faixa do letreiro e da porta: e o que identifica a casa
  quando o preview vem espremido no feed.
"""
from PIL import Image

ORIGEM = "public/img/fachada-noite-1440.webp"
DESTINO = "public/img/abre-social.jpg"

LARGURA, ALTURA = 1200, 630
# a faixa que pega o letreiro inteiro e quase toda a porta iluminada
TOPO = 430

with Image.open(ORIGEM) as img:
    largura = img.width
    faixa = round(largura * ALTURA / LARGURA)
    topo = min(TOPO, img.height - faixa)
    corte = img.crop((0, topo, largura, topo + faixa))
    corte = corte.resize((LARGURA, ALTURA), Image.Resampling.LANCZOS).convert("RGB")
    corte.save(DESTINO, "JPEG", quality=86, optimize=True, progressive=True)

print(f"{DESTINO} — {LARGURA}x{ALTURA}")
