// global require.
const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

// set up express port.
var app = express();
var PORT = process.env.PORT || 3000;

// link to public folder.
app.use(express.static('public'));

// link to json and urlencoded.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get the index.html.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// notes html and it's "url".
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// api route.
app.route("/api/notes")
    // grab the notes list.
    .get(function (req, res) {
        res.json(database);
    })

    // add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // this allows the test note to be the original note.
        let highestId = 99;
        // this loops through the array and finds the highest ID.
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = individualNote.id;
            }
        }
        // this assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // push it to db.json.
        database.push(newNote)

        // write the db.json file.
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // gives back the response, which is the user's new note. 
        res.json(newNote);
    });

// delete note base on id
app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    // request to delete note by id.
    for (let i = 0; i < database.length; i++) {
        if (database[i].id == req.params.id) {
            // splice takes i position, and then deletes the 1 note.
            database.splice(i, 1);
            break;
        }
    }
    // write the db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});

// listen to port.
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});