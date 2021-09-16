const cors = require('cors');
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
const EstacaoTrabalhoSchema = new mongoose.Schema({ "estacao_trabalho": String, "id_unidade_negocio": String, quantidade_lugares: String });
const ReservaSchema = new mongoose.Schema({ "id_usuario": String, "id_unidade_negocio": String, "id_estacao_trabalho": String, "data_reserva": String, "requisicao_material": String, });

const app = express();

app.use(cors());
app.use(express.json());


/* ROTAS */

app.post("/login", [], async (req, res) => {
    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com email e senha!")

    if (req.body.email === null || req.body.email === undefined || req.body.email === "") 
        return res.json("Preencha o campo email!")
    
    if (!req.body.email.includes("@")) 
        return res.json("Não é um email válido!")

    if (req.body.senha === null || req.body.senha === undefined || req.body.senha === "") 
        return res.json("Preencha o campo senha!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Usuario = mongoose.model('usuarios', UsuarioSchema);

    const existeUsuario = await Usuario.find({ email: req.body.email, senha: req.body.senha }).exec();
    if(existeUsuario.length == 0) return res.json("Usuário inválido, verifique email e senha!")

    var response = {
        email: existeUsuario[0].email,
        id: existeUsuario[0]._id,
        nome: existeUsuario[0].nome,
        token: "true",
        message: "Usuário logado"
    }

    return res.json(response);
});

app.post("/usuarios", [], async (req, res) => {
    const empty = {};
    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com nome, email e senha!")
    
    if (req.body.nome === null || req.body.nome === undefined || req.body.nome === "") 
        return res.json("Preencha o campo nome!")

    if (req.body.email === null || req.body.email === undefined || req.body.email === "") 
        return res.json("Preencha o campo email!")
    
    if (!req.body.email.includes("@")) 
        return res.json("Preencha um email válido!")

    if (req.body.senha === null || req.body.senha === undefined || req.body.senha === "") 
        return res.json("Preencha o campo senha!")
    
    if (req.body.senha.length < 6) 
        return res.json("Preencha o campo senha com tamanho mínimo de 6 caracteres!")

    await mongoose.connect(uri, { useNewUrlParser: true });

    const Usuario = mongoose.model('usuarios', UsuarioSchema);

    const existeUsuario = await Usuario.find({email: req.body.email}).exec();
    if(existeUsuario.length > 0) return res.json("Email já cadastrado!")

    var usuarioCadastrado = await Usuario.create(req.body);
    var response = {
        email: usuarioCadastrado.email,
        id: usuarioCadastrado._id,
        nome: usuarioCadastrado.nome,
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
                unidade_negocio: unidadesNegocio[index].unidade_negocio
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há unidades de negócio cadastradas");
});

app.post("/unidades_negocio", [], async (req, res) => {

    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário preencher com uma unidade de negócio!")
    
    if (req.body.unidade_negocio === null || req.body.unidade_negocio === undefined || req.body.unidade_negocio === "") 
        return res.json("Necessário preencher o campo unidade de negócio!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const UnidadeNegocio = mongoose.model('unidade_negocio', UnidadeNegocioSchema);

    const existeUnidadeNegocio = await UnidadeNegocio.find({ unidade_negocio: req.body.unidade_negocio}).exec();
    if(existeUnidadeNegocio.length > 0) return res.json("Unidade de negócio já cadastrada!")

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
                quantidade_lugares: estacoesTrabalho[index].quantidade_lugares
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
                id_unidade_negocio: estacoesTrabalho[index].id_unidade_negocio,
                estacao_trabalho: estacoesTrabalho[index].estacao_trabalho,
                quantidade_lugares: estacoesTrabalho[index].quantidade_lugares
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas");
});

app.post("/estacoes_trabalho", [], async (req, res) => {

    if (req.body === null || req.body === undefined || Object.keys(req.body).length === 0) 
        return res.json("Necessário passar um corpo na mensagem com a estacão de trabalho, id da unidade de negocio e quantidade de lugares !")
    
    if (req.body.id_unidade_negocio === null || req.body.id_unidade_negocio === undefined || req.body.id_unidade_negocio === "") 
        return res.json("Preencha o campo id da unidade de negocio!")

    if (req.body.estacao_trabalho === null || req.body.estacao_trabalho === undefined || req.body.estacao_trabalho === "") 
        return res.json("Preencha o campo estação de trabalho!")

    if (req.body.quantidade_lugares === null || req.body.quantidade_lugares === undefined || req.body.quantidade_lugares === "") 
        return res.json("Preencha o campo quantidade de lugares!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const existeEstacaoTrabalho = await EstacaoTrabalho.find({ estacao_trabalho: req.body.estacao_trabalho }).exec();
    if(existeEstacaoTrabalho.length > 0) return res.json("Estação de trabalho já cadastrada!")

    const estacaoTrabalho = await EstacaoTrabalho.create(req.body);

    var response = {
        id: estacaoTrabalho._id,
        estacao_trabalho: estacaoTrabalho.estacao_trabalho,
        id_unidade_negocio: estacaoTrabalho.id_unidade_negocio
    }

    return res.json(response);
});

app.get("/reservas", [], async (req, res) => {
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);

    const reservas = await Reserva.find().exec();
    if(reservas.length > 0) {
        responseList = [];
        
        for(var index in reservas) {
            responseList.push({
                id: reservas[index]._id,
                id_unidade_negocio: reservas[index].id_unidade_negocio,
                id_estacao_trabalho: reservas[index].id_estacao_trabalho,
                requisicao_material: reservas[index].requisicao_material,
                data_reserva: reservas[index].data_reserva,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas!");
});

app.post("/reservas/disponiveis", [], async (req, res) => {

    if(req.body.data_reserva === null || req.body.data_reserva === undefined || req.body.data_reserva === "")
        return res.json("necessários preencher uma data para reserva")

    if(!req.body.data_reserva.match("^[0-9]{2}[\\-][0-9]{2}[\\-][0-9]{4}$")) 
        return res.json("Data nao está no padrão esperado dd-mm-yyyy!") 

    var dataHoje = new Date
    var dataDetalhe = req.body.data_reserva.split("-");

    if(dataDetalhe[2] < dataHoje.getYear())
        return res.json("Preencha uma data para reserva do ano corrente em diante!")

    if(dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear())
        return res.json("Preencha uma data para reserva do mês corrente em diante!")

    if(dataDetalhe[0] < dataHoje.getDate() && dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear)
        return res.json("Preencha uma data para reserva do dia corrente em diante!")

    if(req.body.id_unidade_negocio === null || req.body.id_unidade_negocio === undefined || req.body.id_unidade_negocio === "")
        return res.json("Preencha id da unidade de negocio!")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);
    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const reservas = await Reserva.find({ 
        id_unidade_negocio: req.body.id_unidade_negocio,
        data_reserva: req.body.data_reserva,
    }).exec();

    const estacoesTrabalho = await EstacaoTrabalho.find({ id_unidade_negocio: req.body.id_unidade_negocio }).exec();
    let response = []
    if(estacoesTrabalho != null && estacoesTrabalho.length > 0) {
        for (var index_et in estacoesTrabalho) {
            const value = estacoesTrabalho[index_et]._id.toString();
            console.log(value)
            let quantidade_reservas = reservas.filter(reserva => reserva.id_estacao_trabalho === value).length
            console.log(quantidade_reservas)
            response.push({
                quantidade_reservas: quantidade_reservas,
                quantidade_lugares: estacoesTrabalho[index_et].quantidade_lugares,
                id_estacao_trabalho: estacoesTrabalho[index_et]._id,
                estacao_trabalho: estacoesTrabalho[index_et].estacao_trabalho,
            })
        }
    }
    
    return res.json(response)
});

app.get("/reservas/:id_usuario", [], async (req, res) => {

    if(req.params.id_usuario === null || req.params.id_usuario === undefined || req.params.id_usuario === "")
        return res.json("Preencha o id do usuario")
    
    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);

    const reservas = await Reserva.find({ id_usuario: req.params.id_usuario }).exec();
    if(reservas.length > 0) {
        var responseList = [];
        
        for(var index in reservas) {
            responseList.push({
                id: reservas[index]._id,
                id_usuario:reservas[index].id_usuario,
                id_unidade_negocio: reservas[index].id_unidade_negocio,
                id_estacao_trabalho: reservas[index].id_estacao_trabalho,
                requisicao_material: reservas[index].requisicao_material,
                data_reserva: reservas[index].data_reserva,
            })
        }
        return res.json(responseList);
    }

    return res.json("Não há estações de trabalho cadastradas!");
});

app.post("/reservas", [], async (req, res) => {

    if(req.body.data_reserva === null || req.body.data_reserva === undefined || req.body.data_reserva === "")
        return res.json("Preencha uma data para fazer sua reserva!")

    if(!req.body.data_reserva.match("^[0-9]{2}[\\-][0-9]{2}[\\-][0-9]{4}$")) 
        return res.json("Data nao está no padrão esperado dd-mm-yyyy") 

    var dataHoje = new Date
    var dataDetalhe = req.body.data_reserva.split("-");

    if(dataDetalhe[2] < dataHoje.getYear())
        return res.json("Preencha uma data para reserva do ano corrente em diante!")

    if(dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear())
        return res.json("Preencha uma data para reserva do mês corrente em diante!")

    if(dataDetalhe[0] < dataHoje.getDate() && dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear)
        return res.json("Preencha uma data para reserva do dia corrente em diante!")

    if(req.body.id_unidade_negocio === null || req.body.id_unidade_negocio === undefined || req.body.id_unidade_negocio === "")
        return res.json("Preencha a unidade de negocio!")

    if(req.body.id_estacao_trabalho === null || req.body.id_estacao_trabalho === undefined || req.body.id_estacao_trabalho === "")
        return res.json("Preencha uma estação de trabalho!")

    if(req.body.id_usuario === null || req.body.id_usuario === undefined || req.body.id_usuario === "")
        return res.json("Preencha um usuário")

    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);
    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const reservas = await Reserva.find({ 
        id_unidade_negocio: req.body.id_unidade_negocio,
        id_estacao_trabalho: req.body.id_estacao_trabalho,
        data_reserva: req.body.data_reserva,
    }).exec();

    for(var index in reservas) {
        console.log(reservas[index])
    } 

    if(reservas.filter(reserva => reserva.id_usuario==req.body.id_usuario && reserva.data_reserva==req.body.data_reserva).length > 0) {
        return res.json("Você já possui reserva nesta data, necessário excluir e fazer uma nova reserva!")
    }

    const estacoesTrabalho = await EstacaoTrabalho.find({ 
        id_unidade_negocio: req.body.id_unidade_negocio,
        id_estacao_trabalho: req.body.id_estacao_trabalho
    }).exec();

    let quantidade_de_lugares = 0;
    if(estacoesTrabalho != null && estacoesTrabalho.length > 0)
        quantidade_de_lugares = parseInt(estacoesTrabalho[0].quantidade_lugares);

    console.log("quantidade de lugares " + quantidade_de_lugares)
    if(quantidade_de_lugares == null || quantidade_de_lugares == undefined || quantidade_de_lugares == 0) {
        return res.json("Não é possível reservar, pois não foi informado a quantidade de lugares nesta estação")
    }
    
    const reserva = await Reserva.create(req.body);

    var response = {
        id: reserva._id,
        id_unidade_negocio: reserva.id_unidade_negocio,
        id_estacao_trabalho: reserva.id_estacao_trabalho,
        requisicao_material: reserva.requisicao_material,
        data_reserva: reserva.data_reserva
    }

    return res.json(response);
});



app.delete("/reservas", [], async (req, res) => {

    if(req.body.data_reserva === null || req.body.data_reserva === undefined || req.body.data_reserva === "")
        return res.json("Preencha uma data para a reserva!")

    if(!req.body.data_reserva.match("^[0-9]{2}[\\-][0-9]{2}[\\-][0-9]{4}$")) 
        return res.json("Data nao está no padrão esperado dd-mm-yyyy!") 

    var dataHoje = new Date
    var dataDetalhe = req.body.data_reserva.split("-");

    if(dataDetalhe[2] < dataHoje.getYear())
        return res.json("Preencha uma data para reserva do ano corrente em diante!")

    if(dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear())
        return res.json("Preencha uma data para reserva do mês corrente em diante!")

    if(dataDetalhe[0] < dataHoje.getDate() && dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear)
        return res.json("Preencha uma data para reserva do dia corrente em diante!")

    if(req.body.id_unidade_negocio === null || req.body.id_unidade_negocio === undefined || req.body.id_unidade_negocio === "")
        return res.json("Preencha o id da unidade de negócio!")

    if(req.body.id_estacao_trabalho === null || req.body.id_estacao_trabalho === undefined || req.body.id_estacao_trabalho === "")
        return res.json("Preencha o id da estação de trabalho!")

    if(req.body.id_usuario === null || req.body.id_usuario === undefined || req.body.id_usuario === "")
        return res.json("Preencha o id do usuario!")

    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);

    const reservas = await Reserva.deleteOne({ 
        _id: req.body.id_reserva,
    }).exec();

    var response = {
        id: reservas._id,
        id_unidade_negocio: reservas.id_unidade_negocio,
        id_estacao_trabalho: reservas.id_estacao_trabalho,
        requisicao_material: reservas.requisicao_material,
        data_reserva: reservas.data_reserva,
        message: "Sua reserva foi excluída!"
    }

    return res.json(response)
});

app.put("/reservas", [], async (req, res) => {

    if(req.body.data_reserva === null || req.body.data_reserva === undefined || req.body.data_reserva === "")
        return res.json("Preencha uma data!")

    if(!req.body.data_reserva.match("^[0-9]{2}[\\-][0-9]{2}[\\-][0-9]{4}$")) 
        return res.json("Data nao está no padrão esperado dd-mm-yyyy!") 

    var dataHoje = new Date
    var dataDetalhe = req.body.data_reserva.split("-");

    if(dataDetalhe[2] < dataHoje.getYear())
        return res.json("Preencha uma data do ano corrente em diante!")

    if(dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear())
        return res.json("Preencha uma data do mês corrente em diante!")

    if(dataDetalhe[0] < dataHoje.getDate() && dataDetalhe[1] < dataHoje.getMonth() && dataDetalhe[2] === dataHoje.getYear)
        return res.json("Preencha uma data do dia corrente em diante!")

    if(req.body.id_unidade_negocio === null || req.body.id_unidade_negocio === undefined || req.body.id_unidade_negocio === "")
        return res.json("Preencha o id da unidade de negócio!")

    if(req.body.id_estacao_trabalho === null || req.body.id_estacao_trabalho === undefined || req.body.id_estacao_trabalho === "")
        return res.json("Preencha o id da estação de trabalho!")

    if(req.body.id_usuario === null || req.body.id_usuario === undefined || req.body.id_usuario === "")
        return res.json("Preencha o id do usuario!")

    if(req.body.id_reserva === null || req.body.id_reserva === undefined || req.body.id_reserva === "")
        return res.json("Preencha o id da reserva!")

    await mongoose.connect(uri, { useNewUrlParser: true });

    const Reserva = mongoose.model('reserva',ReservaSchema);
    const EstacaoTrabalho = mongoose.model('estacao_trabalho', EstacaoTrabalhoSchema);

    const reservas = await Reserva.find({ 
        id_unidade_negocio: req.body.id_unidade_negocio,
        id_estacao_trabalho: req.body.id_estacao_trabalho,
        data_reserva: req.body.data_reserva,
    }).exec();

    const estacoesTrabalho = await EstacaoTrabalho.find({ 
        id_unidade_negocio: req.body.id_unidade_negocio,
        id_estacao_trabalho: req.body.id_estacao_trabalho
    }).exec();

    let quantidade_de_lugares = 0;
    if(estacoesTrabalho != null && estacoesTrabalho.length > 0)
        quantidade_de_lugares = parseInt(estacoesTrabalho[0].quantidade_lugares);

    console.log("quantidade de lugares " + quantidade_de_lugares)
    if(quantidade_de_lugares == null || quantidade_de_lugares == undefined || quantidade_de_lugares == 0) {
        return res.json("Não é possível atualizar a reserva, pois não foi informado a quantidade de lugares nesta estação!")
    }

    const reserva = await Reserva.create({
        id_usuario: req.body.id_usuario,
        id_unidade_negocio: req.body.id_unidade_negocio,
        requisicao_material: req.body.requisicao_material,
        id_estacao_trabalho: req.body.id_estacao_trabalho,
        data_reserva: req.body.data_reserva,
    });

    const reservaDeleted = await Reserva.deleteOne({
        _id: req.body.id_reserva
    });

    var response = {
        id: reserva._id,
        id_unidade_negocio: reserva.id_unidade_negocio,
        id_estacao_trabalho: reserva.id_estacao_trabalho,
        requisicao_material: reserva.requisicao_material,
        data_reserva: reserva.data_reserva,
    }

    return res.json(response)
});

app.listen(process.env.PORT || 3000);