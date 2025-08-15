import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MyTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: tasks, loading } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) dispatch(fetchTasks());
  }, [dispatch, user]);

  const myTasks = tasks.filter(
    t => t.createdBy?.toString() === user?._id || t.assignedTo?.toString() === user?._id
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      dispatch(fetchTasks());
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Add New Task
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : myTasks.length === 0 ? (
        <p className="text-gray-500">No tasks created or assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTasks.map(task => (
            <div key={task._id} className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <p className="text-sm"><strong>Status:</strong> {task.status}</p>
              <p className="text-sm"><strong>Priority:</strong> {task.priority}</p>
              <p className="text-sm"><strong>Due:</strong> {task.dueDate?.slice(0, 10) || 'N/A'}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/task/${task._id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/task/${task._id}`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
