const { Pool } = require("pg");

console.log('the  database conenction is', process.env.DB_URL);

module.exports = new Pool({
    connectionString: process.env.DB_URL,
});