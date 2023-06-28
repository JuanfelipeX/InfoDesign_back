const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Función para generar un token JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };
  const options = {
    expiresIn: '1h', // Tiempo de expiración del token (1 hora en este ejemplo)
  };
  const token = jwt.sign(payload, 'secretKey', options); // 'secretKey' es la clave secreta para firmar el token
  return token;
}

// Función para verificar el token JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'secretKey');
    return decoded;
  } catch (error) {
    return null;
  }
}

// Función para comparar la contraseña ingresada con la contraseña almacenada
function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  generateToken,
  verifyToken,
  comparePassword,
};
