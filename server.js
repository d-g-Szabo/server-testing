// import my packages
// const express = require('express'); // common js dialect
import express from "express"; // ES6 dialect
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

// Package configuration

// Express conmfiguration
const app = express();
app.use(express.json());

// Cors configuration
app.use(cors());

// dotenv configuration
dotenv.config();

// pg configuration
// connection string --> we store it in the .env file / the value is in the Supabase website connect section
const dbconnectionString = process.env.DATABASE_URL;
// set up a pool
const db = new pg.Pool({ connectionString: dbconnectionString });

// Set up the server PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Endpoint for the root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

// GET endpoint from one table
app.get("/posts", async (req, res) => {
  const result = await db.query("SELECT title, content FROM posts");
  res.json(result.rows);
});

// GET endpoint from two tables
app.get("/postCategory", async (req, res) => {
  const result = await db.query(
    "SELECT posts.title, posts.content, categories.name FROM posts JOIN categories ON posts.category_id = categories.id"
  );
  res.json(result.rows);
});

// POST endpoint
app.post("/newPost", async (req, res) => {
  const { title, content, category_id } = req.body;
  const result = await db.query(
    "INSERT INTO posts (title, content, category_id) VALUES ($1, $2, $3)",
    [title, content, category_id]
  );
});
