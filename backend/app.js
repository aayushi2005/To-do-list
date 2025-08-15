import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.js';

const app = express();

// ✅ Ensure 'uploads' folder exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:5173', // ✅ your frontend URL
  credentials: true // if using cookies or authorization headers
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir)); // Serve uploaded files

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default app;
