import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostScreen from './screens/PostScreen';
import SearchScreen from './screens/SearchScreen';
import Navigator from './navigation/Navigator';
import PrivateRoute from './components/PrivateRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AuthScreen />} />
          <Route path="/home" element={<PrivateRoute><MainLayout><HomeScreen /></MainLayout></PrivateRoute>} />
          <Route path="/profile/:userId" element={<MainLayout><ProfileScreen /></MainLayout>} />
          <Route path="/post" element={<PrivateRoute><MainLayout><PostScreen /></MainLayout></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><MainLayout><SearchScreen /></MainLayout></PrivateRoute>} />
          <Route path="/profile" element={<MainLayout><ProfileScreen /></MainLayout>} />
        </Routes>
      </div>
    </Router>
  );
}

function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <div className="mainContent">
        {children}
      </div>
      <Navigator />
    </div>
  );
}

export default App;
