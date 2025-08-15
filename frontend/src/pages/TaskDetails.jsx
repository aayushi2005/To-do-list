import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        const t = res.data;
        setTask(t);
        setForm({
          title: t.title,
          description: t.description || '',
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate ? t.dueDate.slice(0, 10) : ''
        });
      } catch (err) {
        console.error(err);
        alert('Task not found');
        navigate('/tasks');
      }
    };
    fetchTask();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      for (let file of documents) {
        fd.append('documents', file);
      }

      await api.put(`/tasks/${id}`, fd);
      alert('Task updated successfully');
      navigate('/tasks');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (!task) return <div className="p-6 text-center">Loading task...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Task</h2>

      <form onSubmit={handleUpdate} className="grid gap-5 bg-white p-6 rounded-lg shadow-md">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Description</span>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded resize-y min-h-[100px] focus:outline-none focus:ring focus:border-blue-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="mb-1 font-medium">Status</span>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="mb-1 font-medium">Priority</span>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Due Date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Upload Documents (PDF)</span>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={e => setDocuments([...e.target.files])}
            className="p-2 border rounded bg-white"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Update Task
        </button>
      </form>

      {task.documents?.length > 0 && (
        <div className="mt-8 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Existing Documents</h3>
          <ul className="list-disc list-inside space-y-1">
            {task.documents.map((doc, i) => (
              <li key={i}>
                <a
                  href={`http://localhost:5000/${doc}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
