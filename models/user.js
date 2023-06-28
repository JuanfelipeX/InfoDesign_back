const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('prueba_jah', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // Almacenar la contraseña como un hash en lugar de texto plano
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hashedPassword);
    },
  },
  image: {
    type: DataTypes.STRING,
  },
});

User.sync()
  .then(() => {
    console.log('Modelo de usuario sincronizado correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar el modelo de usuario:', error);
  });

module.exports = User;
