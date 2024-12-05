const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./consultorio.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

// Crear tablas si no existen
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

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para agregar paciente
app.post('/agregarPaciente', (req, res) => {
  const { nombre, edad, direccion } = req.body;
  db.run(`INSERT INTO pacientes (nombre, edad, direccion) VALUES (?, ?, ?)`, [nombre, edad, direccion], (err) => {
    if (err) {
      console.error('Error al agregar paciente:', err.message);
      res.status(500).send('Error al agregar paciente');
    } else {
      res.send('Paciente agregado correctamente');
    }
  });
});

// Ruta para agregar historial médico
app.post('/agregarHistorial', (req, res) => {
  const { paciente_id, fecha, descripcion } = req.body;
  db.run(`INSERT INTO historial (paciente_id, fecha, descripcion) VALUES (?, ?, ?)`, [paciente_id, fecha, descripcion], (err) => {
    if (err) {
      console.error('Error al agregar historial:', err.message);
      res.status(500).send('Error al agregar historial');
    } else {
      res.send('Historial agregado correctamente');
    }
  });
});

// Ruta para agregar medicamento
app.post('/agregarMedicamento', (req, res) => {
  const { paciente_id, nombre, dosis } = req.body;
  db.run(`INSERT INTO medicamentos (paciente_id, nombre, dosis) VALUES (?, ?, ?)`, [paciente_id, nombre, dosis], (err) => {
    if (err) {
      console.error('Error al agregar medicamento:', err.message);
      res.status(500).send('Error al agregar medicamento');
    } else {
      res.send('Medicamento agregado correctamente');
    }
  });
});

// Ruta para obtener pacientes
app.get('/pacientes', (req, res) => {
  db.all('SELECT * FROM pacientes', (err, rows) => {
    if (err) {
      console.error('Error al obtener pacientes:', err.message);
      res.status(500).send('Error al obtener pacientes');
    } else {
      res.json(rows);
    }
  });
});

// Ruta para obtener historial de un paciente
app.get('/historial/:paciente_id', (req, res) => {
  const paciente_id = req.params.paciente_id;
  db.all(`SELECT * FROM historial WHERE paciente_id = ?`, [paciente_id], (err, rows) => {
    if (err) {
      console.error('Error al obtener historial:', err.message);
      res.status(500).send('Error al obtener historial');
    } else {
      res.json(rows);
    }
  });
});

// Ruta para obtener medicamentos de un paciente
app.get('/medicamentos/:paciente_id', (req, res) => {
  const paciente_id = req.params.paciente_id;
  db.all(`SELECT * FROM medicamentos WHERE paciente_id = ?`, [paciente_id], (err, rows) => {
    if (err) {
      console.error('Error al obtener medicamentos:', err.message);
      res.status(500).send('Error al obtener medicamentos');
    } else {
      res.json(rows);
    }
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
