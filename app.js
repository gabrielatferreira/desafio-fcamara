const express = require('express');
const { MongoClient } = require('mongodb');

const userName = 'fcamara-database';
const password = 'fcamaradatabase!';
const database = 'fcamara';

const collectionUsuario = 'usuario';
const collectionUnidadeNegocio = 'unidade_negocio';
const collectionEstacaoTrabalho = 'estacao_trabalho';
const collectionLugaresEstacao = 'lugares_estacao';
const collectionTurnos = 'turnos';
const collectionReserva = 'reserva';

const uri = `mongodb+srv://${userName}:${password}@cluster0.qt4do.mongodb.net/${userName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());

app.post("/usuario", (req, res) => {
    client.connect(err => {
        const collectionU = client.db(database).collection(collectionUsuario);
        collectionU.insertOne(req.body, function(err, res) {
            if (err) throw err;
        });
    });
    return res.json(req.body);
});

var resultado;

app.get("/login", (req, res) => {
    client.connect(err => {
        const collectionU = client.db(database).collection(collectionUsuario);
        collectionU.find({}).toArray(function(err, result) {
        resultado = result;
        if (err) throw err;
        console.log(result);  
        });
    });
    return res.json({usuarios: resultado});
});

app.get("/unidade_negocio", (req, res) => {
    client.connect(err => {
        const collectionUn = client.db(database).collection(collectionUnidadeNegocio);
        collectionUn.find({}).toArray(function(err, result) {
        resultado = result;
        if (err) throw err;
        console.log(result);  
        });
    });
    return res.json({unidade: resultado});
});

app.get("/estacao_trabalho", (req, res) => {
    client.connect(err => {
        const collectionE = client.db(database).collection(collectionEstacaoTrabalho);
        collectionE.find({}).toArray(function(err, result) {
        resultado = result;
        if (err) throw err;
        console.log(result);  
        });
    });
    return res.json({unidade: resultado});
});

app.get("/lugares_estacao", (req, res) => {
    client.connect(err => {
        const collectionLe = client.db(database).collection(collectionLugaresEstacao);
        collectionLe.find({}).toArray(function(err, result) {
        resultado = result;
        if (err) throw err;
        console.log(result);  
        });
    });
    return res.json({unidade: resultado});
});

app.get("/turnos", (req, res) => {
    client.connect(err => {
        const collectionT = client.db(database).collection(collectionTurnos);
        collectionT.find({}).toArray(function(err, result) {
        resultado = result;
        if (err) throw err;
        console.log(result);  
        });
    });
    return res.json({unidade: resultado});
});

app.post("/reserva", (req, res) => {
    client.connect(err => {
        const collectionR =  client.db(database).collection(collectionReserva);
        collectionR.insertOne(req.body, function(err, res) {
            if (err) throw err;
        });
    });
    return res.json(req.body);
});

app.listen(8080, () => {
    console.log("servidor iniciado na porta 8080: http://localhost:8080")
});