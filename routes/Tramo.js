const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Tramo = require('../models/tramo.js');


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

  Tramo.findAll({
    where: {
      fecha: {
        [Op.between]: [fechaInicial, fechaFinal] // Filtrar por el rango de fechas
      }
    },
    attributes: ['linea', 'fecha', 'residencial', 'comercial', 'industrial'],
  })
    .then((tramos) => {
      const historias = tramos.map((tramo) => {
        const consumo = tramo.residencial + tramo.comercial + tramo.industrial;
        const perdidas = tramo.residencial * 0.1 + tramo.comercial * 0.1 + tramo.industrial * 0.1; // Supongamos una tasa de pérdida del 10% para cada categoría
        const costo = consumo * 0.15; // Supongamos un costo de consumo de $0.15 por unidad

        return {
          linea: tramo.linea,
          fecha: tramo.fecha,
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


// Obtener el histórico de consumos por cliente para un período de tiempo específico
router.post('/historico-consumos', (req, res) => {
  const fechaInicial = req.body.fechaInicial;
  const fechaFinal = req.body.fechaFinal;

  // Verificar si las fechas son válidas
  if (!fechaInicial || !fechaFinal) {
    res.status(400).json({ error: 'Falta la fecha inicial o final' });
    return;
  }

  Tramo.findAll({
    where: {
      fecha: {
        [Op.between]: [fechaInicial, fechaFinal] // Filtrar por el rango de fechas
      }
    },
    attributes: ['linea', 'fecha', 'residencial', 'comercial', 'industrial'],
  })
    .then((tramos) => {
      const historicoConsumos = {
        residencial: {
          tramo: '',
          consumo: 0,
          perdidas: 0,
          costo: 0,
        },
        comercial: {
          tramo: '',
          consumo: 0,
          perdidas: 0,
          costo: 0,
        },
        industrial: {
          tramo: '',
          consumo: 0,
          perdidas: 0,
          costo: 0,
        },
      };

      tramos.forEach((tramo) => {
        const consumoResidencial = tramo.residencial;
        const consumoComercial = tramo.comercial;
        const consumoIndustrial = tramo.industrial;

        const perdidasResidencial = consumoResidencial * 0.1; // Supongamos una tasa de pérdida del 10% para residencial
        const perdidasComercial = consumoComercial * 0.1; // Supongamos una tasa de pérdida del 10% para comercial
        const perdidasIndustrial = consumoIndustrial * 0.1; // Supongamos una tasa de pérdida del 10% para industrial

        const costoResidencial = consumoResidencial * 0.15; // Supongamos un costo de consumo de $0.15 por unidad para residencial
        const costoComercial = consumoComercial * 0.15; // Supongamos un costo de consumo de $0.15 por unidad para comercial
        const costoIndustrial = consumoIndustrial * 0.15; // Supongamos un costo de consumo de $0.15 por unidad para industrial

        if (consumoResidencial > historicoConsumos.residencial.consumo) {
          historicoConsumos.residencial.tramo = tramo.linea;
          historicoConsumos.residencial.consumo = consumoResidencial;
          historicoConsumos.residencial.perdidas = perdidasResidencial;
          historicoConsumos.residencial.costo = costoResidencial;
        }

        if (consumoComercial > historicoConsumos.comercial.consumo) {
          historicoConsumos.comercial.tramo = tramo.linea;
          historicoConsumos.comercial.consumo = consumoComercial;
          historicoConsumos.comercial.perdidas = perdidasComercial;
          historicoConsumos.comercial.costo = costoComercial;
        }

        if (consumoIndustrial > historicoConsumos.industrial.consumo) {
          historicoConsumos.industrial.tramo = tramo.linea;
          historicoConsumos.industrial.consumo = consumoIndustrial;
          historicoConsumos.industrial.perdidas = perdidasIndustrial;
          historicoConsumos.industrial.costo = costoIndustrial;
        }
      });

      res.json(historicoConsumos);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener el histórico de consumos por cliente' });
    });
});


// Obtener el top 20 de los peores tramos/cliente con mayores pérdidas
router.post('/top-peores-tramos-cliente', (req, res) => {
  const fechaInicial = req.body.fechaInicial;
  const fechaFinal = req.body.fechaFinal;

  // Verificar si las fechas son válidas
  if (!fechaInicial || !fechaFinal) {
    res.status(400).json({ error: 'Falta la fecha inicial o final' });
    return;
  }

  Tramo.findAll({
    where: {
      fecha: {
        [Op.between]: [fechaInicial, fechaFinal] // Filtrar por el rango de fechas
      }
    },
    attributes: ['linea', 'fecha', 'residencial', 'comercial', 'industrial'],
    order: [['residencial', 'DESC'], ['comercial', 'DESC'], ['industrial', 'DESC']],
    limit: 20,
  })
    .then((tramos) => {
      const peoresTramosCliente = tramos.map((tramo) => {
        const perdidasResidencial = tramo.residencial * 0.1; // Supongamos una tasa de pérdida del 10% para residencial
        const perdidasComercial = tramo.comercial * 0.1; // Supongamos una tasa de pérdida del 10% para comercial
        const perdidasIndustrial = tramo.industrial * 0.1; // Supongamos una tasa de pérdida del 10% para industrial

        return {
          linea: tramo.linea,
          fecha: tramo.fecha,
          perdidasResidencial,
          perdidasComercial,
          perdidasIndustrial,
        };
      });

      res.json(peoresTramosCliente);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener el top 20 de los peores tramos/cliente' });
    });
});


module.exports = router;
