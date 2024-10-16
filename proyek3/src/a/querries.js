export const getShortlinksByEmailPaginated = `
  SELECT short_url, long_url, time_shortlink_created
  FROM shortlinks
  WHERE email = $1
  ORDER BY time_shortlink_created DESC
  LIMIT $2 OFFSET $3;
`;