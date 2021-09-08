const express = require('express');
const { body, check } = require('express-validator');
const mongoose = require('mongoose');
const validator = require('validator');

const userName = 'fcamara-database';
const password = 'fcamaradatabase!';
const database = 'fcamara';

const uri = `mongodb+srv://${userName}:${password}@cluster0.qt4do.mongodb.net/${database}?retryWrites=true&w=majority`;

const UsuarioSchema = new mongoose.Schema({nome: String, email: String, senha: String});
const UnidadeNegocioSchema = new mongoose.Schema({ "unidade_negocio": String });
const EstacaoTrabalhoSchema = new mongoose.Schema({ "estacao_trabalho": String, "id_unidade_negocio": String });
const LugarEstacaoTrabalhoSchema = new mongoose.Schema({ "id_estacao_trabalho": String, "lugar_estacao_trabalho": String });
const TurnoSchema = new mongoose.Schema({ "turno": String });
const ReservaSchema = new mongoose.Schema({ "id_unidade_negocio": String, "id_estacao_trabalho": String, "id_lugar_estacao_trabalho": String, "data_reserva": Date });

const app = express();

app.use(express.json());

app.get("/login", [], async (req, res) => {
    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com email e senha!")

    if (req.body.email === null || req.body.email === undefined || req.body.email === "") 
        return res.json("Necessário preencher o campo email!")
    
    if (!req.body.email.includes("@")) 
        return res.json("Este email não é válido!")

    if (req.body.senha === null || req.body.senha === undefined || req.body.senha === "") 
        return res.json("Necessário preencher o campo senha!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Usuario = mongoose.model('usuarios', UsuarioSchema);

    const existeUsuario = await Usuario.find({email: req.body.email, senha: req.body.senha }).exec();
    if(existeUsuario.length == 0) return res.json("Usuário inválido, verifique email e senha!")

    var response = {
        email: existeUsuario.email,
        id: existeUsuario._id,
        nome: existeUsuario.nome,
        token: "true",
        message: "usuário logado"
    }

    return res.json(response);
});

app.post("/usuarios", [], async (req, res) => {
    const empty = {};
    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com nome, email e senha!")
    
    if (req.body.nome === null || req.body.nome === undefined || req.body.nome === "") 
        return res.json("Necessário preencher o campo nome!")

    if (req.body.email === null || req.body.email === undefined || req.body.email === "") 
        return res.json("Necessário preencher o campo email!")
    
    if (!req.body.email.includes("@")) 
        return res.json("Este email não é válido!")

    if (req.body.senha === null || req.body.senha === undefined || req.body.senha === "") 
        return res.json("Necessário preencher o campo senha!")
    
    if (req.body.senha.length < 6) 
        return res.json("Necessário preencher o campo senha com tamanho mínimo de 6 caracteres, deve conter na senha um símbolo, um número e uma letra caixa alta!")

    await mongoose.connect(uri, { useNewUrlParser: true });

    const Usuario = mongoose.model('usuarios', UsuarioSchema);

    const existeUsuario = await Usuario.find({email: req.body.email}).exec();
    if(existeUsuario.length > 0) return res.json("Informe outro email, este já está cadastrado!")

    var usuarioCadastrado = await Usuario.create(req.body);
    var response = {
        email: usuarioCadastrado.email,
        id: usuarioCadastrado._id,
        nome: usuarioCadastrado.nome,
    }

    return res.json(response);
});

app.get("/turnos", [], async (req, res) => {
    const empty = {};
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Turno = mongoose.model('turno', TurnoSchema);

    const turnos = await Turno.find().exec();
    if(turnos.length > 0) {
        responseList = [];
        
        for(var index in turnos) {
            responseList.push({
                id: turnos[index]._id,
                turno: turnos[index].turno,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há turnos cadastrados");
});

app.post("/turnos", [], async (req, res) => {
    const empty = {};
    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com o turno!")
    
    if (req.body.turno === null || req.body.turno === undefined || req.body.turno === "") 
        return res.json("Necessário preencher o campo turno!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Turno = mongoose.model('turno', TurnoSchema);

    const existeTurno = await Turno.find({ turno: req.body.turno}).exec();
    if(existeTurno.length > 0) return res.json("Informe outro turno, este já está cadastrado!")

    const turnoCriado = await Turno.create(req.body);

    var response = {
        id: turnoCriado._id,
        turno: turnoCriado.turno,
    }

    return res.json(response);
});

app.get("/unidades_negocio", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const UnidadeNegocio = mongoose.model('unidade_negocio', UnidadeNegocioSchema);

    const unidadesNegocio = await UnidadeNegocio.find().exec();
    if(unidadesNegocio.length > 0) {
        responseList = [];
        
        for(var index in unidadesNegocio) {
            responseList.push({
                id: unidadesNegocio[index]._id,
                turno: unidadesNegocio[index].unidade_negocio,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há unidades de negócio cadastradas");
});

app.post("/unidades_negocio", [], async (req, res) => {

    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem!")
    
    if (req.body.unidade_negocio === null || req.body.unidade_negocio === undefined || req.body.unidade_negocio === "") 
        return res.json("Necessário preencher o campo unidade de negocio!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const UnidadeNegocio = mongoose.model('unidade_negocio', UnidadeNegocioSchema);

    const existeUnidadeNegocio = await UnidadeNegocio.find({ unidade_negocio: req.body.unidade_negocio}).exec();
    if(existeUnidadeNegocio.length == 0) return res.json("Informe outra unidade de negocio, este já está cadastrada!")

    const unidadeNegocio = await UnidadeNegocio.create(req.body);

    var response = {
        id: unidadeNegocio._id,
        unidade_negocio: unidadeNegocio.unidade_negocio,
    }

    return res.json(response);
});

app.get("/estacoes_trabalho", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const estacoesTrabalho = await EstacaoTrabalho.find().exec();
    if(estacoesTrabalho.length > 0) {
        responseList = [];
        
        for(var index in estacoesTrabalho) {
            responseList.push({
                id: estacoesTrabalho[index]._id,
                id_unidade_negocio: estacoesTrabalho[index].id_unidade_negocio,
                estacao_trabalho: estacoesTrabalho[index].estacao_trabalho,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas");
});

app.get("/estacoes_trabalho/:id_unidade_negocio", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const estacoesTrabalho = await EstacaoTrabalho.find({ id_unidade_negocio: req.params.id_unidade_negocio }).exec();
    if(estacoesTrabalho.length > 0) {
        responseList = [];
        
        for(var index in estacoesTrabalho) {
            responseList.push({
                id: estacoesTrabalho[index]._id,
                estacao_trabalho: estacoesTrabalho[index].estacao_trabalho,
                id_unidade_negocio:  estacoesTrabalho[index].id_unidade_negocio
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas");
});

app.post("/estacoes_trabalho", [], async (req, res) => {

    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com a estação de trabalho e o id da unidade de negocio !")
    
    if (req.body.id_unidade_negocio === null || req.body.id_unidade_negocio === undefined || req.body.id_unidade_negocio === "") 
        return res.json("Necessário preencher o campo id da unidade de negocio!")

    if (req.body.estacao_trabalho === null || req.body.estacao_trabalho === undefined || req.body.estacao_trabalho === "") 
        return res.json("Necessário preencher o campo estação de trabalho!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const existeEstacaoTrabalho = await EstacaoTrabalho.find({ estacao_trabalho: req.body.estacao_trabalho, id_unidade_negocio: req.body.id_unidade_negocio }).exec();
    if(existeEstacaoTrabalho.length > 0) return res.json("Esta estação de trabalho já está cadastrada!")

    const estacaoTrabalho = await EstacaoTrabalho.create(req.body);

    var response = {
        id: estacaoTrabalho._id,
        estacao_trabalho: estacaoTrabalho.estacao_trabalho,
        id_unidade_negocio: estacaoTrabalho.id_unidade_negocio
    }

    return res.json(response);
});

app.get("/lugares_estacao_trabalho", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const LugarEstacaoTrabalho = mongoose.model('lugar_estacao_trabalho', LugarEstacaoTrabalhoSchema);

    const lugaresEstacaoTrabalho = await LugarEstacaoTrabalho.find().exec();
    if(lugaresEstacaoTrabalho.length > 0) {
        responseList = [];
        
        for(var index in lugaresEstacaoTrabalho) {
            responseList.push({
                id: lugaresEstacaoTrabalho[index]._id,
                id_estacao_trabalho: lugaresEstacaoTrabalho[index].id_estacao_trabalho,
                lugar_estacao_trabalho: lugaresEstacaoTrabalho[index].lugar_estacao_trabalho,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há lugares cadastrados");
});

app.get("/lugares_estacao_trabalho/:id_estacao_trabalho", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const LugarEstacaoTrabalho = mongoose.model('lugar_estacao_trabalho', LugarEstacaoTrabalhoSchema);

    const lugaresEstacaoTrabalho = await LugarEstacaoTrabalho.find({ id_estacao_trabalho: req.params.id_estacao_trabalho}).exec();
    if(lugaresEstacaoTrabalho.length > 0) {
        responseList = [];
        
        for(var index in lugaresEstacaoTrabalho) {
            responseList.push({
                id: lugaresEstacaoTrabalho[index]._id,
                id_estacao_trabalho: lugaresEstacaoTrabalho[index].id_estacao_trabalho,
                lugar_estacao_trabalho: lugaresEstacaoTrabalho[index].lugar_estacao_trabalho,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há lugares cadastrados nessa estação de trabalho");
});

app.post("/lugares_estacao_trabalho", [], async (req, res) => {

    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com a estacao de trabalho e o id da unidade de negocio!")
    
    if (req.body.id_estacao_trabalho === null || req.body.id_estacao_trabalho === undefined || req.body.id_estacao_trabalho === "") 
        return res.json("Necessário preencher o campo id da estacao de trabalho!")

        if (req.body.lugar_estacao_trabalho === null || req.body.lugar_estacao_trabalho === undefined || req.body.lugar_estacao_trabalho === "") 
        return res.json("Necessário preencher o campo lugar da estacao de trabalho!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const LugarEstacaoTrabalho = mongoose.model('lugar_estacao_trabalho', LugarEstacaoTrabalhoSchema);

    const existeLugarEstacaoTrabalho = await LugarEstacaoTrabalho.find({ lugar_estacao_trabalho: req.body.lugar_estacao_trabalho, id_estacao_trabalho: req.body.id_estacao_trabalho }).exec();
    if(existeLugarEstacaoTrabalho.length > 0) return res.json("Informe outro lugar da estação de trabalho, este já está cadastrado!")

    const lugarEstacaoTrabalho = await LugarEstacaoTrabalho.create(req.body);

    var response = {
        id: lugarEstacaoTrabalho._id,
        estacao_trabalho: lugarEstacaoTrabalho.id_estacao_trabalho,
        lugar_estacao_trabalho: lugarEstacaoTrabalho.lugar_estacao_trabalho
    }

    return res.json(response);
});

app.get("/reservas", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);

    const reservas = await Reserva.find().exec();
    if(estacoesTrabalho.length > 0) {
        responseList = [];
        
        for(var index in reservas) {
            responseList.push({
                id: reservas[index]._id,
                id_unidade_negocio: reservas[index].id_unidade_negocio,
                id_estacao_trabalho: reservas[index].id_estacao_trabalho,
                id_lugar_estacao_trabalho: reservas[index].id_lugar_estacao_trabalho,
                requisicao_material: reservas[index].requisicao_material,
                data_reserva: reservas[index].data_reserva,
                id_turno: reservas[index].id_turno
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas");
});

app.post("/reservas", [], async (req, res) => {

    if(req.body.data === null || req.body.data === undefined || req.body.data === "")
        return res.json("Necessário preencher uma data para reserva!")

    if(!req.body.data.match("^\d{2}[\-]\d{2}[\-]\d{4}$")) 
        return res.json("Data nao está no padrão esperado dd-mm-yyyy!") 

    var dataHoje = new Date
    var dataDetalhe = req.body.data.split("-");

    if(dataDetalhe[2] < dataHoje.getYear())
        return res.json("Necessário preencher uma data para reserva do ano corrente em diante!")

    if(dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear())
        return res.json("Necessário preencher uma data para reserva do mês corrente em diante!")

    if(dataDetalhe[0] < dataHoje.getDate() && dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear)
        return res.json("Necessário preencher uma data para reserva do dia corrente em diante!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);

    const reservas = await Reserva.find({ id_unidade_negocio: req.params.id_unidade_negocio }).exec();
    if(estacoesTrabalho.length > 0) {
        responseList = [];
        
        for(var index in reservas) {
            responseList.push({
                id: reservas[index]._id,
                id_unidade_negocio: reservas[index].id_unidade_negocio,
                id_estacao_trabalho: reservas[index].id_estacao_trabalho,
                id_lugar_estacao_trabalho: reservas[index].id_lugar_estacao_trabalho,
                requisicao_material: reservas[index].requisicao_material,
                data_reserva: reservas[index].data_reserva,
                id_turno: reservas[index].id_turno
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});