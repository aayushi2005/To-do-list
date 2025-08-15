import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: tasks, loading } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);

  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    documents: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchTasks(filters));
  }, [filters, user, dispatch, navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'documents') {
        for (let file of val) formData.append('documents', file);
      } else if (key === 'assignedTo') {
        if (val.trim()) formData.append('assignedTo', val);
      } else {
        formData.append(key, val);
      }
    });

    try {
      await api.post('/tasks', formData);
      navigate('/tasks');
    } catch (err) {
      alert('Failed to create task');
    }
  };

  if (!user) return <div className="p-6 text-center">Redirecting to login...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Task Dashboard</h1>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 md:grid-cols-2 mb-10 bg-white p-6 rounded shadow"
      >
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          required
          className="p-2 border rounded"
        />
        <input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="p-2 border rounded"
        />
        <select
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
          className="p-2 border rounded"
        />
        {user?.role === 'admin' && (
          <input
            value={form.assignedTo}
            onChange={e => setForm({ ...form, assignedTo: e.target.value })}
            placeholder="Assign to user ID"
            className="p-2 border rounded"
          />
        )}
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={e => setForm({ ...form, documents: e.target.files })}
          className="p-2 border rounded bg-white"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Create Task
        </button>
      </form>

      <div className="flex gap-4 mb-6">
        <select
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">Filter by Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <div key={task._id} className="bg-white border rounded shadow p-4">
              <h3 className="text-xl font-semibold text-blue-700">{task.title}</h3>
              <p className="text-gray-600 mb-1">{task.description}</p>
              <p className="text-sm">Status: <strong>{task.status}</strong></p>
              <p className="text-sm">Priority: <strong>{task.priority}</strong></p>
              <p className="text-sm mb-2">Due: {task.dueDate?.slice(0, 10)}</p>

              {task.createdBy === user._id && (
                <p className="text-xs italic text-gray-500">Created by you</p>
              )}
              {task.assignedTo === user._id && task.createdBy !== user._id && (
                <p className="text-xs italic text-green-600">Assigned to you</p>
              )}

              {(task.documents || []).map((doc, i) => (
                <a
                  key={i}
                  href={`http://localhost:5000/${doc}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm block"
                >
                  📎 Document {i + 1}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
