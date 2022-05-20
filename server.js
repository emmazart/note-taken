const express = require('express');
const { notes } = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // package for unique id

// instantiate the server
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: true })); // parse incoming string or array data
app.use(express.json()); // parse incoming json data
app.use(express.static('public')); // serve static files

// function takes in id and array of notes and returns single note object
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id);
    return result;
}

// function takes in req.body and array and returns new note obj
function createNewNote(body, notesArray) {
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

// function declaration find index of a note based on UUID
function findNote(id, notesArray) {
    const isId = (note) => note.id == id; // check to see if note.id equals passed id
    const noteIndex = notesArray.findIndex(isId); // returns the index of the note when isId is true
    return noteIndex;
}

// function declaration to delete note based on index
function deleteNote(index, notesArray){
    notesArray.splice(index, 1);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    // do we need to return anything?
}

// // testing connection - WORKING
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World Note Taken App'
//     });
// });

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

// POST a new note
app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content is
    // req.body.id = notes.length.toString(); // give new note an id based on length of current array
    req.body.id = uuidv4(); // give new note id from uuid module

    const note = createNewNote(req.body, notes);
    res.json(note);
})

// DELETE a note by id
app.delete('/api/notes/:id', (req, res) => {
    // find index of corresponding note object
    const index = findNote(req.params.id, notes);
    // if it exists
    if (index) {
        deleteNote(index, notes);
        res.json({
            message: 'DELETED',
            data: req.params.id
        });
    } else {
        res.sendStatus(404);
    }
});

// SERVE up index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// SERVE up notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Catchall 
app.use((req, res) => {
    res.status(404).end();
});

// chain LISTEN method to server
app.listen(PORT, () => {
    console.log(`API server is now on port ${PORT}!`);
});