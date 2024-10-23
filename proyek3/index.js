import express from 'express';
import cors from 'cors';
import shortlinkRoutes from './src/a/routes.js';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://127.0.0.1:5500' // Izinkan request dari frontend di port ini
}));

app.use(express.json());
app.use('/shortlinks', shortlinkRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});