import express from 'express';
const app = express();
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
import baseX from 'base-x'
const bs62 = baseX(BASE62);
import crypto from 'crypto'
const PORT = 8000;

app.use(express.json())

app.listen(PORT, ()=>
    console.log("Running at ", {PORT})
)

app.get('/:id', (req, res) => {
    const {body} = req
    
    res.redirect(301, body.url)
})

app.get('/idRand', (res) => {
    res.send(200, {
        id: bs62.randomBase62String(4, 4)
    })
});

app.get('/sl/:id', (req, res) => {
    let url = "http://localhost:8080/"
    res.redirect(301, url.concat(req.params.id))
} )

function randomBase62String(length, byteAmount){
    return bs62.encode(crypto.randomBytes(byteAmount)).slice(0,length)
}