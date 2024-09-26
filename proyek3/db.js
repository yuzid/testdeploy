import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'a',
    password: 'harada30',
    port: 5432,
});

client.connect();

export default client;
