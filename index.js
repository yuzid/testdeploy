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

// Enable detailed error logging
const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query
    });
    
    res.status(500).json({
        error: err.message || 'Something went wrong!',
        path: req.path,
        timestamp: new Date().toISOString()
    });
};

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for Vercel
app.use(session({
    secret: process.env.SESSION_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// Test route to verify basic functionality
app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'Test endpoint working' });
});

// Static files with error handling
app.use('/assets', (req, res, next) => {
    express.static(path.join(__dirname, 'src', 'views', 'assets'))(req, res, err => {
        if (err) {
            console.error('Static file error:', err);
            next(err);
        }
    });
});

// Routes with try-catch
app.use('/shortlink', (req, res, next) => {
    try {
        routerShortlink(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.use('/account', (req, res, next) => {
    try {
        routerAccount(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.use('/qr', (req, res, next) => {
    try {
        routerQr(req, res, next);
    } catch (err) {
        next(err);
    }
});

app.use('/linktree', (req, res, next) => {
    try {
        routerLinktree(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Root route with error handling
app.get('/', async (req, res, next) => {
    try {
        if (typeof checkAuth !== 'function') {
            throw new Error('checkAuth middleware is not a function');
        }
        await new Promise((resolve, reject) => {
            checkAuth(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
    } catch (err) {
        next(err);
    }
});

// Shortlink redirect with error handling
app.get('/:id', async (req, res, next) => {
    try {
        await shortlinkController.firstRedirect(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Error handler middleware should be last
app.use(errorHandler);

// Only start server if not in production
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}

export default app;