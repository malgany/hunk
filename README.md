# HUNK 3D Viewer

Visualizador local em Three.js para testar o modelo `assets/HUNK.glb`, suas animacoes KayKit e objetos de mao do pacote Styloo Guns.

## Recursos

- Carrega o personagem HUNK em GLB.
- Lista animacoes do rig medio em um seletor agrupado.
- Permite testar armas no `handslot.r` do personagem.
- Ajusta posicao `X/Y/Z` e tamanho da arma por sliders.
- Copia um JSON com movimento, arma, slot, posicao, rotacao e escala.
- Inclui combinacoes experimentais de locomocao com tiro 1H.

## Rodando localmente

```bash
npm run dev
```

Depois abra a URL impressa no terminal. Por padrao:

```text
http://127.0.0.1:5173
```

## Estrutura principal

- `index.html`: interface do viewer.
- `styles.css`: estilos da tela mobile.
- `src/main.js`: carregamento do modelo, animacoes, armas e controles.
- `assets/`: modelos 3D, animacoes e pacotes de armas.

## Observacao

As combinacoes de animacao ainda sao uma ferramenta de teste. Ajustes finos de mascara de bones, posicao da arma e escala podem ser necessarios para cada arma/movimento.
