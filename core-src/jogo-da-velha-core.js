const utils = require("./strategy-playes") ;
/**
 * Matriz
 * [0][1][2][3][4][5][6][7][8]
 * 
 * [0][1][2]
 * [3][4][5]
 * [6][7][8]
 */
 
class JogoDaVelha{
    constructor(){}
    reconhecerVitoria(matriz){
        if(!utils.checkMatriz(matriz)){
            throw new Error("Matriz incorreta") ;
            return;
        }
        return utils.reconhecerVitoria(matriz) ;
    }
    /**
     * Chame o metodo de reconhecer vitória antes do empate pois ele não reconhece vitória
     * 
     * @param {*} matriz 
     * @returns true if game end and no victory
     */
    reconhecerEmpate(matriz){
        if(!utils.checkMatriz(matriz)){
            throw new Error("Matriz incorreta") ;
            return;
        }
        var left = utils.countEqual(matriz, null) ;
        return (left == 0) ;
    }
    /**
     * 
     * @param {*} matriz 
     * @param {*} player 
     * @param {*} nivel 
     * @returns index to play
     */
    joga(matriz, player, nivel = 0){
        if(player != 1 && player != 2){
            throw new Error("Player 1 ou 2");
        }
        //0 com certeza ele vai pensar
        //4 seja com certeza vai randomizar
        return [
            utils.jogaRandom,
            Math.random() < 0.5?utils.jogaRandom:utils.jogaPensado,
            Math.random() < 0.25?utils.jogaRandom:utils.jogaPensado,
            utils.jogaPensado
        ][nivel](matriz, player, nivel);
    }
}



module.exports = JogoDaVelha ;