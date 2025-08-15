import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails'; // ✅ will act as home after login
import ProtectedRoute from './components/ProtectedRoute';
import MyTasks from './pages/MyTasks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/tasks" element={<MyTasks />} /> {/* ✅ main dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task/:id" element={<TaskDetails />} /> {/* Optional: if you want individual task view */}
        </Route>
        <Route path="*" element={<Login />} /> {/* fallback route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
