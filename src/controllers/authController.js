const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT, APP } = require('../config/index');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashed });
    await user.save();
    res.status(201).json({ msg: 'Usuario creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: user._id }, JWT.SECRET, { expiresIn: '7d' });
    res
      .cookie(JWT.COOKIE_NAME, token, {
        httpOnly: true,
        secure: APP.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ msg: 'Login exitoso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(JWT.COOKIE_NAME).json({ msg: 'Logout exitoso' });
};

exports.me = async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    id: req.user._id
  });
};
