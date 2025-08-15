import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user._id // ✅ ensure this is set
    };

    if (req.files?.length) {
      taskData.documents = req.files.map(file => file.path);
    }

    if (!taskData.assignedTo) {
      delete taskData.assignedTo;
    }

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};



export const getTasks = async (req, res) => {
  try {
    const filters = {};

    // Optional filters from frontend
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;

    // ✅ Return tasks created by OR assigned to the user
    filters.$or = [
      { createdBy: req.user._id },
      { assignedTo: req.user._id }
    ];

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};


export const getSingleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isOwner = task.createdBy?.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

    if (!isOwner && !isAssignee) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isOwner =
      req.user.role === 'admin' || task.createdBy?.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Forbidden' });

    const updates = { ...req.body };

    if (req.files?.length) {
      updates.documents = req.files.map(file => file.path);
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};


export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete' });
  }

  await task.deleteOne();
  res.json({ message: 'Task deleted' });
};

