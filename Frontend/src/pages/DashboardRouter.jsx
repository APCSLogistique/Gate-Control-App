import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard'; // Admin Dashboard
import OperatorDashboard from './operator/OperatorDashboard';
import TransiteurDashboard from './transiteur/TransiteurDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  // Route to the appropriate dashboard based on user role
  switch (user?.role) {
    case 'operator':
      return <OperatorDashboard />;
    case 'carrier':
      return <TransiteurDashboard />;
    case 'admin':
    default:
      return <Dashboard />;
  }
};

export default DashboardRouter;
