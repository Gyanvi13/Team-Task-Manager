const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');

const fs = require('fs');
const path = require('path');

const app = express();

// Serve client static files when present (built Vite production files)
try {
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');

  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }
} catch (err) {
  // If anything goes wrong, continue without serving static files
  console.warn('Client static files not served:', err.message || err);
}

const normalizeOrigin = (value) => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch (error) {
    return value.replace(/\/$/, '');
  }
};

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
  ]
    .map(normalizeOrigin)
    .filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);

      if (!normalizedOrigin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(normalizedOrigin)) {
        return callback(null, true);
      }

      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) {
        return callback(null, true);
      }

      if (/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
