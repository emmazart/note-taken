const express = require('express');
const { notes } = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

// instantiate the server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming json data
app.use(express.json());