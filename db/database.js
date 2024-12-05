const sqlite3 = require('sqlite3').verbose();

// Abre la base de datos (se crea automáticamente si no existe)
const db = new sqlite3.Database('./consultorio.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

// Crear las tablas si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER NOT NULL,
      direccion TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS historial (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER,
      fecha TEXT NOT NULL,
      descripcion TEXT,
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS medicamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER,
      nombre TEXT NOT NULL,
      dosis TEXT,
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    )
  `);
});

module.exports = db;
