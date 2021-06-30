const JogoDaVelhaCore = require("./jogo-da-velha-core") ;

const readline = require("readline") ;

const r1  = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var matriz = [null, null, null, null, null, null, null, null, null];

let core = new JogoDaVelhaCore() ;
let nivelDeDificuldade = 0;
function perguntaJogada (){
    render();
    r1.question("Qual sua jogada?", (jogada)=>{
        computaJogada(jogada);
    })
}
var refTeclado = "qweasdzxc".split("");
/**
 * qwe
 * asd
 * zxc
 * @param {*} jogada 
 */
function computaJogada(jogada){
    jogada = jogada.toLowerCase() ;
    let indexJogada = refTeclado.indexOf(jogada);
    if(indexJogada < 0){
        console.log("Jogada indexistente") ;
        perguntaJogada();
        return;
    }
    if(matriz[indexJogada] != null){
        console.log("Jogada já efetuada por outro jogador.") ;
        perguntaJogada();
        return;
    }
    matriz[indexJogada] = 1;
    if(!checkFim()){
        //joga
        let result = core.joga(matriz, 2, nivelDeDificuldade) ;
        if(result === null){
            console.log("ERRO INESPERADO.") ;
            return;
        }
        matriz[result] = 2 ;
        if(!checkFim()){
            perguntaJogada();
        }
    }
}
function iniciaJogada(){
    matriz = [null, null, null, null, null, null, null, null, null];
    r1.question("Qual o nível de dificuldade de 0 a 3?", (dificuldade)=>{
        var dif = parseInt(dificuldade) ;
        if(dif < 0 || dif >3){
            iniciaJogada();
            return ;
        }
        nivelDeDificuldade = dif;
        perguntaJogada();
    })
    
}
function checkFim(){
    var vitoria = core.reconhecerVitoria(matriz) ;
    if(vitoria){
        console.log("Vitória do player "+vitoria+"! Na dificuldade:"+nivelDeDificuldade) ;
        iniciaJogada();
        return true;
    }
    var velha = core.reconhecerEmpate(matriz) ;
    if(velha){
        console.log("Deu velha! Na dificuldade:"+nivelDeDificuldade) ;
        iniciaJogada();
        return true;
    }
    return false;
}

function getItemString(item){
    if(item == null){
        return "[ ]";
    }
    return "["+item+"]";
}
function render(){
    console.log(getItemString(matriz[0]) +"|"+ getItemString(matriz[1]) +"|"+ getItemString(matriz[2])  );
    console.log(getItemString(matriz[3]) +"|"+ getItemString(matriz[4]) +"|"+ getItemString(matriz[5])  );
    console.log(getItemString(matriz[6]) +"|"+ getItemString(matriz[7]) +"|"+ getItemString(matriz[8])  ); 
};

iniciaJogada();