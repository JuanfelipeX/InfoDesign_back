const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const { generateToken, verifyToken, comparePassword } = require('../routes/auth.js');


// Obtener la lista completa de usuarios
router.get('/', (req, res) => {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const { name, email, password, image } = req.body;

  User.create({ name, email, password, image })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al crear un nuevo usuario' });
    });
});


// Obtener los detalles de un usuario específico
router.get('/:id', (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener los detalles del usuario' });
    });
});

// Actualizar los detalles de un usuario específico
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, image } = req.body;

  User.findByPk(userId)
    .then((user) => {
      if (user) {
        user.name = name;
        user.email = email;
        user.image = image;
        return user.save();
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al actualizar los detalles del usuario' });
    });
});

// Eliminar un usuario específico
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((user) => {
      if (user) {
        return user.destroy();
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    })
    .then(() => {
      res.json({ message: 'Usuario eliminado correctamente' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    });
});

// Ruta para iniciar sesión y generar un token JWT
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por su correo electrónico
  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
      } else {
        // Comparar la contraseña ingresada con la contraseña almacenada en la base de datos
        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        } else {
          // Generar un token JWT
          const token = generateToken(user);

          // Devolver el token como respuesta
          res.json({ token });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    });
});

// Rutas protegidas con JWT
router.get('/', (req, res) => {
  const token = req.headers.authorization;

  // Verificar el token JWT
  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    res.status(401).json({ error: 'Token inválido' });
  } else {
    // Si el token es válido, realizar la lógica de la ruta aquí
    // Obtener la lista completa de usuarios, crear un nuevo usuario, etc.
  }
});

// Resto de los endpoints y lógica de la API


module.exports = router;
