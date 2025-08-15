import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getSingleTask
} from '../controllers/taskController.js';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  fileFilter: (_, file, cb) => {
    if (!file.originalname.match(/\.(pdf)$/)) return cb(new Error('Only PDF files allowed'), false);
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).array('documents', 3);

router.post('/', protect, upload, createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getSingleTask);
router.put('/:id', protect, upload, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
