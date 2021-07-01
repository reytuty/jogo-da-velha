const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors") ;

const Track = require("./modules/TrackModel") ;

var configPath = "./config.json";
let config = require("config_json_or_default")({ 
    port: 3000,
    database:{
        active:true,
        user:"",
        pass:"",
        ip:"localhost:27017"
    }
}, configPath);


let track = new Track(config.database) ;
if(config.database.active){
    track.connect() ;
}

/**
 * Estou importando do npm mas o código é meu também ok? Só tornei publico. 
 */
const VelhaCore = require("jogo-da-velha-core");

let velha = new VelhaCore() ;

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function checkEnd(socket){
    var ganhador = velha.reconhecerVitoria(socket.game.plays) ;
    if(ganhador){
        socket.game.end = true ;
        socket.game.placar[ganhador==1?"x":"o"]++;
        socket.emit("game-info", socket.game) ;
        var vitoria = ganhador==1?"X":"O";
        socket.emit("message", "Ganhou o "+vitoria );
        if(config.database.active){
            track.saveResult(socket.client.id, { result:vitoria, ...socket.game}) ;
        }
        return true;
    }
    var empate = velha.reconhecerEmpate(socket.game.plays) ;
    if(empate){
        socket.game.end = true ;
        socket.game.placar.v++;
        socket.emit("message", "Deu Velha!");
        socket.emit("game-info", socket.game) ;
        if(config.database.active){
            track.saveResult(socket.client.id, { result:"velha", ...socket.game}) ;
        }
        return true;
    }
    return false ;
}

io.on('connection', (socket) => {
    socket.game = {
        end:false,
        level:2,
        plays:[null, null, null, null, null, null, null, null, null],
        placar:{x:0,o:0,v:0}
    }
    if(config.database.active){
        track.saveTrack(socket.client.id,"connect",{})
    }
    console.log('a user connected');
    socket.emit("game-info", socket.game) ;
    socket.on('selectLevel', (level) => {
        socket.game.level = level > 3 ? 3: (level<0)?0:level;
        socket.emit("game-info", socket.game) ;
        socket.emit("message", "Level trocado para "+level);
        return socket.game.level ;
    });
    socket.on('start', () => {
        socket.game.end = false ;
        socket.game.plays = [null, null, null, null, null, null, null, null, null] ;
        socket.emit("game-info", socket.game) ;
        socket.emit("message", "Jogo iniciado. Escolha uma posição.");
        if(config.database.active){
            track.saveTrack(socket.client.id,"start",socket.game.placar) ;
        }
        return socket.game ;
    });
    socket.on('play', (position) => {
        if(socket.game.end){
            socket.emit("message", "Aperte 'jogar novamente' para jogar.");
            return ;
        }
        if(config.database.active){
            track.saveTrack(socket.client.id,"play", position) ;
        }
        //se for, verifica se a posição está livre
        if( socket.game.plays[position] == null ){
            socket.game.plays[position] = 1 ;
            if(checkEnd(socket)){
                return ;
            }
            var jogada = velha.joga(socket.game.plays, 2, socket.game.level) ;
            socket.game.plays[jogada] = 2 ;
            if(checkEnd(socket)){
                return ;
            }
            socket.emit("message", "Sua vez.");
        } else {
            socket.emit("message", "Posição já ocupada!");
        }
        socket.emit("game-info", socket.game) ;
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

server.listen(config.port, () => {
  console.log('listening on *:'+config.port);
});