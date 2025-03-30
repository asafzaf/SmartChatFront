// src/containers/AppContainer.jsx
import { useAuth } from '../context/AuthContext';

function AppContainer() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome to the App</h1>
        <div className="user-info">
          <span>Logged in as: {currentUser.email}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      
      <main className="app-content">
        <p>Your application content goes here.</p>
        <p>You are now authenticated and have access to protected resources.</p>
      </main>
    </div>
  );
}

export default AppContainer;