import express, { json } from 'express';
const app = express();
import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';
import pg from 'pg';
const PORT = 8000;

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SL',
    password: 'NeaRzro2206!',
    port: 5432,
  });
  

app.use(json())

app.listen(PORT, ()=>
    console.log("Running at ", {PORT})
)


app.post('/a/activation', async (req, res) =>{
    const {body} = req;
    let hashed = await bcrypt.hash(body.password, 11);
    pool.query(`INSERT INTO account (email, password) values ('${body.email}', '${hashed}')`);
    res.status(200).send({
        msg: 'berhasil'
    });
})

app.get('/login', async (req,res) => {
    const {body} = req;
    const client = pool.connect();
    let result = await (await client).query(`SELECT password FROM account WHERE email = '${body.email}'`);
    (await client).end();
    console.log(await bcrypt.compare(body.password, result.rows[0]['password']));
    console.log(result.rows[0]['password'])
    if (await bcrypt.compare(body.password, result.rows[0]['password'])){
        res.send(200, {
            msg: "Login berhasil"
        });
    }
    else{
        res.send(200, {
            msg: "Login gagal"
        });
    }
})

app.get('/:id', async (req,res) => {
    try{
        const result = await pool.query(`SELECT id_shortlink FROM shortlink WHERE short_url = $1`, [req.params.id]);
        res.redirect(301, `http://localhost:8080/sl/${result.rows[0]['id_shortlink']}`);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

app.post('/create/shortlink', async (req,res) => {
    try{
        const {body} =  req;
        if (! await isCustomUnique(body.custom)){
            res.status(404).send({
                msg: "custom sudah ada"
            });
        }
        else{
            const id = await uniqueRandomID();
            await pool.query(`INSERT INTO shortlink (id_shortlink, long_url, short_url, email, time_created) VALUES ($1, $2, $3, $4, now()::timestamp)`, [id, body.destination, body.custom, body.email]);
            res.status(200).send({
                msg:"selesai"
            })
        }
    }
    catch(err){
        res.status(500).send('Server error')
    }
});

async function isIDunique(id){
    const result = await pool.query(`SELECT EXISTS(SELECT 1 FROM shortlink WHERE id_shortlink = $1)`, [id]);
    return !result.rows[0]['exists'];
}

async function isCustomUnique(custom){
    const result = await pool.query(`SELECT EXISTS(SELECT 1 FROM shortlink WHERE short_url = $1)`, [custom]);
    return !result.rows[0]['exists'];
}

async function uniqueRandomID(){
    let id;
    while (true){
        id = cryptoRandomString({length: 4, type:'alphanumeric'});
        if (await isIDunique(id)){
            break;
        }
    }
    return id;
}

//test function

app.get('/t/:id', async (req,res) => {
    const result = await isIDunique(req.params.id);
    console.log(result)
    if (!result){
        res.status(200).send({
            msg:"Tidak Ada"
        })
    }
    else{
        res.status(404).send({
            msg: "Ada"
        })
    }
})

app.get('/redirect/:id', (req, res) => {
    const {body} = req
    
    res.redirect(301, body.url)
})

app.get('/idRand/rand', (req, res) => {
    res.send(200,{
        id: cryptoRandomString({length: 4, type: 'alphanumeric'})
    })
});

app.get('/sl/:id', (req, res) => {
    let url = "http://localhost:8080/"
    res.redirect(301, url.concat(req.params.id))
} )

app.get('/hash/:pass', async (req,res) => {
    let hashed = await bcrypt.hash(req.params.pass, 10)
    res.send(200,{
        id: hashed
    })
})

app.get('/hash/time/test', async (req, res) => {
    let timeStart, timeEnd, timeSum = 0, timeAvg
    for (let i = 0; i < 50; i++){
        timeStart = performance.now()
        let hashed = await bcrypt.hash(cryptoRandomString({length: 16, type: 'ascii-printable'}), 10)
        timeEnd = performance.now()
        timeSum += timeEnd - timeStart
    }
    timeAvg = timeSum/50
    res.send(200,{
        sum: timeSum,
        avg: timeAvg
    })
})
