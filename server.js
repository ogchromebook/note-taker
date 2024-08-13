const express = require("express"); // Import the express module
const fs = require("fs"); // Import the file system module
const path = require("path"); // Import the path module

const app = express(); // Initialize an Express application
const PORT = process.env.PORT || 3001; // Set the port for the server, defaulting to 3001 if not provided

// Middleware to parse JSON and URL-encoded data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the "public" directory

// Route to get all notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err; // Handle errors during file reading
    res.json(JSON.parse(data)); // Send the parsed JSON data as a response
  });
});

// Route to save a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body; // Get the new note from the request body
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err; // Handle errors during file reading
    const notes = JSON.parse(data); // Parse the existing notes
    newNote.id = notes.length ? notes[notes.length - 1].id + 1 : 1; // Assign a new ID to the note
    notes.push(newNote); // Add the new note to the array of notes
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(notes), // Convert the notes array back to a JSON string
      (err) => {
        if (err) throw err; // Handle errors during file writing
        res.json(newNote); // Send the newly created note as a response
      }
    );
  });
});

// Route to delete a note
app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id); // Get the ID of the note to delete from the URL parameters
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err; // Handle errors during file reading
    const notes = JSON.parse(data); // Parse the existing notes
    const filteredNotes = notes.filter((note) => note.id !== noteId); // Filter out the note with the matching ID
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(filteredNotes), // Convert the filtered notes array back to a JSON string
      (err) => {
        if (err) throw err; // Handle errors during file writing
        res.json({ message: "Note deleted" }); // Send a response indicating the note was deleted
      }
    );
  });
});

// Route to serve the notes HTML file
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html")); // Serve the notes HTML page
});

// Default route to serve the index HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html")); // Serve the index HTML page for all other routes
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});
