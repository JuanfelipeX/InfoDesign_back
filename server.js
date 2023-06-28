const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const consumoTramoRouter = require('./routes/consumoTramo.js');
const costoTramoRouter = require('./routes/costoTramo.js');

app.use('/consumoTramo', consumoTramoRouter);
app.use('/costoTramo', costoTramoRouter);


// Configura la ruta para obtener la lista de usuarios
consumoTramoRouter.get('/', (req, res) => {
  // Lógica para obtener la lista de usuarios
  res.send('Obtener la lista de usuarios');
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prueba_designinfo',
  password: '1234',
  port: 5432,
});

// Prueba de conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a la base de datos:', err);
  }
  console.log('Conexión exitosa a la base de datos');
  release();
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
