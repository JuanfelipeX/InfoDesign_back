const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('prueba_designinfo', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

const CostoTramo = sequelize.define('CostoTramo', {
  linea: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  residencial: {
    type: DataTypes.DOUBLE,
  },
  comercial: {
    type: DataTypes.DOUBLE,
  },
  industrial: {
    type: DataTypes.DOUBLE,
  },
});

CostoTramo.sync()
  .then(() => {
    console.log('Modelo de Costo por Tramo sincronizado correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo de Costo por Tramo :', error);
  });

module.exports = CostoTramo;
