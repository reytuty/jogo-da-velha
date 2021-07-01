const mongoose = require('mongoose');

const TrackLog = mongoose.model('TrackLog', { client:String, type: String, date:Date, info:Object });
const TrackResult = mongoose.model('TrackResult', { client: String, date:Date, info:Object });
function TrackModel(config){
    var user = encodeURIComponent(config.user);
    var password = encodeURIComponent(config.pass);
    var authMechanism = 'DEFAULT';
    const { MongoClient } = require("mongodb");
    // Connection URL

    // Replace the uri string with your MongoDB deployment's connection string.
    var clusterUrl = config.ip;
    
    let uri = `mongodb://${user}:${password}@${clusterUrl}/track?authMechanism=${authMechanism}`;
    if(!config.user){
        uri = `mongodb://${clusterUrl}/track`;
    }
    this.connect = async ()=>{
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    }
    this.saveTrack = (client, type, info)=>{
        try{
            const track = new TrackLog({ client, type, date: new Date(), info });
            track.save().then(() => console.log('track saved'));
        }catch(e){
            console.log(e) ;
        }
    }
    this.saveResult = (client, info)=>{
        try{
            const trackResult = new TrackResult({ client, date: new Date(), info });
            trackResult.save().then(() => console.log('result saved'));
        }catch(e){
            console.log(e) ;
        }
    }
}

module.exports = TrackModel;