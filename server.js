const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

const db = new sqlite3.Database("./skills.db");

db.run(`
    CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`);


// CREATE
app.post("/api/skills", function(req, res) {

    const name = req.body.name;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            error: "Skill invalid"
        });
    }

    db.run(
        "INSERT INTO skills(name) VALUES (?)",
        [name.trim()],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: "Database error"
                });
            }

            res.status(201).json({
                id: this.lastID,
                name: name.trim()
            });
        }
    );
});


// READ
app.get("/api/skills", function(req, res) {

    db.all(
        "SELECT * FROM skills",
        [],
        function(error, rows) {

            if (error) {
                return res.status(500).json({
                    error: "Database error"
                });
            }

            res.status(200).json(rows);
        }
    );
});


// UPDATE
app.put("/api/skills/:id", function(req, res) {

    const id = req.params.id;
    const name = req.body.name;

    if (!name || name.trim().length < 2) {
        return res.status(400).json({
            error: "Skill invalid"
        });
    }

    db.run(
        "UPDATE skills SET name = ? WHERE id = ?",
        [name.trim(), id],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: "Database error"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Skill not found"
                });
            }

            res.status(200).json({
                id: Number(id),
                name: name.trim()
            });
        }
    );
});


// DELETE
app.delete("/api/skills/:id", function(req, res) {

    const id = req.params.id;

    db.run(
        "DELETE FROM skills WHERE id = ?",
        [id],
        function(error) {

            if (error) {
                return res.status(500).json({
                    error: "Database error"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Skill not found"
                });
            }

            res.status(204).send();
        }
    );
});


app.listen(PORT, function() {

    console.log(
        "Server running on http://localhost:3000"
    );
});