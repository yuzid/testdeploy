import { requireAuthotp } from "./authMiddleware.js";
import { loginSession } from "./loginSessionMid.js";

export const checkAuth = (req, res, next) => {
    // Call loginSession first and handle the flow
    loginSession(req, res, (err) => {
        if (err) return res.redirect('account/login'); // Redirect if loginSession fails
        
        // If loginSession passes, check requireAuthotp
        requireAuthotp(req, res, (err) => {
            if (err) return res.redirect('account/login'); // Redirect if requireAuthotp fails

            // If both checks pass, proceed to the next middleware/handler
            next();
        });
    });
};