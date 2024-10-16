import client from "../../db.js";
import { getShortlinksByEmailPaginated } from "./querries.js";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getShortlinksPaginated = (req, res) => {
  const email = req.params.email;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  console.log(`Fetching page ${page}, limit ${limit}, offset ${offset}`);

  client.query(getShortlinksByEmailPaginated, [email, limit, offset], (error, results) => {
    if (error) {
      console.error("Error executing query", error.stack);
      res.status(500).send("Error fetching data");
    } else {
      const formattedResults = results.rows.map((row) => ({
        ...row,
        time_shortlink_created: formatTimestamp(row.time_shortlink_created),
      }));

      res.status(200).json(formattedResults);
    }
  });
};