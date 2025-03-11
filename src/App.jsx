import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Recipe from './pages/Recipe.jsx';
import Auth from './components/Auth.jsx';
import AddEditRecipe from './components/AddEditRecipe.jsx';
import Header from './components/Header.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/about" element={user ? <About /> : <Navigate to="/auth" />} />
        <Route path="/recipe/:id" element={user ? <Recipe /> : <Navigate to="/auth" />} />
        <Route path="/add-recipe" element={user ? <AddEditRecipe /> : <Navigate to="/auth" />} />
        <Route path="/edit-recipe/:id" element={user ? <AddEditRecipe /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      </Routes>
    </Router>
  );
}

export default App;