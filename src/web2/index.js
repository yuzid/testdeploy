import express from 'express';
const app = express();
import pg from 'pg';
const PORT = 8080;

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SL',
    password: 'NeaRzro2206!',
    port: 5432,
  });


app.listen(PORT, ()=>
    console.log("Running at ", {PORT})
)

app.get('/sl/:id', async (req,res) => {
    try{
        const result = await pool.query(`SELECT long_url FROM shortlink WHERE id_shortlink = $1`, [req.params.id]);
        res.redirect(301, result.rows[0]['long_url']);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

app.get("/:id", (req, res) => {
    let url = "https://youtube.com/watch?v="
    res.redirect(301, url.concat(req.params.id))
})
