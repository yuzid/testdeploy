import express from "express";
import session from "express-session";
import shortlinkController from "./src/controllers/shortlinkController.js";
import routerShortlink from './src/routes/shortlink.js';
import routerAccount from "./src/routes/account.js";
import routerQr from "./src/routes/qrRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { checkAuth } from "./src/middleware/checkAuth.js";
import routerLinktree from "./src/routes/linktree.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Enable trust proxy for Vercel
app.set('trust proxy', 1);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'src', 'views', 'assets')));

// Routes
app.use('/shortlink', routerShortlink);
app.use('/account', routerAccount);
app.use('/qr', routerQr);
app.use('/linktree', routerLinktree);

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Root route
app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

// Shortlink redirect
app.get('/:id', shortlinkController.firstRedirect);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Only listen if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}

export default app;