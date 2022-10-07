const Pool = require("pg").Pool;

export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "authentification",
    password: "440802",
    port: 5432,
});

export const DBlogs = {
    dialect: "postgres",
    user: "postgres",
    host: "localhost",
    database: "authentification",
    password: "b",
    port: 5432,
}

//module.exports = {pool,DBlogs};