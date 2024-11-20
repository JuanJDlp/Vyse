const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres.tqbpfbhngorvqgfaficw',
    password: 'VyseStore123!',
    host: 'aws-0-us-west-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
});

module.exports = {
    pool: pool
};
