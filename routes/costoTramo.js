const express = require('express');
const router = express.Router();
const CostoTramo = require('../models/costoTramo.js');


// Obtener la lista completa de usuarios
router.get('/', (req, res) => {
  CostoTramo.findAll()
    .then((costoTramo) => {
      res.json(costoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de Costo por Tramo' });
    });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const { title, resume, director, publication_date } = req.body;

  CostoTramo.create({ title, resume, director, publication_date })
    .then((costoTramo) => {
      res.json(costoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al crear un Nuevo Costo por Tramo' });
    });
});


// Obtener los detalles de un usuario específico
router.get('/:id', (req, res) => {
  const costoTramoId = req.params.id;

  CostoTramo.findByPk(costoTramoId)
    .then((costoTramo) => {
      if (costoTramo) {
        res.json(costoTramo);
      } else {
        res.status(404).json({ error: 'Costo por Tramo no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de los Costo por Tramo' });
    });
});

// Actualizar los detalles de un usuario específico
router.put('/:id', (req, res) => {
  const costoTramoId = req.params.id;
  const { title, resume, director, publication_date } = req.body;

  CostoTramo.findByPk(costoTramoId)
    .then((costoTramo) => {
      if (costoTramo) {
        costoTramo.title = title;
        costoTramo.resume = resume;
        costoTramo.director = director;
        costoTramo.publication_date = publication_date;
        return costoTramo.save();
      } else {
        res.status(404).json({ error: 'Costo por Tramo no encontrado' });
      }
    })
    .then((updatedCostoTramo) => {
      res.json(updatedCostoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles de los Costo por Tramo' });
    });
});

// Eliminar un usuario específico
router.delete('/:id', (req, res) => {
  const costoTramoId = req.params.id;

  CostoTramo.findByPk(costoTramoId)
    .then((costoTramo) => {
      if (costoTramo) {
        return costoTramo.destroy();
      } else {
        res.status(404).json({ error: 'Costo por Tramo no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Costo por Tramo eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar Costo por Tramo' });
    });
});




module.exports = router;
