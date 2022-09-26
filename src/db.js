require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port:  process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false
    }        
  }
});

module.exports = knex;