import { requireAuthotp } from "./authMiddleware.js";
import { loginSession } from "./loginSessionMid.js";

export const checkAuth = (req, res, next) => {
    // Check loginSession first
    loginSession(req, res, (err) => {
        if (!err) {
          // If loginSession passes, continue
          return next();
        }
        // If loginSession fails, try requireAuthotp
        requireAuthotp(req, res, next);
      });
    };
