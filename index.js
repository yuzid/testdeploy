import express from "express";
import shortlinkController from "./src/controllers/shortlinkController.js";
import routerShortlink from './src/routes/shortlink.js';
const PORT = 8000;
const app = express();

app.use(express.json());

app.use('/shortlink', routerShortlink);

app.listen(PORT, () => {
    console.log(`Server utama running at port ${PORT}`);
});

app.get('/', () => {
    //render smthng
})

app.get('/:id', shortlinkController.firstRedirect);



