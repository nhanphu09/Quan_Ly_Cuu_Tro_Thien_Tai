import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Donate from './pages/Donate';
import Admin from './pages/Admin';
import MapPage from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import CampaignDetail from './pages/CampaignDetail';
import Statement from './pages/Statement';
import Profile from './pages/Profile';
import Volunteer from './pages/Volunteer';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LiveFeed from './components/LiveFeed';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <LiveFeed />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/statement" element={<Statement />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
