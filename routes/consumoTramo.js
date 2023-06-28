const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const ConsumoTramo = require('../models/consumoTramo.js');


// Obtener la lista completa de usuarios
router.get('/', (req, res) => {
  ConsumoTramo.findAll()
    .then((consumoTramo) => {
      res.json(consumoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de Consumo por Tramo' });
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
      res.status(500).json({ error: 'Error al crear un Nuevo Consumo por Tramo' });
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
        res.status(404).json({ error: 'Consumo por Tramo no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de los Consumo por Tramo' });
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
        res.status(404).json({ error: 'Consumo por Tramo no encontrado' });
      }
    })
    .then((updatedConsumoTramo) => {
      res.json(updatedConsumoTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles de los Consumo por Tramo' });
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
        res.status(404).json({ error: 'Consumo por Tramo no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Consumo por Tramo eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar Consumo por Tramo' });
    });
});


// Obtener las historias por tramo para un período de tiempo específico
router.post('/historias', (req, res) => {
  const fechaInicial = req.body.fechaInicial;
  const fechaFinal = req.body.fechaFinal;

  // Verificar si las fechas son válidas
  if (!fechaInicial || !fechaFinal) {
    res.status(400).json({ error: 'Falta la fecha inicial o final' });
    return;
  }

  ConsumoTramo.findAll({
    where: {
      fecha: {
        [Op.between]: [fechaInicial, fechaFinal] // Filtrar por el rango de fechas
      }
    },
    attributes: ['linea', 'fecha', 'residencial', 'comercial', 'industrial'],
  })
    .then((consumoTramos) => {
      const historias = consumoTramos.map((consumoTramo) => {
        const consumo = consumoTramo.residencial + consumoTramo.comercial + consumoTramo.industrial;
        const perdidas = consumo * 0.1; // Supongamos una tasa de pérdida del 10%
        const costo = consumo * 0.15; // Supongamos un costo de consumo de $0.15 por unidad

        return {
          linea: consumoTramo.linea,
          fecha: consumoTramo.fecha,
          consumo,
          perdidas,
          costo,
        };
      });

      res.json(historias);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener las historias por tramo' });
    });
});




module.exports = router;
