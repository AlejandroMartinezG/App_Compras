import pg from 'pg';

const { Client } = pg;

// Usando los componentes de conexión por separado (evita problemas de URL-encoding)
const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

try {
  console.log('Intentando conectar a la base de datos...');
  await client.connect();
  const res = await client.query('SELECT current_database(), current_user, version()');
  console.log('✅ ¡Conexión exitosa!');
  console.log('Database:', res.rows[0].current_database);
  console.log('User:', res.rows[0].current_user);
  console.log('Version:', res.rows[0].version);
  
  // Listar tablas
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
  console.log('\nTablas en el schema public:');
  tables.rows.forEach(r => console.log(' -', r.table_name));
  
  await client.end();
} catch (err) {
  console.error('❌ Error de conexión:', err.message);
  process.exit(1);
}
