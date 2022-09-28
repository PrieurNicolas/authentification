const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "authentification",
    password: "440802",
    port: 5432,
});

module.exports = pool;