import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import api from '../api';
import { logout } from '../redux/authSlice';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        await api.get('/tasks'); // safe route to trigger backend check
      } catch (err) {
        if (err.response?.status === 401) {
          dispatch(logout());
        }
      }
    };

    if (token) {
      checkTokenValidity();
    }
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedRoute;
