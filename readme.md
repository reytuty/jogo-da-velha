# Dependences

mongodb
node.js v14.17

## intall mongodb

brew install mongodb-community@4.4

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/


# Configurate

Change the /jogo-da-velha-api/config.json file with connection informations

```
{
    "port": 3000,
    "database":{
        "active":true,
        "user":"",
        "pass":"",
        "ip":"localhost:27017"
    }
}
```


### port 

http port to acess game page

### database

user (keep empty to do not use user and pass), ip (with port), pass

## run

Go to terminal

Enter in jogo-da-velha-api folder and install dependences

```
cd jogo-da-velha-api/
npm i
```

```
node index
```


## Play 

Open browser and acess:

```
http://localhost:3000/
```
