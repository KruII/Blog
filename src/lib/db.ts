import { Pool } from "pg";

// Tworzymy pulę połączeń z bazą danych PostgreSQL
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: false, // Wyłączenie SSL
});

export default pool;
