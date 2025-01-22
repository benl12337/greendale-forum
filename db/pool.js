const { Pool } = require("pg");

console.log('the  database conenction is', process.env.DATABASE_URL);

module.exports = new Pool({
    connectionString: process.env.DB_URL,
});