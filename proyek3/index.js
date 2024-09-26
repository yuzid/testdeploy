import express from "express";
import aRoutes from "./src/a/routes.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Welcome!");
});

app.use("/api/v1/a", aRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

