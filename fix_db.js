const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.serialize(() => {
    db.run("ALTER TABLE posts ADD COLUMN image_url TEXT", (err) => {
        if (err) console.log("Alter table error:", err.message);
        else console.log("Added image_url column.");
    });
    db.all("PRAGMA table_info(posts)", (err, rows) => {
        console.log("Table info:", rows);
    });
});
