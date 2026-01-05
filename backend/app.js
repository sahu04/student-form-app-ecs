const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId VARCHAR(50),
    name VARCHAR(100),
    age INT,
    class VARCHAR(50)
  )
`);

// Save student
app.post("/students", (req, res) => {
  const { studentId, name, age, class: className } = req.body;

  db.query(
    "INSERT INTO students (studentId, name, age, class) VALUES (?, ?, ?, ?)",
    [studentId, name, age, className],
    () => res.json({ message: "Student saved successfully" })
  );
});

// Get students
app.get("/students", (req, res) => {
  db.query("SELECT studentId, name, age, class FROM students", (err, results) => {
    res.json(results);
  });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
