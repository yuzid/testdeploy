import express from "express";
import shortlinkController from "./src/controllers/shortlinkController.js";
import routerShortlink from './src/routes/shortlink.js';
import accountController from "./src/controllers/accountController.js";
import routerAccount from "./src/routes/account.js";
import path from 'path';
import { __dirname } from "./path.js";

const PORT = 8000;
const app = express();

app.use(express.json());

app.use('/shortlink', routerShortlink);

app.use('/assets', express.static(path.join(__dirname, 'src', 'views', 'assets')));

app.use('/account', routerAccount);

app.listen(PORT, () => {
    console.log(`Server utama running at port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
})

app.get('/:id', shortlinkController.firstRedirect);



