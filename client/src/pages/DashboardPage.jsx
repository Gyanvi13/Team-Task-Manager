import { useAuth } from '../context/AuthContext';
import AdminDashboardPage from './AdminDashboardPage';
import MemberDashboardPage from './MemberDashboardPage';

const DashboardPage = () => {
  const auth = useAuth();

  if (auth?.user?.role === 'admin') {
    return <AdminDashboardPage />;
  }

  return <MemberDashboardPage />;
};

export default DashboardPage;
