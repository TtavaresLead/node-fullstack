import { fastify } from 'fastify'
import { databaseMemory } from './database-memory.js'


import http from "http";
import sql from './db.js'; // Importa a conexão configurada
import  {DatabasePostgres}  from './database-postgres.js';
import { title } from 'process';

// Função que manipula requisições
const requestHandler = async (req, res) => {
    try {
        // Consulta simples para verificar conexão
        const result = await sql`SELECT version()`;
        const { version } = result[0];

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`PostgreSQL Version: ${version}`);
    } catch (error) {
        console.error("Erro ao conectar ao banco:", error);

        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Erro ao conectar ao banco de dados.");
    }
};

// Cria o servidor HTTP
http.createServer(requestHandler).listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});





const server = fastify()

// Criação do database
//const database = new databaseMemory()
//const database = new DatabasePostgres() Devido não estar exluindo os videos no Postman
const database = new DatabasePostgres()  // Certifique-se de que este é o banco de dados real




// POST - Criar um novo vídeo
server.post('/videos', async (request, reply) => {
    const body = request.body

    console.log('Dados recebidos no POST:', body) // Log para exibir o corpo da requisição

    const videoId = await database.create({
        title: body.title,
        description: body.description,
        duration: body.duration,
    })

    // Retorna o ID do vídeo criado junto com os dados
    return reply.status(201).send({
        message: 'Vídeo criado com sucesso!',
        id: videoId,
        title: body.title,
        description: body.description,
        duration: body.duration,
    })
})

// GET - Listar vídeos
server.get('/videos', async (request, reply) => {
    console.log('Requisição GET recebida') // Log para acompanhar requisições GET
    const videos = await database.list() // Lista os vídeos com IDs
    return reply.send(videos)
})

// PUT - Atualizar vídeo
// PUT - Atualizar vídeo
server.put('/videos/:id', async (request, reply) => {
    const { id } = request.params; // Obtém o ID da URL
    const { title, description, duration } = request.body; // Desestrutura os dados do corpo

    console.log(`Atualizando vídeo com ID ${id}:`, { title, description, duration }); // Log

    try {
        // Atualiza o vídeo no banco
        await database.update(id, { title, description, duration });
        return reply.status(200).send({ message: `Vídeo ${id} atualizado com sucesso!` });
    } catch (error) {
        return reply.status(404).send({ error: error.message }); // Erro se ID não encontrado
    }
});


// DELETE - Remover vídeo
server.delete('/videos/:id', (request, reply) => {
    const { id } = request.params

    console.log(`Deletando vídeo com ID ${id}`) // Log para acompanhar exclusões

    try {
        database.delete(id)
        return reply.status(200).send({ message: `Vídeo ${id} removido com sucesso!` })
    } catch (error) {
        return reply.status(404).send({ error: error.message }) // Retorna erro se ID não for encontrado
    }
})

// Inicializa o servidor
server.listen({ 
    port: process.env.port ?? 3333 }, (err, address) => {
    if (err) {
        console.error('Erro ao iniciar o servidor:', err)
        process.exit(1)
    }
    console.log(`Servidor rodando em ${address}`)
})
