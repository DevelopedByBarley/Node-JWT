const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',    // A MySQL szerver elérési útja
    user: 'Barley',   // A felhasználónév
    password: 'Csak1enter',   // A jelszó
    database: 'szedjuk_egyutt'  // Az adatbázis neve
});

// Kapcsolódás az adatbázishoz
connection.connect((err) => {
    if (err) {
        console.error('Hiba a kapcsolódás során: ' + err.stack);
        return;
    }

    console.log('Sikeresen csatlakozva az adatbázishoz.');
});


module.exports = connection;