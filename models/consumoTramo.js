const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('prueba_designinfo', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

const ConsumoTramo = sequelize.define('ConsumoTramo', {
  linea: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  residencial: {
    type: DataTypes.INTEGER,
  },
  comercial: {
    type: DataTypes.INTEGER,
  },
  industrial: {
    type: DataTypes.INTEGER,
  },
});

ConsumoTramo.sync()
  .then(() => {
    console.log('Modelo de Pelicula sincronizado correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo de Peliculas:', error);
  });

module.exports = ConsumoTramo;
