import client from "../../db.js";
import { getA } from "./querries.js";
import { getAById } from "./querries.js";

export const getAData = (req, res) => {
    client.query(getA, (error, results) => {
        if (error) {
            console.error("Error executing query", error.stack);
            res.status(500).send("Error fetching data");
        } else {
            res.status(200).json(results.rows);
        }
    });
};

export const getADataById = (req, res) => {
    const id = parseInt(req.params.id);
  
    client.query(getAById, [id], (error, results) => {
      if (error) {
        console.error("Error executing query", error.stack);
        res.status(500).send("Error fetching data");
      } else {
        res.status(200).json(results.rows);
      }
    });
};