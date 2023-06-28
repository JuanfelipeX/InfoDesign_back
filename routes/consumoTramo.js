const express = require('express');
const router = express.Router();
const ConsumoTramo = require('../models/consumoTramo.js');


// Obtener la lista completa de usuarios
router.get('/', (req, res) => {
  ConsumoTramo.findAll()
    .then((consumoTramo) => {
      res.json(consumoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de las Peliculas' });
    });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const { title, resume, director, publication_date } = req.body;

  ConsumoTramo.create({ title, resume, director, publication_date })
    .then((consumoTramo) => {
      res.json(consumoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al crear una nueva Pelicula' });
    });
});


// Obtener los detalles de un usuario específico
router.get('/:id', (req, res) => {
  const consumoTramoId = req.params.id;

  ConsumoTramo.findByPk(consumoTramoId)
    .then((consumoTramo) => {
      if (consumoTramo) {
        res.json(consumoTramo);
      } else {
        res.status(404).json({ error: 'Pelicula no encontrada' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de la Pelicula' });
    });
});

// Actualizar los detalles de un usuario específico
router.put('/:id', (req, res) => {
  const consumoTramoId = req.params.id;
  const { title, resume, director, publication_date } = req.body;

  ConsumoTramo.findByPk(consumoTramoId)
    .then((consumoTramo) => {
      if (consumoTramo) {
        consumoTramo.title = title;
        consumoTramo.resume = resume;
        consumoTramo.director = director;
        consumoTramo.publication_date = publication_date;
        return consumoTramo.save();
      } else {
        res.status(404).json({ error: 'Pelicula no encontrado' });
      }
    })
    .then((updatedConsumoTramo) => {
      res.json(updatedConsumoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles de la Pelicula' });
    });
});

// Eliminar un usuario específico
router.delete('/:id', (req, res) => {
  const consumoTramoId = req.params.id;

  ConsumoTramo.findByPk(consumoTramoId)
    .then((consumoTramo) => {
      if (consumoTramo) {
        return consumoTramo.destroy();
      } else {
        res.status(404).json({ error: 'Pelicula no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Pelicula eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar la pelicula' });
    });
});




module.exports = router;
