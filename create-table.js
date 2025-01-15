import { sql } from './db.js';

//sql `DROP TABLE IF EXISTS videos` (apaga tabela e cria abaixo)

async function createTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                duration INT
            );
        `;
        console.log('Parabéns, sua tabela foi criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabela:', error);
    } finally {
        sql.end(); // Encerra a conexão com o banco
    }
}

createTable();
