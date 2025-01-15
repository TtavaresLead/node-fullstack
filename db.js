import 'dotenv/config';  // Carrega variáveis de ambiente
import postgres from 'postgres';  // Importa a biblioteca para conectar ao PostgreSQL

// Cria a conexão com o banco de dados usando a URL do .env
const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',  // Neon exige SSL para a conexão
});

// Função de teste para verificar a conexão
const testConnection = async () => {
  try {
    // Realiza uma consulta simples
    const result = await sql`SELECT version()`;
    console.log("Conexão bem-sucedida. Versão do PostgreSQL:", result[0].version);
  } catch (error) {
    console.error("Erro na conexão com o banco de dados:", error);
  }
};

// Chama a função para testar a conexão
testConnection();

// Exporta a instância do banco para ser usada em outros arquivos
export default sql;


