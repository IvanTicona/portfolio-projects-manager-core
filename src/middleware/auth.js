const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT } = require('../config/index');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies[JWT.COOKIE_NAME];
    if (!token) return res.status(401).json({ msg: 'No autenticado' });

    const { userId } = jwt.verify(token, JWT.SECRET);
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ msg: 'Usuario no válido' });
    
    req.user = user;
    next();
  } catch {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
