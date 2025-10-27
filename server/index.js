const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => res.json({ status: 'ok', app: 'SchoolHub API' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/teachers', require('./routes/teacher.routes'));
app.use('/api/classes', require('./routes/class.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/fees', require('./routes/fee.routes'));
app.use('/api/exams', require('./routes/exam.routes'));
app.use('/api/moodle', require('./routes/moodle.routes'));
app.use('/api/timetable', require('./routes/timetable.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));

// Sockets
require('./sockets/chat')(io);

// Start server only after DB connection, with port retry if in use
const basePort = Number(process.env.PORT) || 4000;

function listenOnce(port) {
  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.off('listening', onListening);
      reject(err);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve(port);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port, () => console.log(`Server listening on ${port}`));
  });
}

(async () => {
  try {
    await connectDB();
    let port = basePort;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        await listenOnce(port);
        break; // success
      } catch (err) {
        if (err && err.code === 'EADDRINUSE') {
          const next = port + 1;
          console.warn(`[Server] Port ${port} in use. Trying ${next}...`);
          port = next;
          continue;
        }
        throw err;
      }
    }
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();


