require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);

if (config.APP.NODE_ENV !== 'test') {
  connectDB();
  app.listen(config.APP.PORT, () => {
    console.log(`🟢 Server corriendo en http://localhost:${config.APP.PORT}`);
  });
}

module.exports = app;
