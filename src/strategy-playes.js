const jogadaDasPontas = [0,2,6,8];
const meio = 4;
//reconhecer a vitória = OK
//reconhecer o empate (velha) = OK
//fazer uma jogada automática =

const possibilidadesDeVitoria = [
    //linhas
    [0,1,2],
    [3,4,5],
    [6,7,8],
    //colunas
    [0,3,6],
    [1,4,7],
    [2,5,8],
    //diagonais
    [0,4,8],
    [2,4,6]
];
function reconhecerVitoria(matriz){
    for(var i in possibilidadesDeVitoria){
        let listaIndex = possibilidadesDeVitoria[i] ;
        let linha = [];
        for( var j in listaIndex ){
            let indexDaMatriz = listaIndex[j] ;
            linha.push(matriz[indexDaMatriz]) ;
        }
        let vitoria = checkVitoriaLinha(linha) ; 
        if( vitoria ){
            return vitoria ;
        }
    }
    return null ;
}

function checkMatriz(matriz){
    if(!Array.isArray(matriz)){
        return false ;
    }
    if(matriz.length < 9){
        return false;
    }
    let result = true;
    matriz.forEach((val, ind)=>{
        if(val != 1 && val != 2 && val != null){
            result = false;
        }
    });
    return result;
}

function checkVitoriaLinha(linha){
    var val = linha[0] ;
    for( var i = 0; i < 3; i++){
        if(linha[i] == null){
            return null ;
        }
        if(linha[i] !== val){
            return null ;
        }
    }
    return val ;
}
function jogaRandom(matriz, player){
    console.log("random!")
    //procura possibilidades de jogadas
    var possibilidades = [];
    matriz.forEach((val, ind)=>{
        if(val == null){
            possibilidades.push(ind) ;
        }
    }) ;
    var i = Math.floor(Math.random()*possibilidades.length) ;
    return possibilidades[i];
}
function countEqual(arr, valEq = null){
    let total = 0;
    arr.forEach((val,ind)=>{
        if(val == valEq){
            total++;
        }
    });
    return total ;
}
function createArrayFromArrayIndex(arr, arrIndex){
    var res = [];
    arrIndex.forEach((val, ind)=>{
        res.push(arr[val] );
    }) ;
    return res ;
}
function meioOuPonta(matriz, player){
    //escolher o meio se possível
    if(matriz[4]== null){
        return 4;
    }
    var i = Math.floor( Math.random()*jogadaDasPontas.length )  ;
    var matrizPontas = createArrayFromArrayIndex(matriz, jogadaDasPontas) ;
    var pontasLivres = countEqual(matrizPontas, null) ;
    if(pontasLivres > 0){
        while(matriz[jogadaDasPontas[i]] != null){
            i = Math.floor( Math.random()*jogadaDasPontas.length )  ;
        }
        return jogadaDasPontas[i] ;
    }
    return jogaRandom(matriz, player) ;
}
function pontaOposta(matriz, player){
    if(matriz[0] == player && matriz[8] == null){
        return 8;
    }
    if(matriz[8] == player && matriz[0] == null){
        return 0;
    }
    if(matriz[2] == player && matriz[6] == null){
        return 6;
    }
    if(matriz[6] == player && matriz[2] == null){
        return 2;
    }
    return null ;
}
const laterallines = [
    [0,1,2],
    [0,3,6],
    [6,7,8],
    [2,5,8]
];
function lateralLivre(matrix, player){
    //procura uma ponta ocupada por si, e anda lateralmente ou verticalmente para achar a outra ponta com o meio livre
    for( var i in laterallines ){
        var line = laterallines[i] ;
        var lineValues = createArrayFromArrayIndex(matrix, line) ;
        var jogadasMinhas = countEqual(lineValues, player) ;
        var jogadasLivres = countEqual(lineValues, null) ;
        if(jogadasLivres == 2 && jogadasMinhas == 1){
            //achamos uma linha livre
            if( matrix[line[0]] == null ){
                return line[0] ;
            }
            if( matrix[line[2]] == null ){
                return line[2] ;
            }
        }
    }
    return null ;
}
/**
 * 9 = ninguém jogou, primeira jogada
 * 8 = 1 jogada, primeira resposta
 * 7 = 2 jogadas, jogada respondida
 * 6 = 3 jogadas, aguardando segunda resposta
 * 5 = 4 jogadas, segunda jogada respondida
 * 4 = 5 jogadas, aguardando terceira resposta
 * 3 = 6 jogadas, terceira jogada respondida
 * 2 = 7 jogadas, aguardando quarta resposta
 * 1 = 8 jogadas, quarta resposta dada, aguardando finalização
 * 0 = fim
 */
 let plays = new Map();
 plays.set(9, (matrix, player, nivel)=>{
     //máquina iniciando
     return meioOuPonta(matrix, player) ;
 }) ;
 plays.set(8, (matrix, player, nivel)=>{
     //máquina respondendo a um início
     return meioOuPonta(matrix, player) ;
 }) ;
 plays.set(7, (matrix, player, nivel)=>{
     var res ;
     //máquina iniciou, teve resposta e vai jogar novamente
     if(matrix[4] != null && matrix[4] != player){
         //ponta oposta é uma ótima jogada se o meio for do oponente
         res = pontaOposta(matrix, player) ;
         if(res !== null){
             return res ;
         }
         //se ponta oposta está ocupada continua pra outra estratégia
     }
     //se o meio tiver livre forçar o oponente a tapar jogada simples para formar cruz
     res = lateralLivre(matrix, player) ;
     if(res !== null){
         return res ;
     }
     return meioOuPonta(matrix, player) ;
 }) ;

 plays.set(6, (matrix, player, nivel)=>{
     //se possível forma a cruz preeenchendo o meio
    var res ;
    //máquina iniciou, teve resposta e vai jogar novamente
    if(matrix[4] == null ){
        return 4;
    }
    //se o meio tiver livre forçar o oponente a tapar jogada simples para formar cruz
    res = lateralLivre(matrix, player) ;
    if(res !== null){
        return res ;
    }
    return meioOuPonta(matrix, player) ;
}) ;
plays.set(5, (matrix, player, nivel)=>{
    //o computador começou, teve 2 resposta já. meio ou ponta
   return meioOuPonta(matrix, player) ;
}) ;
plays.set(4, (matrix, player, nivel)=>{
    //teve 2 resposta já e mais uma jogada. As jogadas não podem mais ser armadas
    var res = lateralLivre(matrix, player) ;
    if(res !== null){
        return res ;
    }
   return jogaRandom(matrix, player) ;
}) ;
 
