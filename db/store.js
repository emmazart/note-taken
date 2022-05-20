const fs = require('fs');
const path = require('path');

class Store {

    // function takes in id and array of notes and returns single note object
    findById(id, notesArray) {
        const result = notesArray.filter(note => note.id === id);
        return result;
    }

    // function takes in req.body and array and returns new note obj
    createNewNote(body, notesArray) {
        const note = body;
        notesArray.push(note);
        // write new note to json file
        fs.writeFileSync(
            path.join(__dirname, './db.json'),
            JSON.stringify({ notes: notesArray }, null, 2)
        );
        // return finished code to post route for response
        return note;
    };

    // function declaration find index of a note based on UUID
    findNote(id, notesArray) {
        const isId = (note) => note.id == id; // check to see if note.id equals passed id
        const noteIndex = notesArray.findIndex(isId); // returns the index of the note when isId is true
        return noteIndex;
    }

    // function declaration to delete note based on index
    deleteNote(index, notesArray){
        notesArray.splice(index, 1);
        fs.writeFileSync(
            path.join(__dirname, './db.json'),
            JSON.stringify({ notes: notesArray }, null, 2)
        );
        // do we need to return anything?
    }

};

module.exports = new Store();