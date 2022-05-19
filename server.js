const express = require('express');
const { notes } = require('./db/db.json');
const fs = require('fs');
const path = require('path');

// instantiate the server
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: true })); // parse incoming string or array data
app.use(express.json()); // parse incoming json data

// takes in id and array of notes and returns single note object
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id);
    return result;
}

// takes in req.body and array and returns new note obj
function createNewNote(body, notesArray) {
    console.log(body);
    const note = body;
    notesArray.push(note);
    // write new note to json file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    // return finished code to post route for response
    return note;
};

// testing connection - WORKING
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World Note Taken App'
    });
});

// GET all notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// GET note by id
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content is
    req.body.id = notes.length.toString(); // give new note an id based on length of current array

    const note = createNewNote(req.body, notes);
    res.json(note);
})

// Catchall 
app.use((req, res) => {
    res.status(404).end();
});

// chain listen method to server
app.listen(PORT, () => {
    console.log(`API server is now on port ${PORT}!`);
});