# note-taken

db.json stores note data as json
application will use this file via the fs module to store and retrieve notes

2 html routes
GET /notes returns notes.html
GET* returns index.html

API routes
GET /api/notes reads db.json file and return all saves notes as json

POST /api/notes receives a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

DELETE /api/notes/:id receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

dependencies: uuid [(docs)](https://github.com/uuidjs/uuid), express, 

start: npm start 

[Link to deployed application via Heroku](https://emmazart-note-taken.herokuapp.com/notes)