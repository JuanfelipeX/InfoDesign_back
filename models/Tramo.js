const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('prueba_designinfo', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

const Tramo = sequelize.define('Tramo', {
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

Tramo.sync()
  .then(() => {
    console.log('Modelo Tramo sincronizado correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo de Tramo :', error);
  });

module.exports = Tramo;
