require("dotenv").config();

const express = require("express");
const http = require("http");
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const { sql: dsql } = require("drizzle-orm");

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);
const app = express();

const requestHandler = async (_req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

app.get("/drizzle", async (_req, res) => {
  const result = await db.execute(dsql`SELECT version()`);
  const version = result.rows?.[0]?.version ?? "Unknown version";
  res.status(200).type("text/plain").send(version);
});

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
