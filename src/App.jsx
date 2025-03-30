// src/App.jsx
import { useAuth } from './context/AuthContext';
import AuthContainer from './containers/AuthContainer';
import AppContainer from './containers/AppContainer';
import LoadingSpinner from './components/general/LoadingSpinner';
import './App.css';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-wrapper">
      {currentUser ? <AppContainer /> : <AuthContainer />}
    </div>
  );
}

export default App;