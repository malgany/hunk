# HUNK 3D Viewer

Jogo/prototipo local em Three.js para testar o personagem `assets/HUNK.glb`, inimigos esqueletos, mapas por tiles, armas, HUD e fluxo de andares.

## Recursos

- Tela inicial com orientacao landscape no mobile e botao `PRESS START`.
- Editor de mapa por tiles com multiplos andares, player spawn, esqueletos e chefe.
- Geracao automatica de mapa e salvamento local do mapa em `src/map-config.js`.
- Combate em terceira pessoa com vida do player, barra de vida dos inimigos, dano flutuante e headshot.
- Pistola e shotgun com HUD separado, troca por slot `1` e `2` no desktop e botoes na borda inferior no mobile.
- Bau no andar 2 que libera a shotgun.
- Drops de municao por inimigos, com caixa vermelha para pistola e verde para shotgun.
- Vasculhar corpos quando todas as municoes das armas desbloqueadas acabam.
- Timer de run no topo da tela, resumo final e recordes em `localStorage`.

## Armas e municao

| Arma | Municao inicial | Como libera | Maximo | Drop |
| --- | ---: | --- | ---: | --- |
| Pistola | 20 | Inicio da run | 20 | +10, limitado a 20 |
| Shotgun | 10 | Bau do andar 2 | 20 | +10, limitado a 20 |

Observacao: a shotgun nasce com 10 balas quando e pega no bau, mas o limite maximo dela tambem e 20. Por isso ela pode chegar a 20 depois de pegar drops de municao.

### Dano e alcance

- Pistola: 2 de dano no corpo e 10 no headshot.
- Shotgun: alcance maximo de 5 tiles medidos do personagem ate o inimigo, com mira em argola para indicar dispersao.
- O cone da shotgun segue a mira, mas as particulas visuais saem da arma do personagem.
- Shotgun a 1 tile: dano equivalente a 4 tiros de pistola.
- Shotgun a 2 tiles: dano equivalente a 3 tiros de pistola.
- Shotgun a 3 ou 4 tiles: dano equivalente a 1 tiro de pistola.
- Shotgun a 5 tiles: dano equivalente a meio tiro de pistola.

### Vasculhar corpos

- So aparece quando todas as municoes das armas desbloqueadas estao em `0`.
- Desktop: aproxime em ate cerca de 1 tile de um esqueleto morto e pressione `E`.
- Mobile: aproxime em ate cerca de 1 tile de um esqueleto morto e toque em `Vasculhar`.
- A busca dura 6 segundos e usa a animacao `PickUp`.
- Ao terminar, o corpo some; ha 50% de chance de encontrar `+5` municoes de uma arma desbloqueada.
- Se nada for encontrado, aparece `Nada encontrado`.

## Timer e recordes

- O timer visual mostra o tempo total da run em `MM:SS:CC`.
- O tempo total para quando o player morre ou quando o ultimo andar e limpo.
- Cada andar tambem registra um tempo interno da fase.
- Recordes ficam no navegador em `localStorage`, na chave `theRank.records.v1`.
- Recordes por fase so atualizam quando a fase e concluida.
- O recorde total so atualiza quando a run completa todos os andares.

## Rodando localmente

```bash
npm run dev
```

Depois abra a URL impressa no terminal. Por padrao:

```text
http://127.0.0.1:5173
```

## Estrutura principal

- `index.html`: interface, HUD, tela inicial e modal de resumo.
- `styles.css`: layout responsivo, HUD, mobile controls e visual dos paineis.
- `src/main.js`: carregamento 3D, gameplay, editor de mapa, armas, inimigos, timer e records.
- `src/map-config.js`: configuracao persistida dos andares.
- `assets/`: modelos 3D, animacoes, texturas e icones de UI.

## Assets de UI

- `assets/ui/ammo-pistol-icon.png`: icone de municao da pistola.
- `assets/ui/ammo-shotgun-icon.png`: icone de municao da shotgun.
- `assets/ui/weapon-pistol-icon.png`: icone da pistola no seletor de arma.
- `assets/ui/weapon-shotgun-icon.png`: icone da shotgun no seletor de arma.
