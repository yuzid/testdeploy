import express from 'express';
const app = express();
import bcrypt from 'bcrypt'
import cryptoRandomString from 'crypto-random-string';
const PORT = 8000;

app.use(express.json())

app.listen(PORT, ()=>
    console.log("Running at ", {PORT})
)

app.get('/:id', (req, res) => {
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

app.get('/login/test', async (req,res) => {
    const {body} = req
    let hashed = await bcrypt.hash("Password123", 10) //ganti dengan ambil hash dari db
    
    if (await bcrypt.compare(body.password, hashed)){
        res.send(200, {
            msg: "Login berhasil"
        })
    }
    else{
        res.send(200, {
            msg: "Login gagal"
        })
    }
})