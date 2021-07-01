# jogo-da-velha-core

De modo geral uma matriz precisa ser passada e alguns conceitos devem ser levado em conta

A matriz é uma array corrido de 9 posições simbolizando a posição no tabuleiro seguindo a tabela:

```
[0][1][2]
[3][4][5]
[6][7][8]
```

Não existe X ou O e sim 1 ou 2 simbolizando player 1 e player 2 ocupado.
Onde não tiver nem 1 nem 2 deve ser preenchido por null.


# Methods

## reconhecerVitoria(matriz) : int or null

Se 1, o player 1 ganhou, se 2 o player 2 ganhou, se null ninguém ganhou


## reconhecerEmpate(matriz) : boolean

Se true, teve empate, se false, não teve


## joga( matriz, player, nivel ) : int or null

Conforme o níve de dificuldade enviado faz uma jogada pensada ou randomica.
Sendo 0 o mais fácil, e 3 o mais difícil. Se for zero é com certeza uma jogada randomica.
Se for 4 com certeza é uma jogada pensada.
Se for 2 tem 50% de chance de fazer uma jogada pensada;
Se for 3 tem 75% de chance de fazer uma jogada pensada;

Ele efetua uma jogada para o player enviado, então player deve ser 1 ou 2, invertido do player real.

matriz do jogo atual deve ser sempre enviada novamente.


## Exemplos

```
const JogoDaVelhaCore = require("./jogo-da-velha-core") ;

var matriz = [null, null, null, null, null, null, null, null, null];

let core = new JogoDaVelhaCore() ;
let humanPlayer = 2 ;
let computerPlayer = 1;

var jogadaEscolhida = core.joga(matriz, computerPlayer, 3) ;
//note que é você quem tem que setar na matriz a jogada
matriz[jogadaEscolhida] = computerPlayer ;
//nesse exemplo estou colocando o computador pra jogar contra ele mesmo
jogadaEscolhida = core.joga(matriz, humanPlayer, 3) ;
matriz[jogadaEscolhida] = humanPlayer ;

```