plays.set(3, (matrix, player, nivel)=>{
    //agora qq coisa serve
   return jogaRandom(matrix, player) ;
}) ;

plays.set(2, (matrix, player, nivel)=>{
    //agora qq coisa serve
   return jogaRandom(matrix, player) ;
}) ;

function jogaPensado(matriz, player, nivel){
    console.log("jogaPensado")
    //jogar pensado
    let jogadasParaNaoPerder = [];
    //tenta ganhar
    for(var i in possibilidadesDeVitoria){
        let listaIndex = possibilidadesDeVitoria[i] ;
        let linha = [];
        let linhaIndex = [];
        for( var j in listaIndex ){
            let indexDaMatriz = listaIndex[j] ;
            linha.push(matriz[indexDaMatriz]) ;
            linhaIndex.push(indexDaMatriz) ;
        }
        let jogadasLivres = countEqual(linha, null) ;
        if(jogadasLivres == 1 ){
            //ou da pra ganhar, ou pra perder aqui
            let totalItens = countEqual(linha, player) ;
            if(totalItens == 2){
                //posso ganhar, retorna o index
                var ind = linha.indexOf(null) ;
                return linhaIndex[ind] ;
            }
            if(totalItens == 0){
                //nessa linha posso perder
                var ind = linha.indexOf(null) ;
                jogadasParaNaoPerder.push(linhaIndex[ind])
            }
        }
    }
    //tenta não perder (evitar a vitória do oponente)
    if(jogadasParaNaoPerder.length > 0){
        return jogadasParaNaoPerder[0] ;
    }
    //início da partida, arma posição no canto ou centro
    let jogadasLivresTotal = countEqual(matriz, null) ;
    console.log(jogadasLivresTotal) ;
    return plays.get(jogadasLivresTotal)(matriz, player, nivel);
    
    if(jogadasLivresTotal == 8){
        var local = meioOuPonta(matriz, player);
        return local ;
    }
    if(jogadasLivresTotal == 7){
        if(matriz[4]==null){
            return 4;
        }
        var oposta = pontaOposta(matriz, player) ;
        if(oposta !== null){
            return oposta ;
        }
        var local = meioOuPonta(matriz, player);
        return local ;
    }
    
    if(jogadasLivresTotal == 6){
        //criando ou evitando jogadas alinhadas
        var oposta = pontaOposta(matriz, player) ;
        if(oposta !== null){
            return oposta ;
        }
        var local = meioOuPonta(matriz, player);
        return local ;
    }
    //evitando jogadas alinhadas

    return jogaRandom(matriz, player) ;
}


module.exports = {
    checkMatriz,
    checkVitoriaLinha,
    jogaRandom,
    countEqual,
    createArrayFromArrayIndex,
    meioOuPonta,
    pontaOposta,
    lateralLivre,
    jogaPensado,
    reconhecerVitoria
};