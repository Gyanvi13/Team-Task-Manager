import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (auth?.loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-200">Loading...</div>;
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
