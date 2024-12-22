const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 4000;

const supabaseUrl = "https://vvkcbgygwuvtiuhfnesc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2a2NiZ3lnd3V2dGl1aGZuZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MzcxOTAsImV4cCI6MjA1MDExMzE5MH0.F4ToOAuBByy6lge9lAsOXbRsjqqqcmUvgwVXxdO0nnY";

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors({
  origin: "*", // Allow all origins (use specific origins for security in production)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow credentials such as cookies and headers
}));
app.use(bodyParser.json());

// Fetch all students
app.get("/students", async (req, res) => {
  try {
    const { data, error } = await supabase.from("students").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Add a new stude
app.post("/students", async (req, res) => {
    try {
      console.log("Received payload:", req.body);
      const { data, error } = await supabase
        .from("students")
        .insert([req.body])
        .select("*"); // Ensures the inserted row is returned
      if (error) throw error;
  
      if (!data) {
        return res.status(500).json({ error: "Insert succeeded but no data returned." });
      }
  
      res.json(data[0]);
    } catch (error) {
      console.error("Error adding student:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
// Update a student
// app.put("/students/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { data, error } = await supabase
//       .from("students")
//       .update(req.body)
//       .eq("id", id);
//     if (error) throw error;
//     res.json(data[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.put("/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating student with ID:", id, "Payload:", req.body);
  
      const { data, error } = await supabase
        .from("students")
        .update(req.body)
        .eq("id", id)
        .select("*"); // Ensures the updated row is returned
  
      if (error) throw error;
  
      if (!data || data.length === 0) {
        return res.status(404).json({ error: "No rows updated. Check if the student ID exists." });
      }
  
      res.json(data[0]);
    } catch (error) {
      console.error("Error updating student:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

// Delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
