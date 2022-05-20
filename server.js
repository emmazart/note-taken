const express = require('express');
const { notes } = require('./db/db.json');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // package for unique id
const store = require('./db/store'); // import helper class

// instantiate the server
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: true })); // parse incoming string or array data
app.use(express.json()); // parse incoming json data
app.use(express.static('public')); // serve static files

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
    const result = store.findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});

// POST a new note
app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content is
    req.body.id = uuidv4(); // give new note id from uuid module

    const note = store.createNewNote(req.body, notes);
    res.json(note);
})

// DELETE a note by id
app.delete('/api/notes/:id', (req, res) => {
    // find index of corresponding note object
    const index = store.findNote(req.params.id, notes);
    // if it exists
    if (index >= 0) {
        store.deleteNote(index, notes);
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