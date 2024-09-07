import express from 'express';
const app = express();
const PORT = 8080;

app.listen(PORT, ()=>
    console.log("Running at ", {PORT})
)

app.get("/:id", (req, res) => {
    let url = "https://youtube.com/watch?v="
    res.redirect(301, url.concat(req.params.id))
})
