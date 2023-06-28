const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Tramo = require('../models/Tramo.js');


// Obtener la lista completa de usuarios
router.get('/', (req, res) => {
  Tramo.findAll()
    .then((tramo) => {
      res.json(tramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de Tramo' });
    });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const { title, resume, director, publication_date } = req.body;

  Tramo.create({ title, resume, director, publication_date })
    .then((tramo) => {
      res.json(tramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al crear un Nuevo Tramo' });
    });
});


// Obtener los detalles de un usuario específico
router.get('/:id', (req, res) => {
  const tramodId = req.params.id;

  Tramo.findByPk(tramodId)
    .then((tramo) => {
      if (tramo) {
        res.json(tramo);
      } else {
        res.status(404).json({ error: 'Tramo no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles de Tramo' });
    });
});

// Actualizar los detalles de un usuario específico
router.put('/:id', (req, res) => {
  const tramodId = req.params.id;
  const { title, resume, director, publication_date } = req.body;

  Tramo.findByPk(tramodId)
    .then((tramo) => {
      if (tramo) {
        tramo.title = title;
        tramo.resume = resume;
        tramo.director = director;
        tramo.publication_date = publication_date;
        return tramo.save();
      } else {
        res.status(404).json({ error: 'Tramo no encontrado' });
      }
    })
    .then((updatedTramo) => {
      res.json(updatedTramo);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles de Tramo' });
    });
});

// Eliminar un usuario específico
router.delete('/:id', (req, res) => {
  const tramodId = req.params.id;

  Tramo.findByPk(tramodId)
    .then((tramo) => {
      if (tramo) {
        return tramo.destroy();
      } else {
        res.status(404).json({ error: 'Tramo no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Tramo eliminada correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar Tramo' });
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


// Obtener el histórico de consumos por cliente (residencial, comercial, industrial) para un período de tiempo específico
router.post('/historico-cliente', (req, res) => {
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
    attributes: ['linea', 'residencial', 'comercial', 'industrial'],
  })
    .then((consumoTramos) => {
      const historicoCliente = {
        residencial: { tramos: [], consumoTotal: 0, perdidasTotal: 0, costoTotal: 0 },
        comercial: { tramos: [], consumoTotal: 0, perdidasTotal: 0, costoTotal: 0 },
        industrial: { tramos: [], consumoTotal: 0, perdidasTotal: 0, costoTotal: 0 }
      };

      consumoTramos.forEach((consumoTramo) => {
        const consumo = consumoTramo.residencial + consumoTramo.comercial + consumoTramo.industrial;
        const perdidas = consumo * 0.1; // Supongamos una tasa de pérdida del 10%
        const costo = consumo * 0.15; // Supongamos un costo de consumo de $0.15 por unidad

        historicoCliente.residencial.tramos.push({
          tramo: consumoTramo.linea,
          consumo,
          perdidas,
          costo
        });
        historicoCliente.residencial.consumoTotal += consumo;
        historicoCliente.residencial.perdidasTotal += perdidas;
        historicoCliente.residencial.costoTotal += costo;

        historicoCliente.comercial.tramos.push({
          tramo: consumoTramo.linea,
          consumo,
          perdidas,
          costo
        });
        historicoCliente.comercial.consumoTotal += consumo;
        historicoCliente.comercial.perdidasTotal += perdidas;
        historicoCliente.comercial.costoTotal += costo;

        historicoCliente.industrial.tramos.push({
          tramo: consumoTramo.linea,
          consumo,
          perdidas,
          costo
        });
        historicoCliente.industrial.consumoTotal += consumo;
        historicoCliente.industrial.perdidasTotal += perdidas;
        historicoCliente.industrial.costoTotal += costo;
      });

      res.json(historicoCliente);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener el histórico de consumos por cliente' });
    });
});


module.exports = router;
