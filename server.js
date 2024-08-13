const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route to get notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// Route to save a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      newNote.id = notes.length ? notes[notes.length - 1].id + 1 : 1;  // Assign an ID
      notes.push(newNote);
      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
          if (err) throw err;
          res.json(newNote);
      });
  });
});

// Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const filteredNotes = notes.filter(note => note.id !== noteId);
      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filteredNotes), (err) => {
          if (err) throw err;
          res.json({ message: 'Note deleted' });
      });
  });
});
