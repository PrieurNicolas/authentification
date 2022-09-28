const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "NeoR",
    password: "b",
    port: 5432,
});

module.exports = pool;

//const poolConfig = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL, ssl: { rejeectUnauthorized: false}} : localPoolConfig;